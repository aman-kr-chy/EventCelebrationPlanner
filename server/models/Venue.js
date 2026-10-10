import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a venue name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    location: {
      city: { type: String, required: true },
      address: { type: String, required: true },
      googleMapsUrl: String,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    facilities: [String],
    images: [String],
    venueType: {
      type: String,
      enum: ['Banquet Hall', 'Farmhouse', 'Resort', 'Hotel', 'Outdoor', 'Beach', 'Other'],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;
