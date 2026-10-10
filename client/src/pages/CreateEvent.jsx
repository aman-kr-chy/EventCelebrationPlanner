import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, IndianRupee, FileText, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import api from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    eventType: 'Birthday',
    date: '',
    startTime: '',
    endTime: '',
    expectedGuests: '',
    budget: '',
    description: '',
    city: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const payload = {
        title: formData.title,
        eventType: formData.eventType,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        expectedGuests: Number(formData.expectedGuests),
        budget: Number(formData.budget),
        description: formData.description,
        location: {
          city: formData.city,
          address: formData.address
        }
      };
      
      const { data } = await api.post('/events', payload);
      navigate(`/events/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setIsLoading(false);
    }
  };

  const eventTypes = ['Birthday', 'Wedding', 'Engagement', 'Anniversary', 'Corporate', 'College', 'Festival', 'Other'];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-2">Let's plan your perfect celebration step by step.</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10 relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
          <div style={{ width: `${(step / 3) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-gray-500 px-1">
          <span className={step >= 1 ? 'text-primary' : ''}>Basics</span>
          <span className={step >= 2 ? 'text-primary' : ''}>Details</span>
          <span className={step >= 3 ? 'text-primary' : ''}>Location</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        {error && (
          <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900">
                  <Calendar className="text-primary" /> Basic Information
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {eventTypes.map(type => (
                      <div 
                        key={type}
                        onClick={() => setFormData({...formData, eventType: type})}
                        className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${formData.eventType === type ? 'bg-primary/10 border-primary text-primary font-semibold' : 'border-gray-200 hover:border-primary/50 text-gray-600'}`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Rahul's 25th Birthday Bash"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900">
                  <FileText className="text-primary" /> Event Details
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Users size={16}/> Expected Guests</label>
                    <input type="number" name="expectedGuests" required min="1" value={formData.expectedGuests} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><IndianRupee size={16}/> Estimated Budget</label>
                    <input type="number" name="budget" required min="100" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="50000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    placeholder="Tell us a bit about the event..."
                  ></textarea>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-900">
                  <MapPin className="text-primary" /> Location
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specific Address / Area</label>
                  <textarea
                    name="address"
                    required
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    placeholder="Where will the event take place?"
                  ></textarea>
                </div>
                
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                  <div className="bg-primary/20 p-2 rounded-full mt-1">
                    <Check size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Almost done!</h4>
                    <p className="text-sm text-gray-600">After creating the event, you can start booking venues, vendors, and managing your guest list.</p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          <div className="mt-10 flex justify-between pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="flex items-center px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft size={20} className="mr-1" /> Back
              </button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button type="submit" className="flex items-center px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md shadow-primary/30">
                Continue <ChevronRight size={20} className="ml-1" />
              </button>
            ) : (
              <button type="submit" disabled={isLoading} className="flex items-center px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md shadow-primary/30 disabled:opacity-70">
                {isLoading ? 'Creating...' : 'Create Event'} <Check size={20} className="ml-1.5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
