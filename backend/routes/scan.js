import express from 'express';
import { runScan } from '../controllers/scanController.js';

const router = express.Router();

// POST /api/scan
router.post('/', runScan);

export default router;
