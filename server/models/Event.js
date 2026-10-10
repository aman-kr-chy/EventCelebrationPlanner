import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add an event title'],
    },
    eventType: {
      type: String,
      required: true,
      enum: ['Birthday', 'Wedding', 'Engagement', 'Anniversary', 'Corporate', 'College', 'Festival', 'Other'],
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: String,
    endTime: String,
    expectedGuests: Number,
    budget: {
      type: Number,
      required: true,
    },
    description: String,
    location: {
      city: String,
      address: String,
      googleMapsUrl: String,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
    },
    status: {
      type: String,
      enum: ['planning', 'confirmed', 'completed', 'cancelled'],
      default: 'planning',
    },
    coverImage: String,
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
