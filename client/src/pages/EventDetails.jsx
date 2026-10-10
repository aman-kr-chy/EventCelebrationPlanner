import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Users, IndianRupee, Plus
} from 'lucide-react';
import api from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // New Guest Form State
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', guestType: 'Adult' });

  // New Expense Form State
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'Venue', amount: '', description: '' });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        const [eventRes, guestsRes, expensesRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/guests/${id}`),
          api.get(`/expenses/${id}`)
        ]);
        
        setEvent(eventRes.data);
        setGuests(guestsRes.data);
        setExpenses(expensesRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/guests', { ...newGuest, event: id });
      setGuests([data, ...guests]);
      setNewGuest({ name: '', email: '', guestType: 'Adult' });
      setShowAddGuest(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/expenses', { ...newExpense, event: id });
      setExpenses([data, ...expenses]);
      setNewExpense({ category: 'Venue', amount: '', description: '' });
      setShowAddExpense(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!event) return <div className="text-center py-20 text-gray-500">Event not found</div>;

  const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const acceptedGuests = guests.filter(g => g.status === 'Accepted' || g.status === 'Checked-in').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-primary to-purple-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-6 left-8 text-white">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
              {event.eventType}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-medium opacity-90">
              <div className="flex items-center"><Calendar size={16} className="mr-1.5"/> {new Date(event.date).toLocaleDateString()}</div>
              {event.location?.city && <div className="flex items-center"><MapPin size={16} className="mr-1.5"/> {event.location.city}</div>}
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-t border-gray-100 bg-white">
          {['overview', 'guests', 'budget'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Event Description</h3>
                <p className="text-gray-600 leading-relaxed">{event.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center text-gray-600"><Users size={18} className="mr-2 text-primary" /> RSVP</div>
                    <span className="font-bold text-gray-900">{acceptedGuests} / {event.expectedGuests}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center text-gray-600"><IndianRupee size={18} className="mr-2 text-green-600" /> Spent</div>
                    <span className="font-bold text-gray-900">{totalSpent.toLocaleString()} / {event.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guests' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Guest List ({guests.length})</h3>
              <button 
                onClick={() => setShowAddGuest(!showAddGuest)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <Plus size={16} /> Add Guest
              </button>
            </div>
            
            {showAddGuest && (
              <form onSubmit={handleAddGuest} className="p-6 bg-primary/5 border-b border-primary/10 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input required type="text" placeholder="Name" className="px-3 py-2 border rounded-lg" value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} />
                <input type="email" placeholder="Email" className="px-3 py-2 border rounded-lg" value={newGuest.email} onChange={e => setNewGuest({...newGuest, email: e.target.value})} />
                <select className="px-3 py-2 border rounded-lg" value={newGuest.guestType} onChange={e => setNewGuest({...newGuest, guestType: e.target.value})}>
                  <option>Adult</option>
                  <option>Child</option>
                  <option>VIP</option>
                </select>
                <button type="submit" className="bg-primary text-white rounded-lg font-medium">Save Guest</button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {guests.map((guest) => (
                    <tr key={guest._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{guest.name}</td>
                      <td className="px-6 py-4">{guest.guestType}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          guest.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                          guest.status === 'Declined' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {guest.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/invite/${guest._id}`} target="_blank" className="text-primary hover:underline text-xs font-medium">View Invite</Link>
                      </td>
                    </tr>
                  ))}
                  {guests.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No guests added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Budget Summary</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-gray-600">
                      <span>Total Budget</span>
                      <span className="font-bold text-gray-900">₹{event.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-gray-600">
                      <span>Total Spent</span>
                      <span className="font-bold text-red-600">₹{totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm mb-1 text-gray-600">
                      <span>Remaining</span>
                      <span className="font-bold text-green-600 text-lg">₹{(event.budget - totalSpent).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
                      <div className={`h-2.5 rounded-full ${totalSpent > event.budget ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min((totalSpent/event.budget)*100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900">Expenses</h3>
                  <button 
                    onClick={() => setShowAddExpense(!showAddExpense)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    <Plus size={16} /> Add Expense
                  </button>
                </div>

                {showAddExpense && (
                  <form onSubmit={handleAddExpense} className="p-6 bg-primary/5 border-b border-primary/10 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input required type="text" placeholder="Description" className="px-3 py-2 border rounded-lg" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
                    <input required type="number" placeholder="Amount (₹)" className="px-3 py-2 border rounded-lg" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
                    <select className="px-3 py-2 border rounded-lg" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                      <option>Venue</option><option>Catering</option><option>Decoration</option><option>Photography</option>
                      <option>DJ</option><option>Makeup</option><option>Cake</option><option>Other</option>
                    </select>
                    <button type="submit" className="bg-primary text-white rounded-lg font-medium">Save Expense</button>
                  </form>
                )}

                <div className="divide-y divide-gray-100">
                  {expenses.map((expense) => (
                    <div key={expense._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-900">{expense.description}</p>
                        <p className="text-xs text-gray-500">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <div className="font-bold text-gray-900 flex items-center">
                        <IndianRupee size={14} className="mr-0.5 text-gray-500" />
                        {expense.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {expenses.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No expenses recorded.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
