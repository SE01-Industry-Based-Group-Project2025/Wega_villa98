import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [showProfile, setShowProfile] = useState(false);  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const userFullName = localStorage.getItem("userFullName");
      
      console.log("Navbar checking login status:");
      console.log("Token exists:", !!token);
      console.log("User full name:", userFullName);
      
      if (token) {
        setIsLoggedIn(true);
        // Handle undefined or null userFullName
        const displayName = userFullName && userFullName !== "undefined" ? userFullName : "User";
        setDisplayName(displayName);
      } else {
        setIsLoggedIn(false);
        setDisplayName("");
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
    setIsLoggedIn(false);
    setDisplayName("");
    setShowProfile(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#E5D0AC] shadow-lg shadow-zinc-700 py-4 px-6 md:px-12 flex items-center justify-between z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-amber-950">
        Wega Villa <span className="text-amber-600">98</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-gray-800 hover:text-amber-500">Home</Link>
        <Link to="/about" className="text-gray-800 hover:text-amber-500">About Us</Link>

        {/* Travel Dropdown */}
        <div className="relative group">
          <button className="flex items-center text-gray-800 hover:text-amber-500">
            Travel <FaChevronDown className="ml-1 text-xs" />
          </button>

          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <Link to="/tour-guide" className="block px-4 py-2 hover:bg-amber-50">Book Tour Guide</Link>
            <Link to="/gallery" className="block px-4 py-2 hover:bg-amber-50">Tour Places</Link>
          </div>
        </div>

        {/* Booking Dropdown */}
        <div className="relative group">
          <button className="flex items-center text-gray-800 hover:text-amber-500">
            Booking <FaChevronDown className="ml-1 text-xs" />
          </button>

          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <Link to="/rooms-booking" className="block px-4 py-2 hover:bg-amber-50">Rooms Booking</Link>
            <Link to="/event-booking" className="block px-4 py-2 hover:bg-amber-50">Events Booking</Link>
          </div>
        </div>        <Link to="/facilities" className="text-gray-800 hover:text-amber-500">Facilities</Link>
        <Link to="/contact" className="text-gray-800 hover:text-amber-500">Contact Us</Link>
      </div>

      {/* Login/Profile Section */}
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
              </div>
              <div className="p-2">
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

      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-800">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </nav>
  );
};

export default Navbar;
