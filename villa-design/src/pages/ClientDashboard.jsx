import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api, userAPI, showApiError, showCustomNotification } from '../utils/api';
import {
  User,
  Mail,
  Calendar,
  Hotel,
  MapPin,
  Settings,
  LogOut,
  Bell,
  Search,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Send,
  History,
  AlertCircle,
  Phone,
  MessageSquare
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // User info
  const [userInfo, setUserInfo] = useState({
    name: 'Guest User',
    email: 'guest@wegavilla.com',
    role: 'USER'
  });

  // Booking history states
  const [roomBookings, setRoomBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [travelHistory, setTravelHistory] = useState([]);

  // Editing states
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingType, setEditingType] = useState('');

  // Animation refs
  const dashboardRef = useRef(null);
  const cardRefs = useRef([]);

  // Check if user is authenticated and has correct role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userFullName = localStorage.getItem('userFullName');
    const username = localStorage.getItem('username');

    if (!token) {
      navigate('/auth');
      return;
    }

    if (userRole && userRole.toUpperCase() !== 'USER') {
      navigate('/'); // Redirect non-users
      return;
    }

    setUserInfo({
      name: userFullName || 'Guest User',
      email: username || 'guest@wegavilla.com',
      role: userRole || 'USER'
    });

    loadUserData();
  }, [navigate]);

  // Load user data
  const loadUserData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadRoomBookings(),
        loadEventBookings(),
        loadTravelHistory()
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Load room bookings
  const loadRoomBookings = async () => {
    try {
      const result = await userAPI.getRoomBookings();
      if (result.ok && result.json) {
        setRoomBookings(result.json);
      } else {
        console.warn('No room bookings found or API returned error:', result.error);
        setRoomBookings([]);
      }
    } catch (error) {
      console.error('Error loading room bookings:', error);
      if (error.message?.includes('Server is unreachable') || 
          error.message?.includes('Network error')) {
        showCustomNotification(
          'Backend server is not running. Room booking data cannot be loaded.',
          'warning'
        );
      } else {
        showApiError(error.message || 'Unknown error', 'load room bookings');
      }
      setRoomBookings([]);
    }
  };

  // Load event bookings
  const loadEventBookings = async () => {
    try {
      const result = await userAPI.getEventBookings();
      if (result.ok && result.json) {
        setEventBookings(result.json);
      } else {
        console.warn('No event bookings found or API returned error:', result.error);
        setEventBookings([]);
      }
    } catch (error) {
      console.error('Error loading event bookings:', error);
      if (error.message?.includes('Server is unreachable') || 
          error.message?.includes('Network error')) {
        showCustomNotification(
          'Backend server is not running. Event booking data cannot be loaded.',
          'warning'
        );
      } else {
        showApiError(error.message || 'Unknown error', 'load event bookings');
      }
      setEventBookings([]);
    }
  };

  // Load travel history
  const loadTravelHistory = async () => {
    try {
      const result = await userAPI.getTravelHistory();
      if (result.ok && result.json) {
        setTravelHistory(result.json);
      } else {
        console.warn('No travel history found or API returned error:', result.error);
        setTravelHistory([]);
      }
    } catch (error) {
      console.error('Error loading travel history:', error);
      if (error.message?.includes('Server is unreachable') || 
          error.message?.includes('Network error')) {
        showCustomNotification(
          'Backend server is not running. Travel history data cannot be loaded.',
          'warning'
        );
      } else {
        showApiError(error.message || 'Unknown error', 'load travel history');
      }
      setTravelHistory([]);
    }
  };

  // Check if booking can be edited (within 24 hours)
  const canEditBooking = (bookingDate) => {
    const booking = new Date(bookingDate);
    const now = new Date();
    const hoursDiff = (now - booking) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  // Handle booking edit
  const handleEditBooking = async (bookingId, type, updatedData) => {
    setLoading(true);
    try {
      let result;
      if (type === 'room') {
        result = await userAPI.updateRoomBooking(bookingId, updatedData);
      } else {
        result = await userAPI.updateEventBooking(bookingId, updatedData);
      }
      
      if (result.ok) {
        setSuccess('Booking updated successfully!');
        showCustomNotification('Booking updated successfully!', 'success');
        setEditingBooking(null);
        setEditingType('');
        
        if (type === 'room') {
          loadRoomBookings();
        } else {
          loadEventBookings();
        }
      } else {
        const errorMsg = result.error || 'Failed to update booking';
        setError(errorMsg);
        showCustomNotification(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      const errorMsg = 'Failed to update booking. Please try again.';
      setError(errorMsg);
      showCustomNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId, type) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setLoading(true);
    try {
      let result;
      if (type === 'room') {
        result = await userAPI.cancelRoomBooking(bookingId);
      } else {
        result = await userAPI.cancelEventBooking(bookingId);
      }
      
      if (result.ok) {
        setSuccess('Booking cancelled successfully!');
        showCustomNotification('Booking cancelled successfully!', 'success');
        
        if (type === 'room') {
          loadRoomBookings();
        } else {
          loadEventBookings();
        }
      } else {
        const errorMsg = result.error || 'Failed to cancel booking';
        setError(errorMsg);
        showCustomNotification(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const errorMsg = 'Failed to cancel booking. Please try again.';
      setError(errorMsg);
      showCustomNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userId');
    navigate('/auth');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('clientDarkMode', (!isDarkMode).toString());
    showCustomNotification(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode`, 'success');
  };

  // Load dark mode preference
  useEffect(() => {
    const darkModePreference = localStorage.getItem('clientDarkMode');
    if (darkModePreference) {
      setIsDarkMode(darkModePreference === 'true');
    }
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (dashboardRef.current) {
      gsap.fromTo(dashboardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    cardRefs.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          { opacity: 0, y: 50, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.6, 
            delay: index * 0.1,
            ease: "back.out(1.7)" 
          }
        );
      }
    });
  }, [activeTab]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'travel', label: 'Travel History', icon: MapPin },
    { id: 'events', label: 'Event Bookings', icon: Calendar },
    { id: 'rooms', label: 'Room Bookings', icon: Hotel },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 min-h-screen shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <h1 className="text-2xl font-bold text-[#BF9264]">Wega Villa</h1>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Client Dashboard
            </p>
          </div>
          
          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                    activeTab === item.id 
                      ? 'bg-[#BF9264] text-white' 
                      : isDarkMode 
                        ? 'text-slate-300 hover:bg-slate-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className={`shadow-sm border-b px-6 py-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-semibold capitalize ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                {activeTab}
              </h2>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                  >
                    <div className="w-8 h-8 bg-[#BF9264] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{userInfo.name}</span>
                  </button>
                  
                  {showProfile && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                      isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'
                    }`}>
                      <div className={`p-4 border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                        <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{userInfo.name}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{userInfo.email}</p>
                        <p className="text-xs text-[#BF9264]">{userInfo.role}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-3 py-2 rounded flex items-center space-x-2 text-red-500 ${
                            isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main ref={dashboardRef} className="flex-1 p-6">
            {/* Error and Success Messages */}
            {error && (
              <div className={`mb-6 border rounded-lg p-4 ${
                isDarkMode ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}
            
            {success && (
              <div className={`mb-6 border rounded-lg p-4 ${
                isDarkMode ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">{success}</span>
                </div>
              </div>
            )}

            {/* Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div 
                    ref={el => cardRefs.current[0] = el}
                    className={`p-6 rounded-lg shadow-sm border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Room Bookings</p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{roomBookings.length}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500">
                        <Hotel className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div 
                    ref={el => cardRefs.current[1] = el}
                    className={`p-6 rounded-lg shadow-sm border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Event Bookings</p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{eventBookings.length}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div 
                    ref={el => cardRefs.current[2] = el}
                    className={`p-6 rounded-lg shadow-sm border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Travel History</p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{travelHistory.length}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div 
                    ref={el => cardRefs.current[3] = el}
                    className={`p-6 rounded-lg shadow-sm border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total Spent</p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                          LKR {eventBookings.reduce((total, booking) => total + (booking.totalCost || 0), 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-500">
                        <span className="text-white text-lg">💰</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events Section */}
                {eventBookings.filter(booking => new Date(booking.eventDate) > new Date()).length > 0 && (
                  <div className={`p-6 rounded-lg shadow-sm border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      🎉 Upcoming Events
                    </h3>
                    <div className="grid gap-4">
                      {eventBookings
                        .filter(booking => new Date(booking.eventDate) > new Date())
                        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                        .slice(0, 2)
                        .map((booking, index) => (
                          <div key={index} className={`p-4 border rounded-lg ${
                            isDarkMode ? 'border-slate-600 bg-gradient-to-r from-purple-900/20 to-pink-900/20' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'
                          }`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-2xl">🎊</span>
                                  <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                    {booking.eventType}
                                  </h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    booking.status === 'confirmed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </div>
                                <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDate(booking.eventDate)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>{booking.guestCount} guests</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{booking.venue}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span>💰</span>
                                    <span>LKR {booking.totalCost?.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 md:mt-0 md:ml-4">
                                <button
                                  onClick={() => setActiveTab('events')}
                                  className="px-4 py-2 bg-[#BF9264] hover:bg-amber-800 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className={`p-6 rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Recent Activity</h3>
                  <div className="space-y-4">
                    {eventBookings.slice(0, 3).map((booking, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${
                        isDarkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
                      } transition-colors`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-4 h-4 text-[#BF9264]" />
                              <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                {booking.eventType}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              <p>📅 {formatDate(booking.eventDate)}</p>
                              <p>👥 {booking.guestCount} guests</p>
                              <p>📍 {booking.venue}</p>
                              <p>💰 LKR {booking.totalCost?.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                            Booked {formatDate(booking.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {roomBookings.slice(0, 2).map((booking, index) => (
                      <div key={`room-${index}`} className={`p-4 border rounded-lg ${
                        isDarkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
                      } transition-colors`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Hotel className="w-4 h-4 text-[#BF9264]" />
                              <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                {booking.roomType || 'Room Booking'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.status || 'Pending'}
                              </span>
                            </div>
                            <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              <p>📅 Check-in: {formatDate(booking.checkIn)}</p>
                              <p>📅 Check-out: {formatDate(booking.checkOut)}</p>
                              <p>👥 {booking.guests || 2} guests</p>
                            </div>
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                            Booked {formatDate(booking.createdAt || booking.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {([...roomBookings, ...eventBookings].length === 0) && (
                      <div className="text-center py-8">
                        <div className={`text-6xl mb-4`}>🎉</div>
                        <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          No recent activity
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                          Start by booking an event or room!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Room Bookings Tab */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Room Bookings
                  </h3>
                  <button
                    onClick={() => navigate('/room-booking')}
                    className="bg-[#BF9264] hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Book New Room
                  </button>
                </div>

                <div className={`rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  {roomBookings.length === 0 ? (
                    <div className="p-8 text-center">
                      <Hotel className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
                      <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        No room bookings found
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        Your room bookings will appear here once you make a reservation
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                          <tr>
                            <th className={`text-left p-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                              Room
                            </th>
                            <th className={`text-left p-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                              Check-in
                            </th>
                            <th className={`text-left p-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                              Check-out
                            </th>
                            <th className={`text-left p-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                              Guests
                            </th>
                            <th className={`text-left p-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                              Status
                            </th>
                            <th className={`text-left p-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomBookings.map((booking) => (
                            <tr key={booking.id} className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                              <td className={`p-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                                {booking.roomType || 'Standard Room'}
                              </td>
                              <td className={`p-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                                {formatDate(booking.checkIn)}
                              </td>
                              <td className={`p-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                                {formatDate(booking.checkOut)}
                              </td>
                              <td className={`p-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                                {booking.guests || 2}
                              </td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  booking.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {booking.status || 'Pending'}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  {canEditBooking(booking.createdAt) && booking.status !== 'cancelled' && (
                                    <button
                                      onClick={() => {
                                        setEditingBooking(booking);
                                        setEditingType('room');
                                      }}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit booking (within 24h)"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  )}
                                  
                                  {booking.status !== 'cancelled' && (
                                    <button
                                      onClick={() => handleCancelBooking(booking.id, 'room')}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Cancel booking"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                  
                                  {!canEditBooking(booking.createdAt) && (
                                    <div className="flex items-center text-gray-400">
                                      <Clock className="w-4 h-4 mr-1" />
                                      <span className="text-xs">24h edit window expired</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Event Bookings Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Event Bookings
                  </h3>
                  <button
                    onClick={() => navigate('/event-booking')}
                    className="bg-[#BF9264] hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Book New Event
                  </button>
                </div>

                {eventBookings.length === 0 ? (
                  <div className={`p-8 text-center rounded-lg shadow-sm border ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  }`}>
                    <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      No event bookings found
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                      Book your first event to see it here
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {eventBookings.map((booking) => (
                      <div key={booking.id} className={`p-6 rounded-lg shadow-sm border ${
                        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                      }`}>
                        {/* Event Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                              <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className={`text-xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                {booking.eventType}
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                {booking.packageType}
                              </p>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium mt-2 md:mt-0 inline-block ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </div>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="w-4 h-4 text-[#BF9264]" />
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Event Date & Time
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {formatDate(booking.eventDate)}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-4 h-4 text-[#BF9264]" />
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Guest Count
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {booking.guestCount} guests
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-2 mb-1">
                              <MapPin className="w-4 h-4 text-[#BF9264]" />
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Venue
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {booking.venue}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-4 h-4 text-[#BF9264]" />
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Contact Person
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {booking.contactPerson}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-2 mb-1">
                              <Phone className="w-4 h-4 text-[#BF9264]" />
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Phone
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {booking.phone}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="w-4 h-4 text-[#BF9264]">💰</span>
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Total Cost
                              </span>
                            </div>
                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                              LKR {booking.totalCost?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                          <div className={`p-3 rounded-lg mb-4 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-[#BF9264]" />
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Special Requests
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {booking.specialRequests}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {canEditBooking(booking.createdAt) && booking.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                setEditingBooking(booking);
                                setEditingType('event');
                              }}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit Event</span>
                            </button>
                          )}
                          
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id, 'event')}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Cancel Event</span>
                            </button>
                          )}
                          
                          {!canEditBooking(booking.createdAt) && (
                            <div className="flex items-center text-gray-400 px-3 py-2">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm">24h edit window expired</span>
                            </div>
                          )}
                          
                          <div className={`px-3 py-2 text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                            Booked on {formatDate(booking.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Travel History Tab */}
            {activeTab === 'travel' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Travel History
                  </h3>
                  <button
                    onClick={() => navigate('/tour-book')}
                    className="bg-[#BF9264] hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Book Tour Guide
                  </button>
                </div>

                <div className={`rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  {travelHistory.length === 0 ? (
                    <div className="p-8 text-center">
                      <MapPin className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
                      <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        No travel history found
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        Book a tour guide to start your travel journey
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 p-6">
                      {travelHistory.map((travel, index) => (
                        <div key={index} className={`p-4 border rounded-lg ${
                          isDarkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
                        } transition-colors`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                {travel.destination || 'Tour Experience'}
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                Guide: {travel.guideName || 'Professional Guide'}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                {formatDate(travel.date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                travel.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : travel.status === 'upcoming'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {travel.status || 'Completed'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                  Settings
                </h3>

                {/* Theme Settings */}
                <div className={`p-6 rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Theme Preferences
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isDarkMode ? (
                        <Moon className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      )}
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {isDarkMode ? 'Dark theme is enabled' : 'Light theme is enabled'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDarkMode ? 'bg-[#BF9264]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Profile Settings */}
                <div className={`p-6 rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Profile Information
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userInfo.name}
                        disabled
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isDarkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-400' 
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userInfo.email}
                        disabled
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isDarkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-400' 
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        Account Type
                      </label>
                      <input
                        type="text"
                        value={userInfo.role}
                        disabled
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isDarkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-400' 
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    To update your profile information, please contact our support team.
                  </p>
                </div>

                {/* Notification Settings */}
                <div className={`p-6 rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Notification Preferences
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                          Email Notifications
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          Receive booking confirmations and updates via email
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#BF9264]">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                          SMS Notifications
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          Receive important updates via SMS
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
