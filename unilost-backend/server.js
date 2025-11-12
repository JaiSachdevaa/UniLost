const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./database');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin'); 

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); 


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'UniLost API is running' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


db.initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 UniLost Backend Server running on port ${PORT}`);
      console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
      console.log(`👤 Admin: ${process.env.ADMIN_EMAIL || 'admin@muj.manipal.edu'}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app;