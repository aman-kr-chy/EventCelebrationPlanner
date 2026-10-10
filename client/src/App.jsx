import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Lazy load non-homepage routes for fast initial load
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const VenueList = lazy(() => import('./pages/VenueList'));
const VendorList = lazy(() => import('./pages/VendorList'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const CreateEvent = lazy(() => import('./pages/CreateEvent'));
const PublicInvitation = lazy(() => import('./pages/PublicInvitation'));
const VenueDetails = lazy(() => import('./pages/VenueDetails'));

const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/venues" element={<VenueList />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/invite/:guestId" element={<PublicInvitation />} />
          </Routes>
        </Suspense>
      </main>
      {/* Footer will go here */}
    </div>
  );
}

export default App;
