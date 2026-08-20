import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// Get cumulative sustainability & exporter analytics
router.get('/', (req, res) => {
  try {
    const analytics = store.getAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
