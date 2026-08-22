import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import batchRoutes from './routes/batches.js';
import analyticsRoutes from './routes/analytics.js';
import certificateRoutes from './routes/certificates.js';
import authRoutes from './routes/auth.js';
import { store } from './data/store.js';
import { initializeDatabase } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize MySQL Database Schema & Seed Data
initializeDatabase();

app.use(cors());
app.use(express.json());

// Security Rate Limiting (5 requests per 15 minutes per IP for sensitive auth routes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 minutes window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth requests from this IP. Please try again after 15 minutes.' }
});

// Serve uploaded certificates and proofs statically
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/certificates', certificateRoutes);

// Public verification endpoint
app.get('/api/verify/:passportId', (req, res) => {
  const batch = store.getBatchByPassportId(req.params.passportId) || store.getBatchById(req.params.passportId);
  if (!batch || !batch.passport) {
    return res.status(404).json({
      success: false,
      message: 'Passport ID not found or not yet generated.'
    });
  }
  res.json({
    success: true,
    data: {
      passport: batch.passport,
      garment: {
        id: batch.id,
        title: batch.garmentTitle,
        styleCode: batch.styleCode,
        garmentType: batch.garmentType,
        fabricType: batch.fabricType,
        fabricDescription: batch.fabricDescription,
        yarnSpinningMill: batch.yarnSpinningMill,
        quantity: batch.quantity,
        pieceWeightKg: batch.pieceWeightKg,
        orderRef: batch.orderRef,
        buyerName: batch.buyerName,
        targetCountry: batch.targetCountry,
        destinationPort: batch.destinationPort,
      },
      exporter: {
        name: 'Sri Jayavarma Knits & Exports Pvt Ltd',
        location: 'Tiruppur, Tamil Nadu, India',
        udyamNumber: 'UDYAM-TN-28-0019284',
      },
      supplyChain: {
        dyer: {
          name: batch.dyerName,
          record: batch.dyeingRecord,
        },
        cetp: {
          name: batch.cetpName,
          record: batch.cetpRecord,
        }
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'VastraSetu DPP Backend', timestamp: new Date().toISOString() });
});

// Global Security Error Handling Middleware (No stack traces exposed to client)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message && err.status ? err.message : 'An internal security error occurred. Please try again later.'
  });
});

app.listen(PORT, () => {
  console.log(`🌿 VastraSetu Backend API running on http://localhost:${PORT}`);
});
