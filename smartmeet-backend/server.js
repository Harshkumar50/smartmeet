// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Render provides PORT automatically
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// FRONTEND_URL from environment (Vercel frontend)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS setup
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Middleware for parsing JSON
app.use(express.json());

// ===== Test endpoint =====
app.get('/api/test', (req, res) => {
  res.json({ status: 'Backend is reachable!' });
});

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// ===== MongoDB Connection & Server Start =====
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`SmartMeet API running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });