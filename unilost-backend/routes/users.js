const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { runQuery, getOne, getAll } = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// ── Multer: profile images ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// ── Multer: report media ──────────────────────────────────────────────────────
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/reports';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  },
});

const reportUpload = multer({
  storage: reportStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Only image and video files are allowed!'));
  },
});

// ── GET /profile ──────────────────────────────────────────────────────────────
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await getOne(
      'SELECT id, name, email, phone, address_line1, address_line2, gender, dob, profile_image FROM users WHERE id = ?',
      [req.user.userId]
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// ── PUT /profile ──────────────────────────────────────────────────────────────
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address_line1, address_line2, gender, dob } = req.body;
    const user = await getOne('SELECT * FROM users WHERE id = ?', [req.user.userId]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await runQuery(
      `UPDATE users
       SET name = ?, phone = ?, address_line1 = ?, address_line2 = ?,
           gender = ?, dob = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name || user.name, phone, address_line1, address_line2, gender, dob, req.user.userId]
    );

    const updatedUser = await getOne(
      'SELECT id, name, email, phone, address_line1, address_line2, gender, dob, profile_image FROM users WHERE id = ?',
      [req.user.userId]
    );
    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// ── PUT /profile/image ────────────────────────────────────────────────────────
router.put('/profile/image', authenticateToken, upload.single('profile_image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });

    const user = await getOne('SELECT profile_image FROM users WHERE id = ?', [req.user.userId]);
    const newImagePath = `/uploads/profiles/${req.file.filename}`;

    if (user && user.profile_image && fs.existsSync(`.${user.profile_image}`)) {
      fs.unlinkSync(`.${user.profile_image}`);
    }

    await runQuery('UPDATE users SET profile_image = ? WHERE id = ?', [newImagePath, req.user.userId]);
    res.json({ success: true, message: 'Profile image updated successfully', profile_image: newImagePath });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

// ── PUT /change-password ──────────────────────────────────────────────────────
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Current and new passwords required' });

    const user = await getOne('SELECT * FROM users WHERE id = ?', [req.user.userId]);
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword)
      return res.status(401).json({ success: false, message: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await runQuery(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, req.user.userId]
    );
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

// ── POST /report — submit a found-item report ─────────────────────────────────
router.post('/report', authenticateToken, reportUpload.single('media'), async (req, res) => {
  try {
    const { item_type, location, time_found, description } = req.body;

    if (!item_type || !location || !time_found || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Image is mandatory
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image of the lost item before submitting.',
      });
    }

    // ── Limit: max 5 reports per user per calendar day ────────────────────────
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayCount = await getOne(
      `SELECT COUNT(*) as count
       FROM reports
       WHERE user_id = ?
         AND DATE(created_at) = ?`,
      [req.user.userId, today]
    );

    if (todayCount && todayCount.count >= 5) {
      return res.status(429).json({
        success: false,
        message: 'You have reached the maximum limit of 5 reports for today.',
      });
    }
    // ─────────────────────────────────────────────────────────────────────────

    const mediaPath = `/uploads/reports/${req.file.filename}`;

    const reportResult = await runQuery(
      'INSERT INTO reports (user_id, item_type, location, time_found, description, media, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
      [req.user.userId, item_type, location, time_found, description, mediaPath]
    );

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully! Admin will review it shortly.',
      reportId: reportResult.lastID,
    });
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
});

// ── GET /reports — user's own reports ────────────────────────────────────────
router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const reports = await getAll(
      'SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
});

module.exports = router;