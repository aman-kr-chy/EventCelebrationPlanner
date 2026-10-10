import express from 'express';
import { addGuest, getEventGuests, updateGuestStatus } from '../controllers/guestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addGuest);

router.route('/:eventId')
  .get(protect, getEventGuests);

// Public route for RSVP
router.route('/:id/status')
  .put(updateGuestStatus);

export default router;
