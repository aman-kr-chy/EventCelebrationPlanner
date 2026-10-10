import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, IndianRupee, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const VendorDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // For prototype, mocking bookings. In reality, fetch from /api/bookings?vendorId=xyz
  const [bookings, setBookings] = useState([]);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch the vendor's profile and their bookings here
    setIsLoading(true);
    setTimeout(() => {
      setBookings([
        { _id: '1', event: { title: 'Rahul & Priya Wedding', date: new Date(Date.now() + 864000000) }, status: 'Pending', totalAmount: 45000, customer: { name: 'Rahul Sharma' } },
        { _id: '2', event: { title: 'Corporate Annual Gala', date: new Date(Date.now() + 1728000000) }, status: 'Confirmed', totalAmount: 120000, customer: { name: 'Tech Solutions Inc' } }
      ]);
      setVendorProfile({
        businessName: userInfo?.name + "'s Services",
        rating: 4.8,
        numReviews: 12,
        category: 'Photography'
      });
      setIsLoading(false);
    }, 1000);
  }, [userInfo]);

  const handleUpdateStatus = async (bookingId, status) => {
    // try {
    //   await api.put(`/bookings/${bookingId}/status`, { status });
    //   // Update local state
    // } catch(err) { console.error(err) }
    setBookings(bookings.map(b => b._id === bookingId ? { ...b, status } : b));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your business and bookings.</p>
      </div>

      {isLoading ? (
         <div className="flex justify-center py-20">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
       </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
              {vendorProfile ? (
                <div>
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold mb-4">
                    {vendorProfile.businessName.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{vendorProfile.businessName}</h3>
                  <p className="text-gray-500 mb-2">{vendorProfile.category}</p>
                  <div className="flex items-center text-yellow-500 mb-4">
                    <Star size={16} className="fill-current mr-1" />
                    <span className="font-bold">{vendorProfile.rating}</span>
                    <span className="text-gray-400 text-sm ml-1">({vendorProfile.numReviews} reviews)</span>
                  </div>
                  <button className="w-full py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">You haven't set up your vendor profile yet.</p>
                  <button className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                    Create Profile
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-sm p-6 text-white">
              <h2 className="text-lg font-medium opacity-90 mb-1">Total Earnings</h2>
              <div className="text-4xl font-bold mb-4">₹1,65,000</div>
              <p className="text-sm opacity-80">+12% from last month</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Booking Requests</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <motion.div 
                  key={booking._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{booking.event.title}</h3>
                      <p className="text-gray-500 text-sm">Customer: {booking.customer.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-6 mb-6">
                    <div className="flex items-center text-gray-600 text-sm">
                      <CalendarIcon size={16} className="mr-1.5 text-gray-400" />
                      {new Date(booking.event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <IndianRupee size={16} className="mr-1 text-gray-400" />
                      <span className="font-semibold text-gray-900">{booking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {booking.status === 'Pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                      <button 
                        onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2.5 rounded-xl font-medium hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle size={18} /> Accept
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(booking._id, 'Rejected')}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={18} /> Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
