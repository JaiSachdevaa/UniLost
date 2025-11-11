const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { runQuery, getOne } = require('../database');
const { sendOTPEmail } = require('../emailService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'unilost_secret_key_2025';

// In-memory OTP storage (you can use Redis for production)
const otpStore = new Map();

// Email validation function
const isValidMUJEmail = (email) => {
  return email.toLowerCase().endsWith('@muj.manipal.edu');
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Validate MUJ email
    if (!isValidMUJEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Only @muj.manipal.edu email addresses are allowed' 
      });
    }

    // Check if user already exists
    const existingUser = await getOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered. Please login instead.' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt,
      name
    });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    console.log(`📧 OTP sent to ${email}: ${otp}`); // For development - remove in production

    res.json({
      success: true,
      message: 'OTP sent to your email. Please check your inbox.',
      expiresIn: 600 // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP. Please try again.' 
    });
  }
});

// Verify OTP and Register
router.post('/verify-otp-register', async (req, res) => {
  try {
    const { email, otp, password, phone } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, OTP, and password are required' 
      });
    }

    // Get stored OTP
    const storedData = otpStore.get(email.toLowerCase());

    if (!storedData) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP expired or not found. Please request a new OTP.' 
      });
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new OTP.' 
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP. Please try again.' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists (double check)
    const existingUser = await getOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await runQuery(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [storedData.name, email.toLowerCase(), hashedPassword, phone]
    );

    // Delete OTP after successful registration
    otpStore.delete(email.toLowerCase());

    // Generate token
    const token = jwt.sign({ userId: result.lastID, email: email.toLowerCase() }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to UniLost.',
      token,
      user: {
        id: result.lastID,
        name: storedData.name,
        email: email.toLowerCase(),
        phone
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// Login user (no OTP needed for login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Validate MUJ email
    if (!isValidMUJEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Only @muj.manipal.edu email addresses are allowed' 
      });
    }

    // Find user
    const user = await getOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profile_image
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

// Verify token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getOne(
      'SELECT id, name, email, phone, address_line1, address_line2, gender, dob, profile_image FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user data' 
    });
  }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;