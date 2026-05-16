const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./database');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allows both local dev and your Vercel frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,         // set this on Render to your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve uploaded files ──────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directories exist on startup
['uploads', 'uploads/profiles', 'uploads/reports', 'uploads/proofs', 'uploads/items'].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/items',        itemRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/admin',        adminRoutes);

// ── Health check (used by UptimeRobot to keep Render awake) ──────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'UniLost API is running' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
db.initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 UniLost Backend running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app;