import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add guest name'],
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    guestType: {
      type: String,
      enum: ['Adult', 'Child', 'VIP'],
      default: 'Adult',
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Checked-in'],
      default: 'Pending',
    },
    qrCodeString: {
      type: String,
      // unique string to generate QR code later
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

const Guest = mongoose.model('Guest', guestSchema);

export default Guest;
