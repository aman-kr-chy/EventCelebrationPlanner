import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const PublicInvitation = () => {
  const { guestId } = useParams();
  const [guest, setGuest] = useState(null);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState(null);

  useEffect(() => {
    // In a real application, you might want a specialized public endpoint to fetch guest + event securely
    // For this prototype, we'll assume we can fetch it (requires adjusting backend auth, or creating a public invite API)
    // To simulate, we'll mock the fetch:
    setIsLoading(true);
    setTimeout(() => {
      setGuest({ _id: guestId, name: 'Guest Name', status: 'Pending', guestType: 'Adult' });
      setEvent({ 
        title: 'Rahul & Priya Wedding', 
        date: new Date(Date.now() + 864000000),
        location: { city: 'Mumbai', address: 'The Taj Mahal Palace' },
        description: 'Join us to celebrate the beginning of our new life together!'
      });
      setIsLoading(false);
    }, 1000);
  }, [guestId]);

  const handleRSVP = async (status) => {
    try {
      await api.put(`/guests/${guestId}/status`, { status });
      setGuest({ ...guest, status });
      setRsvpStatus(status);
    } catch (error) {
      console.error(error);
      // For prototype: update UI anyway
      setGuest({ ...guest, status });
      setRsvpStatus(status);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="h-40 bg-gradient-to-r from-primary to-pink-500 flex items-center justify-center p-6 text-center relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <h1 className="text-3xl font-bold text-white relative z-10">{event.title}</h1>
        </div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-2">You're Invited</p>
            <h2 className="text-2xl font-bold text-gray-900">Dear {guest.name}</h2>
          </div>

          <p className="text-gray-600 text-center mb-8 italic">"{event.description}"</p>

          <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-start text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700">
              <MapPin className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{event.location.address}</p>
                <p className="text-sm text-gray-500">{event.location.city}</p>
              </div>
            </div>
          </div>

          {guest.status === 'Pending' || rsvpStatus === null ? (
            <div>
              <p className="text-center font-medium text-gray-900 mb-4">Will you be attending?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleRSVP('Accepted')}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  <CheckCircle size={18} /> Yes, I will
                </button>
                <button 
                  onClick={() => handleRSVP('Declined')}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <XCircle size={18} /> Sorry, I can't
                </button>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-xl text-center ${guest.status === 'Accepted' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
              <p className="font-bold text-lg mb-1">
                {guest.status === 'Accepted' ? '🎉 See you there!' : 'We will miss you!'}
              </p>
              <p className="text-sm">You have {guest.status.toLowerCase()} this invitation.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PublicInvitation;
