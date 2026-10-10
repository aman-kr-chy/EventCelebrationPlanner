import express from 'express';
import { getVenues, getVenueById, createVenue } from '../controllers/venueController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getVenues)
  .post(protect, authorize('admin', 'vendor'), createVenue);
  
router.route('/:id').get(getVenueById);

export default router;
