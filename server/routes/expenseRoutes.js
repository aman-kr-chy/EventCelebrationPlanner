import express from 'express';
import { addExpense, getEventExpenses, updateExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addExpense);

router.route('/:eventId')
  .get(protect, getEventExpenses);

router.route('/:id')
  .put(protect, updateExpense);

export default router;
