import Venue from '../models/Venue.js';

// @desc    Fetch all venues (with filtering)
// @route   GET /api/venues
// @access  Public
export const getVenues = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, capacity, venueType } = req.query;
    
    // Build query object
    let query = {};
    
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (venueType) query.venueType = venueType;
    if (capacity) query.capacity = { $gte: Number(capacity) };
    
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    const venues = await Venue.find(query);
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single venue
// @route   GET /api/venues/:id
// @access  Public
export const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('owner', 'name email phone');
    if (venue) {
      res.json(venue);
    } else {
      res.status(404).json({ message: 'Venue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a venue
// @route   POST /api/venues
// @access  Private/Admin or Vendor
export const createVenue = async (req, res) => {
  try {
    const { name, description, location, capacity, pricePerDay, facilities, images, venueType } = req.body;

    const venue = new Venue({
      name,
      description,
      location,
      capacity,
      pricePerDay,
      facilities,
      images,
      venueType,
      owner: req.user._id,
    });

    const createdVenue = await venue.save();
    res.status(201).json(createdVenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
