import express from 'express';
import { getVendors, getVendorById, createVendorProfile } from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getVendors)
  .post(protect, authorize('vendor', 'admin'), createVendorProfile);
  
router.route('/:id').get(getVendorById);

export default router;
