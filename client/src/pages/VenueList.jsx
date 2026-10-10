import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, IndianRupee, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', venueType: '' });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        // Build query string
        const queryParams = new URLSearchParams(filters).toString();
        const { data } = await api.get(`/venues?${queryParams}`);
        setVenues(Array.isArray(data) ? data : (data?.venues || []));
      } catch (error) {
        console.error('Error fetching venues:', error);
        setVenues([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenues();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Venues</h1>
          <p className="text-gray-600 mt-2">Find the perfect location for your special celebration.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              name="city"
              placeholder="Search by city..." 
              value={filters.city}
              onChange={handleFilterChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select 
              name="venueType"
              value={filters.venueType}
              onChange={handleFilterChange}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white w-full"
            >
              <option value="">All Types</option>
              <option value="Banquet Hall">Banquet Hall</option>
              <option value="Farmhouse">Farmhouse</option>
              <option value="Resort">Resort</option>
              <option value="Hotel">Hotel</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No Venues Found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue, index) => (
            <motion.div 
              key={venue._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img 
                  src={venue.images && venue.images.length > 0 ? venue.images[0] : "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                  {venue.venueType}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{venue.name || 'Unnamed Venue'}</h3>
                <div className="flex items-center text-gray-500 mb-4 text-sm">
                  <MapPin size={16} className="mr-1" />
                  <span className="truncate">{venue.location?.address ? `${venue.location.address}, ` : ''}{venue.location?.city || 'Location not specified'}</span>
                </div>
                
                <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-700">
                    <Users size={18} className="mr-1.5 text-primary" />
                    <span className="font-medium">Up to {venue.capacity || 0}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <IndianRupee size={18} className="mr-1 text-green-600" />
                    <span className="font-bold text-lg">{(venue.pricePerDay || 0).toLocaleString()} <span className="text-sm font-normal text-gray-500">/ day</span></span>
                  </div>
                </div>
                
                <Link 
                  to={`/venues/${venue._id}`}
                  className="block w-full py-3 bg-gray-50 text-center text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueList;
