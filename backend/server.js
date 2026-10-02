import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import orderRoutes from './routes/orders.js';
import affiliateRoutes from './routes/affiliates.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
// cPanel / Passenger injects PORT at runtime - respect it
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Trust cPanel / Cloudflare / Nginx proxies so req.ip + secure cookies work
app.set('trust proxy', 1);

// CORS configuration - production (cPanel) + local dev
const extraOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const allowedOrigins = [
  'https://melodivaproducts.com',
  'https://www.melodivaproducts.com',
  'https://api.melodivaproducts.com',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  FRONTEND_URL,
  ...extraOrigins
].filter((v, i, a) => v && a.indexOf(v) === i);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // In development allow everything for convenience
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Melodiva API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      profiles: '/api/profiles',
      orders: '/api/orders',
      affiliates: '/api/affiliates',
      contact: '/api/contact',
      admin: '/api/admin'
    }
  });
});

// Health check (includes optional DB status - never throws)
app.get('/health', async (req, res) => {
  let db = 'unknown';
  try {
    const pool = (await import('./config/database.js')).default;
    await pool.query('SELECT 1');
    db = 'connected';
  } catch (e) {
    db = 'disconnected: ' + e.message;
  }
  res.json({
    status: 'ok',
    message: 'Melodiva API is running',
    env: process.env.NODE_ENV || 'development',
    db,
    time: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});
