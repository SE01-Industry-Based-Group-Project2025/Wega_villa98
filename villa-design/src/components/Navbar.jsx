import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { User, LogOut, Settings, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    travel: false,
    booking: false
  });  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const userFullName = localStorage.getItem("userFullName");
      const role = localStorage.getItem("userRole");
      
      console.log("Navbar checking login status:");
      console.log("Token exists:", !!token);
      console.log("User full name:", userFullName);
      console.log("User role:", role);
      
      if (token) {
        setIsLoggedIn(true);
        // Handle undefined or null userFullName
        const displayName = userFullName && userFullName !== "undefined" ? userFullName : "User";
        setDisplayName(displayName);
        setUserRole(role || "");
      } else {
        setIsLoggedIn(false);
        setDisplayName("");
        setUserRole("");
        setShowProfile(false);
      }
    };

    // Check on component mount
    checkLoginStatus();

    // Listen for storage changes and custom login events
    const handleStorageChange = () => checkLoginStatus();
    const handleLoginEvent = () => checkLoginStatus();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleLoginEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleLoginEvent);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setDisplayName("");
    setUserRole("");
    setShowProfile(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mobile menu toggle clicked, current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowProfile(false);
    console.log('Mobile menu state after toggle:', !isMobileMenuOpen);
  };

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileDropdowns({ travel: false, booking: false });
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[#E5D0AC] shadow-lg shadow-zinc-700 py-4 px-6 md:px-12 flex items-center justify-between z-50">
        {/* Logo */}
        <div className="text-2xl font-bold text-amber-950">
          Wega Villa <span className="text-amber-600">98</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link to="/" className="text-gray-800 hover:text-amber-500 transition-colors duration-300 relative group text-sm lg:text-base">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="text-gray-800 hover:text-amber-500 transition-colors duration-300 relative group text-sm lg:text-base">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Travel Dropdown */}
          <div className="relative group">
            <button className="flex items-center text-gray-800 hover:text-amber-500 transition-colors duration-300 relative text-sm lg:text-base">
              Travel 
              <FaChevronDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl py-2 z-[60] border border-gray-100 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
              <Link to="/tour-guide" className="block px-4 py-3 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 transform hover:translate-x-1 text-sm">Book Tour Guide</Link>
              <Link to="/gallery" className="block px-4 py-3 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 transform hover:translate-x-1 text-sm">Tour Places</Link>
            </div>
          </div>

          {/* Booking Dropdown */}
          <div className="relative group">
            <button className="flex items-center text-gray-800 hover:text-amber-500 transition-colors duration-300 relative text-sm lg:text-base">
              Booking 
              <FaChevronDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl py-2 z-[60] border border-gray-100 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
              <Link to="/rooms-booking" className="block px-4 py-3 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 transform hover:translate-x-1 text-sm">Rooms Booking</Link>
              <Link to="/event-booking" className="block px-4 py-3 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 transform hover:translate-x-1 text-sm">Events Booking</Link>
            </div>
          </div>

          <Link to="/facilities" className="text-gray-800 hover:text-amber-500 transition-colors duration-300 relative group text-sm lg:text-base">
            Facilities
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="text-gray-800 hover:text-amber-500 transition-colors duration-300 relative group text-sm lg:text-base">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Desktop Login/Profile Section */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 bg-white hover:bg-amber-50 text-amber-950 border-2 border-amber-950/40 px-4 py-2 rounded-md transition"
              >
                <User className="w-4 h-4" />
                <span>{displayName}</span>
                <FaChevronDown className="text-xs" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <p className="font-semibold text-gray-800">{displayName}</p>
                    <p className="text-sm text-gray-600">Welcome back!</p>
                    {userRole && (
                      <p className="text-xs text-amber-600 capitalize">{userRole.toLowerCase()}</p>
                    )}
                  </div>
                  <div className="p-2">
                    {userRole && userRole.toUpperCase() === 'USER' && (
                      <Link
                        to="/client-dashboard"
                        onClick={() => setShowProfile(false)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center space-x-2 text-gray-800"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center space-x-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="bg-white hover:bg-amber-900 hover:text-amber-950 text-amber-950/50 border-2 border-amber-950/40 px-4 py-2 rounded-md transition">
              Login / Join
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-800 p-2 mobile-menu-button"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Menu */}
      <div 
        className={`mobile-menu fixed top-0 right-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? 'transform translate-x-0' : 'transform translate-x-full'
        }`}
        style={{
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          visibility: 'visible',
          pointerEvents: 'auto'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="text-xl font-bold text-amber-950">
              Wega Villa <span className="text-amber-600">98</span>
            </div>
            <button 
              onClick={closeMobileMenu}
              className="text-gray-600 p-2"
              aria-label="Close mobile menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 py-6">
            <div className="space-y-2">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className="block px-6 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                Home
              </Link>
              
              <Link 
                to="/about" 
                onClick={closeMobileMenu}
                className="block px-6 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                About Us
              </Link>

              {/* Mobile Travel Dropdown */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('travel')}
                  className="w-full flex items-center justify-between px-6 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  <span>Travel</span>
                  {mobileDropdowns.travel ? (
                    <FaChevronUp className="text-xs" />
                  ) : (
                    <FaChevronDown className="text-xs" />
                  )}
                </button>
                
                {mobileDropdowns.travel && (
                  <div className="bg-gray-50 border-l-4 border-amber-200">
                    <Link 
                      to="/tour-guide" 
                      onClick={closeMobileMenu}
                      className="block px-10 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Book Tour Guide
                    </Link>
                    <Link 
                      to="/gallery" 
                      onClick={closeMobileMenu}
                      className="block px-10 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Tour Places
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Booking Dropdown */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('booking')}
                  className="w-full flex items-center justify-between px-6 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  <span>Booking</span>
                  {mobileDropdowns.booking ? (
                    <FaChevronUp className="text-xs" />
                  ) : (
                    <FaChevronDown className="text-xs" />
                  )}
                </button>
                
                {mobileDropdowns.booking && (
                  <div className="bg-gray-50 border-l-4 border-amber-200">
                    <Link 
                      to="/rooms-booking" 
                      onClick={closeMobileMenu}
                      className="block px-10 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Rooms Booking
                    </Link>
                    <Link 
                      to="/event-booking" 
                      onClick={closeMobileMenu}
                      className="block px-10 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Events Booking
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                to="/facilities" 
                onClick={closeMobileMenu}
                className="block px-6 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                Facilities
              </Link>
              
              <Link 
                to="/contact" 
                onClick={closeMobileMenu}
                className="block px-6 py-3 text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Mobile Login/Profile Section */}
          <div className="border-t border-gray-200 p-6">
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <User className="w-8 h-8 text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-800">{displayName}</p>
                    {userRole && (
                      <p className="text-xs text-amber-600 capitalize">{userRole.toLowerCase()}</p>
                    )}
                  </div>
                </div>
                
                {userRole && userRole.toUpperCase() === 'USER' && (
                  <Link
                    to="/client-dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 p-3 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                onClick={closeMobileMenu}
                className="block text-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Login / Join
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
