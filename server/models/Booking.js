import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    bookingType: {
      type: String,
      enum: ['Venue', 'Vendor'],
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    serviceDetails: {
      // Used for specific services booked from a vendor
      name: String,
      price: Number,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Paid', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Ensure that either venue or vendor is provided based on bookingType
bookingSchema.pre('save', function () {
  if (this.bookingType === 'Venue' && !this.venue) {
    throw new Error('Venue ID is required for a venue booking');
  } else if (this.bookingType === 'Vendor' && !this.vendor) {
    throw new Error('Vendor ID is required for a vendor booking');
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
