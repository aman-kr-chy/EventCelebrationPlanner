import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, IndianRupee, Clock, Plus, ChevronRight, Bell } from 'lucide-react';
import api from '../services/api';

const CustomerDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events/myevents');
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {userInfo?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-600 mt-1">Here is what's happening with your events.</p>
        </div>
        <Link 
          to="/events/create" 
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          Create Event
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : events.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
        >
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Events Yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't planned any events yet. Start planning your perfect celebration now!</p>
          <Link 
            to="/events/create" 
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-md font-medium"
          >
            <Plus size={20} />
            Create Your First Event
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            {events.map((event) => (
              <motion.div 
                key={event._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{event.title} {event.eventType === 'Birthday' ? '🎂' : '🎉'}</h3>
                      <p className="text-gray-500 text-sm mt-1">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-gray-500 text-sm">{event.location?.address || event.location?.city}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">
                      {event.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <Users size={16} />
                        Guests
                      </div>
                      <p className="font-semibold text-gray-900">0 / {event.expectedGuests}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <IndianRupee size={16} />
                        Budget
                      </div>
                      <p className="font-semibold text-gray-900">₹0 / ₹{event.budget.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <Clock size={16} />
                        Countdown
                      </div>
                      <p className="font-semibold text-gray-900">
                        {Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24))} Days
                      </p>
                    </div>
                  </div>

                  <Link 
                    to={`/events/${event._id}`}
                    className="flex items-center justify-center w-full py-3 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-xl transition-colors"
                  >
                    Manage Event <ChevronRight size={18} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p>No new notifications</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
