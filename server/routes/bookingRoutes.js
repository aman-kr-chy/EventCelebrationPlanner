import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('customer', 'admin'), createBooking);

router.route('/mybookings')
  .get(protect, getMyBookings);

router.route('/:id/status')
  .put(protect, authorize('vendor', 'admin'), updateBookingStatus);

export default router;
