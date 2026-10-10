import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { PartyPopper, UserCircle, Bell, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-primary'}`;

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <PartyPopper className="text-primary h-8 w-8" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">EventPlanner</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/venues" className={navLinkClass}>Venues</NavLink>
              <NavLink to="/vendors" className={navLinkClass}>Vendors</NavLink>
              <NavLink to="/events/create" className={navLinkClass}>Plan Event</NavLink>
              {userInfo && <NavLink to={`/${userInfo.role}/dashboard`} className={navLinkClass}>Dashboard</NavLink>}
            </div>
            
            {userInfo ? (
              <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="text-gray-500 hover:text-primary relative p-1"
                  >
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50">
                      <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full font-medium">1 New</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 border-primary bg-primary/5">
                          <p className="text-sm font-medium text-gray-900">Booking Confirmed! 🎉</p>
                          <p className="text-xs text-gray-500 mt-1">Your venue booking has been confirmed and an email has been sent.</p>
                          <p className="text-xs text-gray-400 mt-2">Just now</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm font-medium text-gray-700">Welcome to EventPlanner</p>
                          <p className="text-xs text-gray-500 mt-1">Complete your profile to get the best recommendations.</p>
                          <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-50 text-center">
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary focus:outline-none cursor-pointer"
                  >
                    <UserCircle className="h-8 w-8 text-gray-400" />
                    <span className="font-medium cursor-pointer hidden sm:inline max-w-[120px] truncate">{userInfo.name}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50">
                      <Link 
                        to={`/${userInfo.role}/dashboard`}
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium text-sm px-2 sm:px-4 py-2 hidden xs:block">
                  Log in
                </Link>
                <Link to="/register" className="bg-primary text-white hover:bg-primary-dark px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
                  Sign up
                </Link>
              </div>
            )}
            <button
              type="button"
              aria-label={showMobileMenu ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={showMobileMenu}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-50"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 py-2">
            <NavLink to="/venues" onClick={() => setShowMobileMenu(false)} className={({ isActive }) => `${navLinkClass({ isActive })} block`}>Venues</NavLink>
            <NavLink to="/vendors" onClick={() => setShowMobileMenu(false)} className={({ isActive }) => `${navLinkClass({ isActive })} block`}>Vendors</NavLink>
            <NavLink to="/events/create" onClick={() => setShowMobileMenu(false)} className={({ isActive }) => `${navLinkClass({ isActive })} block`}>Plan Event</NavLink>
            {userInfo && <NavLink to={`/${userInfo.role}/dashboard`} onClick={() => setShowMobileMenu(false)} className={({ isActive }) => `${navLinkClass({ isActive })} block`}>Dashboard</NavLink>}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
