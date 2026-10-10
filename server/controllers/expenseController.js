import Expense from '../models/Expense.js';
import Event from '../models/Event.js';

// @desc    Add an expense to an event
// @route   POST /api/expenses
// @access  Private
export const addExpense = async (req, res) => {
  try {
    const { event, category, amount, description, isPaid } = req.body;

    const eventExists = await Event.findById(event);
    if (!eventExists || eventExists.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this event' });
    }

    const expense = new Expense({
      event,
      category,
      amount,
      description,
      isPaid,
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all expenses for an event
// @route   GET /api/expenses/:eventId
// @access  Private
export const getEventExpenses = async (req, res) => {
  try {
    const eventExists = await Event.findById(req.params.eventId);
    if (!eventExists || eventExists.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this event' });
    }

    const expenses = await Expense.find({ event: req.params.eventId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('event');
    
    if (!expense || expense.event.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    expense.isPaid = req.body.isPaid !== undefined ? req.body.isPaid : expense.isPaid;
    
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
