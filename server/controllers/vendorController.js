import Vendor from '../models/Vendor.js';

// @desc    Fetch all vendors (with filtering)
// @route   GET /api/vendors
// @access  Public
export const getVendors = async (req, res) => {
  try {
    const { city, category, minPrice, maxPrice } = req.query;
    
    let query = {};
    
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (category) query.category = category;
    
    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    const vendors = await Vendor.find(query).populate('user', 'name profileImage');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single vendor
// @route   GET /api/vendors/:id
// @access  Public
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('user', 'name email phone profileImage');
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a vendor profile
// @route   POST /api/vendors
// @access  Private/Vendor
export const createVendorProfile = async (req, res) => {
  try {
    const existingProfile = await Vendor.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Vendor profile already exists for this user' });
    }

    const { businessName, category, description, location, startingPrice, services, portfolio } = req.body;

    const vendor = new Vendor({
      user: req.user._id,
      businessName,
      category,
      description,
      location,
      startingPrice,
      services,
      portfolio,
    });

    const createdVendor = await vendor.save();
    res.status(201).json(createdVendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
