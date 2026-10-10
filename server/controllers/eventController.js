import Event from '../models/Event.js';

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const { title, eventType, date, startTime, endTime, expectedGuests, budget, description, location } = req.body;

    const event = new Event({
      user: req.user._id,
      title,
      eventType,
      date,
      startTime,
      endTime,
      expectedGuests,
      budget,
      description,
      location,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user events
// @route   GET /api/events/myevents
// @access  Private
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('venue')
      .populate('user', 'name email');

    if (event) {
      // Check if user is owner or admin
      if (event.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this event' });
      }
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
