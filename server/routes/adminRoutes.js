import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/stats')
  .get(protect, authorize('admin'), getAdminStats);

export default router;
