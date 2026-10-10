import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: [true, 'Please add a business name'],
    },
    category: {
      type: String,
      enum: ['Catering', 'Photography', 'Decoration', 'DJ/Music', 'Makeup', 'Florist', 'Wedding Planner', 'Security', 'Transportation', 'Cake', 'Entertainment', 'Fresher Party'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      city: String,
      address: String,
    },
    startingPrice: {
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
    services: [
      {
        name: String,
        price: Number,
        description: String,
      }
    ],
    portfolio: [String], // Array of image URLs
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
