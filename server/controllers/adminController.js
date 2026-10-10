import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const revenueAggregation = await Payment.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Optional: Get chart data (e.g., events per month)
    // For simplicity, returning mock chart data structure that frontend expects
    const revenueData = [
      { name: 'Jan', amount: 4000 },
      { name: 'Feb', amount: 3000 },
      { name: 'Mar', amount: 2000 },
      { name: 'Apr', amount: 2780 },
      { name: 'May', amount: 1890 },
      { name: 'Jun', amount: 2390 },
    ];

    res.json({
      totalUsers,
      totalVendors,
      totalEvents,
      totalBookings,
      totalRevenue,
      revenueData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
