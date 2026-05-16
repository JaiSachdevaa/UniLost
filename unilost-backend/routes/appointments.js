const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { runQuery, getOne, getAll } = require('../database');
const { authenticateToken, authenticateAdmin } = require('./auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/proofs';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Only image and video files are allowed!'));
  },
});

// ── POST / — book appointment ─────────────────────────────────────────────────
router.post('/', authenticateToken, upload.single('proofFile'), async (req, res) => {
  try {
    const { item_id, item_type, location, time_lost } = req.body;

    if (!item_id) {
      return res.status(400).json({ success: false, message: 'Item ID is required' });
    }

    const item = await getOne('SELECT * FROM items WHERE id = ? AND status = "available"', [item_id]);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found or not available' });
    }

    // ── Limit: max 2 appointments per user per calendar day ───────────────────
    const today = new Date().toISOString().split('T')[0];
    const todayCount = await getOne(
      `SELECT COUNT(*) as count
       FROM appointments
       WHERE user_id = ?
         AND DATE(created_at) = ?
         AND status != 'cancelled'`,
      [req.user.userId, today]
    );

    if (todayCount && todayCount.count >= 2) {
      return res.status(429).json({
        success: false,
        message: 'You have reached the maximum limit of 2 appointments for today.',
      });
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Proof is mandatory
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload proof before submitting your appointment request.',
      });
    }

    const proofFilePath = `/uploads/proofs/${req.file.filename}`;

    const result = await runQuery(
      `INSERT INTO appointments (user_id, item_id, item_type, location, time_lost, proof_file, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.userId, item_id, item_type, location, time_lost, proofFilePath]
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointmentId: result.lastID,
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to book appointment' });
  }
});

// ── GET /my-appointments ──────────────────────────────────────────────────────
// Includes finder contact details (the user who reported the item)
router.get('/my-appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await getAll(
      `SELECT
         a.*,
         i.name          AS item_name,
         i.image         AS item_image,
         i.speciality,
         i.address_line1,
         i.address_line2,
         finder.name     AS finder_name,
         finder.email    AS finder_email,
         finder.phone    AS finder_phone
       FROM appointments a
       JOIN  items i          ON a.item_id      = i.id
       LEFT JOIN users finder ON i.reported_by  = finder.id
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.userId]
    );

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
});

// ── GET /admin/all — admin sees every appointment ─────────────────────────────
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const appointments = await getAll(
      `SELECT
         a.*,
         i.name       AS item_name,
         i.image      AS item_image,
         i.speciality,
         u.name       AS user_name,
         u.email      AS user_email,
         u.phone      AS user_phone,
         finder.name  AS finder_name,
         finder.email AS finder_email,
         finder.phone AS finder_phone
       FROM appointments a
       JOIN  items i          ON a.item_id     = i.id
       JOIN  users u          ON a.user_id     = u.id
       LEFT JOIN users finder ON i.reported_by = finder.id
       ORDER BY a.created_at DESC`
    );
    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
});

// ── GET /:id — single appointment ─────────────────────────────────────────────
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await getOne(
      `SELECT
         a.*,
         i.name          AS item_name,
         i.image         AS item_image,
         i.speciality,
         i.address_line1,
         i.address_line2,
         u.name          AS user_name,
         u.email         AS user_email,
         u.phone         AS user_phone,
         finder.name     AS finder_name,
         finder.email    AS finder_email,
         finder.phone    AS finder_phone
       FROM appointments a
       JOIN  items i          ON a.item_id     = i.id
       JOIN  users u          ON a.user_id     = u.id
       LEFT JOIN users finder ON i.reported_by = finder.id
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (!appointment)
      return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Privacy: mask requester name/phone until proof uploaded
    const proofUploaded = !!appointment.proof_file;
    const safeAppointment = {
      ...appointment,
      user_name:  proofUploaded ? appointment.user_name  : '🔒 Hidden until proof is uploaded',
      user_phone: proofUploaded ? appointment.user_phone : '🔒 Hidden until proof is uploaded',
    };

    res.json({ success: true, appointment: safeAppointment, contactRevealed: proofUploaded });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointment' });
  }
});

// ── DELETE /:id — user deletes own appointment ────────────────────────────────
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await getOne(
      'SELECT * FROM appointments WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    if (!appointment)
      return res.status(404).json({ success: false, message: 'Appointment not found or unauthorized' });

    await runQuery('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete appointment' });
  }
});

// ── DELETE /admin/:id — admin hard-deletes any appointment ───────────────────
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const appointment = await getOne('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    if (!appointment)
      return res.status(404).json({ success: false, message: 'Appointment not found' });

    await runQuery('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Appointment deleted by admin successfully' });
  } catch (error) {
    console.error('Admin delete appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete appointment' });
  }
});

module.exports = router;