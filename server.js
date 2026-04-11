// ============================================
// server.js - Main entry point for ShopVibe API
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────
// Allow requests from your GitHub Pages frontend
app.use(cors({
  origin: [
    'https://priyankakale157-creator.github.io',
    'http://localhost:3000',  // for local dev
    'http://127.0.0.1:5500'  // for VS Code Live Server
  ],
  credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Database Connection ─────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ── Routes ──────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));

// ── Health check route ───────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🛒 ShopVibe API is running!' });
});

// ── Global error handler ─────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ── Start Server ─────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
