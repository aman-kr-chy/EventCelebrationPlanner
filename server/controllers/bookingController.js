import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import Payment from '../models/Payment.js';

import sendEmail from '../utils/sendEmail.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req, res) => {
  try {
    const { event, contactName, contactEmail, contactPhone, bookingType, venue, vendor, serviceDetails, totalAmount, bookingDate, notes } = req.body;

    // Verify event belongs to customer if provided
    if (event) {
      const userEvent = await Event.findById(event);
      if (!userEvent || userEvent.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: 'Event not found or not authorized' });
      }
    }

    const booking = new Booking({
      customer: req.user._id,
      event,
      contactName,
      contactEmail,
      contactPhone,
      bookingType,
      venue,
      vendor,
      serviceDetails,
      totalAmount,
      bookingDate,
      notes,
    });

    const createdBooking = await booking.save();
    
    // Instead of creating a dummy payment, we just return the booking so the frontend can initiate Razorpay
    
    // Send email notification
    try {
      const message = `Dear ${contactName},\n\nYour booking request for the ${bookingType} on ${new Date(bookingDate).toLocaleDateString()} has been received.\nTotal Amount: ₹${totalAmount}\n\nWe will get back to you shortly.\n\nThanks,\nEvent Planner Team`;
      
      await sendEmail({
        email: contactEmail,
        subject: 'Booking Confirmation - Event Planner',
        message
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // We still return 201 because booking was created successfully
    }

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in customer's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('venue', 'name location')
      .populate('vendor', 'businessName category')
      .populate('event', 'title date');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Vendor/Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (Vendor/Admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('vendor venue');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization: Vendor owner can update vendor bookings, Admin can update venue bookings
    // Simplification for prototype
    
    booking.status = status;
    const updatedBooking = await booking.save();
    
    // TODO: Send Socket.io notification to customer here

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
