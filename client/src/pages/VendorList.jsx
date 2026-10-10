import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, IndianRupee, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', city: '' });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams(filters).toString();
        const { data } = await api.get(`/vendors?${queryParams}`);
        setVendors(Array.isArray(data) ? data : (data?.vendors || []));
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const categories = [
    'Catering', 'Photography', 'Decoration', 'DJ/Music', 'Makeup', 
    'Florist', 'Wedding Planner', 'Security', 'Transportation', 'Cake', 'Entertainment', 'Fresher Party'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Top Vendors</h1>
          <p className="text-gray-600 mt-2">Hire the best professionals for your event.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              name="city"
              placeholder="Search city..." 
              value={filters.city}
              onChange={handleFilterChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select 
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white w-full"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No Vendors Found</h3>
          <p className="text-gray-500 mt-2">Try selecting a different category or city.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor, index) => (
            <motion.div 
              key={vendor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col"
            >
              <div className="h-40 bg-gray-200 relative">
                <img 
                  src={vendor.portfolio && vendor.portfolio.length > 0 ? vendor.portfolio[0] : "https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                  alt={vendor.businessName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-8 left-6">
                  <img 
                    src={(vendor.user?.profileImage && vendor.user.profileImage !== 'default.jpg') ? vendor.user.profileImage : "https://ui-avatars.com/api/?name=" + encodeURIComponent(vendor.businessName)} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full border-4 border-white shadow-sm bg-white"
                  />
                </div>
              </div>
              <div className="p-6 pt-10 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{vendor.businessName}</h3>
                  <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded text-xs font-bold">
                    <Star size={12} className="mr-1 fill-current" />
                    {vendor.rating > 0 ? vendor.rating.toFixed(1) : 'New'}
                  </div>
                </div>
                <p className="text-primary text-sm font-medium mb-3">{vendor.category || 'General'}</p>
                
                <div className="flex items-center text-gray-500 mb-4 text-sm">
                  <MapPin size={14} className="mr-1.5" />
                  <span className="truncate">{vendor.location?.city || 'Location not specified'}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <div className="flex items-center text-gray-900 font-bold">
                      <IndianRupee size={14} className="mr-0.5 text-gray-600" />
                      {(vendor.startingPrice || 0).toLocaleString()}
                    </div>
                  </div>
                  <Link 
                    to={`/vendors/${vendor._id}`}
                    className="px-4 py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorList;
