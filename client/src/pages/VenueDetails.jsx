import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, IndianRupee, ArrowLeft, Phone, Mail, CheckCircle2, Calendar } from 'lucide-react';
import api from '../services/api';

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Booking modal state
  const [showModal, setShowModal] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/venues/${id}`);
        setVenue(data);
      } catch (error) {
        console.error('Error fetching venue details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenueDetails();
  }, [id]);

  const handleOpenBookingModal = async () => {
    try {
      const { data } = await api.get('/events/myevents');
      setMyEvents(data);
      // Auto-fill user data if they are logged in. We can leave it blank or let them type.
      setShowModal(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        console.error('Error fetching events:', error);
      }
    }
  };

  const handleBookVenue = async (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone || !bookingDate) {
      return alert('Please fill in all required fields (Name, Email, Phone, Date).');
    }
    
    try {
      setIsBooking(true);
      
      // 1. Create the booking first
      const { data: createdBooking } = await api.post('/bookings', {
        event: selectedEvent || undefined,
        contactName,
        contactEmail,
        contactPhone,
        bookingType: 'Venue',
        venue: venue._id,
        totalAmount: venue.pricePerDay,
        bookingDate: bookingDate,
        notes: 'Booked via Venue Details page'
      });

      // 2. Create the Razorpay Order
      const { data: order } = await api.post('/payments/create-order', {
        bookingId: createdBooking._id,
        amount: venue.pricePerDay
      });

      // 3. Dynamically load the Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: 'rzp_test_TmBKX6GPFGBp4e', // Updated with the Test Key
          amount: order.amount,
          currency: order.currency,
          name: 'Event Planner',
          description: `Booking for ${venue.name}`,
          order_id: order.id,
          handler: async function (response) {
            try {
              // 4. Verify payment
              await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: createdBooking._id
              });
              setBookingSuccess(true);
              setTimeout(() => {
                setShowModal(false);
                setBookingSuccess(false);
                navigate('/customer/dashboard');
              }, 2000);
            } catch (verifyError) {
              console.error('Verification error:', verifyError);
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: contactName,
            email: contactEmail,
            contact: contactPhone
          },
          theme: {
            color: '#8b5cf6' // Primary purple color
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert(`Payment Failed: ${response.error.description}`);
        });
        rzp.open();
        setIsBooking(false);
      };
      
      script.onerror = () => {
        alert('Failed to load Razorpay. Please check your connection.');
        setIsBooking(false);
      };
      
      document.body.appendChild(script);

    } catch (error) {
      console.error('Error booking venue:', error);
      alert(error.response?.data?.message || 'Failed to book venue. Please try again.');
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800">Venue not found</h2>
        <Link to="/venues" className="mt-4 text-primary hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Back to Venues
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/venues" className="inline-flex items-center text-gray-600 hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back to Venues
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Images section */}
        <div className="h-64 md:h-96 relative">
          <img 
            src={venue.images && venue.images.length > 0 ? venue.images[0] : "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-gray-800">
            {venue.venueType}
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{venue.name}</h1>
              <div className="flex items-center text-gray-500 text-lg">
                <MapPin size={20} className="mr-2 text-primary" />
                <span>{venue.location.address}, {venue.location.city}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 flex items-center">
                <IndianRupee size={28} className="mr-1" />
                {venue.pricePerDay.toLocaleString()}
              </div>
              <p className="text-gray-500 text-sm">per day</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About this Venue</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{venue.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Facilities & Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {venue.facilities && venue.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <CheckCircle2 size={18} className="mr-2 text-primary" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Users size={20} className="mr-3 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Maximum Capacity</p>
                      <p className="font-semibold">Up to {venue.capacity} guests</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleOpenBookingModal}
                  className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Book this Venue
                </button>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Owner</h3>
                {venue.owner ? (
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-800">{venue.owner.name}</p>
                    {venue.owner.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone size={16} className="mr-2" />
                        <a href={`tel:${venue.owner.phone}`} className="hover:text-primary">{venue.owner.phone}</a>
                      </div>
                    )}
                    {venue.owner.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail size={16} className="mr-2" />
                        <a href={`mailto:${venue.owner.email}`} className="hover:text-primary">{venue.owner.email}</a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Contact information not available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0">
              <h3 className="text-xl font-bold text-gray-900">Book Venue</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h4>
                  <p className="text-gray-500">An email notification has been sent.</p>
                </div>
              ) : (
                <form onSubmit={handleBookVenue} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Aman Kumar"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="aman@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 9876543210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="date" 
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Event (Optional)</label>
                    {myEvents.length > 0 ? (
                      <select 
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="">-- No Specific Event --</option>
                        {myEvents.map(ev => (
                          <option key={ev._id} value={ev._id}>{ev.title}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-gray-500">No active events found.</div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center mt-2">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg text-green-600">₹{venue.pricePerDay.toLocaleString()}</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isBooking}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                      isBooking ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
                    }`}
                  >
                    {isBooking ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
