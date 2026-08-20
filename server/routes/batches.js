import express from 'express';
import { store, REGISTERED_SUPPLIERS } from '../data/store.js';
import { calculateFootprint } from '../utils/carbonCalculator.js';
import QRCode from 'qrcode';

const router = express.Router();

// Get all batches
router.get('/', (req, res) => {
  const batches = store.getBatches();
  res.json({ success: true, data: batches });
});

// Reset demo endpoint
router.post('/reset-demo', (req, res) => {
  const batches = store.resetDemo();
  res.json({ success: true, data: batches, message: 'Demo state successfully restored to initial seeds.' });
});

// Get suppliers metadata
router.get('/meta/suppliers', (req, res) => {
  res.json({ success: true, data: REGISTERED_SUPPLIERS });
});

// Calculate live carbon preview
router.post('/preview-footprint', (req, res) => {
  try {
    const footprint = calculateFootprint(req.body);
    res.json({ success: true, data: footprint });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get single batch by id or passport id
router.get('/:id', (req, res) => {
  const batch = store.getBatchById(req.params.id);
  if (!batch) {
    return res.status(404).json({ success: false, message: 'Batch not found' });
  }
  res.json({ success: true, data: batch });
});

// Create new garment batch
router.post('/', (req, res) => {
  try {
    const newBatch = store.createBatch(req.body);
    res.status(201).json({ success: true, data: newBatch });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Dyer role submits dyeing record
router.post('/:id/dyeing', (req, res) => {
  try {
    const updated = store.updateDyeingRecord(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// CETP role submits effluent record
router.post('/:id/cetp', (req, res) => {
  try {
    const updated = store.updateCetpRecord(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Generate DPP for batch
router.post('/:id/generate-passport', (req, res) => {
  try {
    const batch = store.generatePassport(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: batch });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Generate QR Code image data URL
router.get('/:id/qr-image', async (req, res) => {
  try {
    const batch = store.getBatchById(req.params.id);
    if (!batch || !batch.passport) {
      return res.status(404).json({ success: false, message: 'Passport not generated for this batch' });
    }
    const qrDataUrl = await QRCode.toDataURL(batch.passport.qrCodeData, {
      width: 400,
      margin: 2,
      color: {
        dark: '#4C1D95',
        light: '#ffffff'
      }
    });
    res.json({ success: true, dataUrl: qrDataUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
