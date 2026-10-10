import Guest from '../models/Guest.js';
import Event from '../models/Event.js';
import crypto from 'crypto';

// @desc    Add a guest to an event
// @route   POST /api/guests
// @access  Private
export const addGuest = async (req, res) => {
  try {
    const { event, name, email, phone, guestType } = req.body;

    // Verify ownership
    const eventExists = await Event.findById(event);
    if (!eventExists || eventExists.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this event' });
    }

    const qrCodeString = crypto.randomBytes(16).toString('hex');

    const guest = new Guest({
      event,
      name,
      email,
      phone,
      guestType,
      qrCodeString,
    });

    const createdGuest = await guest.save();
    res.status(201).json(createdGuest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all guests for an event
// @route   GET /api/guests/:eventId
// @access  Private
export const getEventGuests = async (req, res) => {
  try {
    const eventExists = await Event.findById(req.params.eventId);
    if (!eventExists || eventExists.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this event' });
    }

    const guests = await Guest.find({ event: req.params.eventId }).sort({ createdAt: -1 });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update guest status (RSVP)
// @route   PUT /api/guests/:id/status
// @access  Public (Because guests use this via public link)
export const updateGuestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // In a real app, verify by a secure token, here we simplify
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    guest.status = status;
    const updatedGuest = await guest.save();
    
    // TODO: Emit socket notification to event owner
    
    res.json(updatedGuest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
