import express from 'express';
import { createEvent, getMyEvents, getEventById } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createEvent);
router.route('/myevents').get(protect, getMyEvents);
router.route('/:id').get(protect, getEventById);

export default router;
