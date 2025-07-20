import React, { useState, useEffect, useRef } from "react";
import { Calendar, Clock, Users, Star, MapPin, Phone, Mail, Camera, Music, Utensils, PartyPopper, Gift, Sparkles, CheckCircle, X } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { bookingAPI } from "../utils/api";

export default function EventBookingPage() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState("birthday");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    message: "",
    packageId: ""
  });

  // Animation refs
  const heroRef = useRef(null);
  const packagesRef = useRef(null);
  const featuresRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Hero animation
    tl.fromTo(heroRef.current?.querySelector('.hero-content'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    // Packages animation
    gsap.fromTo(".package-card", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, delay: 0.3 }
    );

    // Features animation
    gsap.fromTo(".feature-item",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.5 }
    );
  }, []);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if user has a valid token
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, user not authenticated');
        setIsAuthenticated(false);
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      console.log('Token found, setting user as authenticated');
      
      // If we have a token, set user as authenticated immediately
      setIsAuthenticated(true);
      
      try {
        // Try to verify authentication with backend (optional)
        const authResponse = await bookingAPI.authCheck();
        console.log('Auth check response:', authResponse);
        
        if (authResponse.ok) {
          console.log('Backend auth verification successful');
          
          // Try to get user profile details
          try {
            const profileResponse = await bookingAPI.getUserProfile();
            console.log('Profile response:', profileResponse);
            
            if (profileResponse.ok && profileResponse.json) {
              setUserProfile(profileResponse.json);
              console.log('User profile loaded from backend:', profileResponse.json);
            } else {
              console.log('Profile API failed, will use localStorage fallback');
            }
          } catch (profileError) {
            console.warn('Profile API not available, using localStorage fallback:', profileError);
          }
        } else {
          console.warn('Backend auth verification failed, but keeping user logged in based on token');
        }
      } catch (apiError) {
        console.warn('Backend APIs not available, using token-based auth:', apiError);
        // Keep user authenticated based on token presence
      }
      
      // Check for pending booking restoration (only if just logged in)
      const pendingBooking = localStorage.getItem('pendingBooking');
      const justLoggedIn = localStorage.getItem('justLoggedIn');
      
      if (pendingBooking && justLoggedIn) {
        try {
          const packageData = JSON.parse(pendingBooking);
          localStorage.removeItem('pendingBooking');
          localStorage.removeItem('justLoggedIn');
          
          console.log('Restoring pending booking:', packageData);
          setTimeout(() => {
            handleBooking(packageData);
          }, 1500);
        } catch (error) {
          console.error('Error parsing pending booking:', error);
          localStorage.removeItem('pendingBooking');
          localStorage.removeItem('justLoggedIn');
        }
      }
      
    } catch (error) {
      console.error('Authentication check failed:', error);
      // Don't clear auth on error - might be network issue
      console.log('Keeping user authenticated due to network error');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToAuth = () => {
    navigate('/auth');
  };

  const eventPackages = {
    birthday: [
      {
        id: "birthday-classic",
        name: "Classic Birthday Bash",
        price: "LKR 45,000",
        duration: "4 hours",
        guests: "Up to 25 people",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
        features: [
          "Decorated party area with balloons & banners",
          "Birthday cake (1kg)",
          "Party games & entertainment",
          "Sound system with music",
          "Photography session (1 hour)",
          "Party favors for guests",
          "Refreshments & snacks"
        ],
        popular: false
      },
      {
        id: "birthday-deluxe",
        name: "Deluxe Birthday Celebration",
        price: "LKR 75,000",
        duration: "6 hours",
        guests: "Up to 40 people",
        image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=800&q=80",
        features: [
          "Premium decorations with theme setup",
          "Custom birthday cake (2kg)",
          "Professional DJ & entertainment",
          "Pool access with games",
          "Professional photography (full event)",
          "Party coordinator included",
          "Full meal & beverage service",
          "Special lighting setup"
        ],
        popular: true
      },
      {
        id: "birthday-premium",
        name: "Premium Birthday Extravaganza",
        price: "LKR 125,000",
        duration: "8 hours",
        guests: "Up to 60 people",
        image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80",
        features: [
          "Luxury themed decorations",
          "Multi-tier custom birthday cake",
          "Live entertainment & performances",
          "Full venue access including pool",
          "Professional photography & videography",
          "Dedicated event manager",
          "Gourmet buffet & premium bar",
          "Special effects & lighting",
          "Transportation coordination"
        ],
        popular: false
      }
    ],
    night: [
      {
        id: "night-groove",
        name: "Night Groove Party",
        price: "LKR 85,000",
        duration: "6 hours",
        guests: "Up to 35 people",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        features: [
          "LED lighting & disco setup",
          "Professional DJ with dance floor",
          "Cocktail bar service",
          "Late night snacks & appetizers",
          "Pool area with ambient lighting",
          "Security service included",
          "Sound system with wireless mics"
        ],
        popular: false
      },
      {
        id: "night-vip",
        name: "VIP Night Experience",
        price: "LKR 150,000",
        duration: "8 hours",
        guests: "Up to 50 people",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        features: [
          "Premium lighting & stage setup",
          "Live band or celebrity DJ",
          "VIP lounge area setup",
          "Premium bar with mixologist",
          "Gourmet midnight buffet",
          "Professional security team",
          "Photography & social media coverage",
          "Transportation service",
          "After-party cleanup included"
        ],
        popular: true
      }
    ],
    bbq: [
      {
        id: "bbq-classic",
        name: "Classic BBQ Gathering",
        price: "LKR 35,000",
        duration: "4 hours",
        guests: "Up to 20 people",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
        features: [
          "BBQ grill setup with chef",
          "Fresh meat & seafood selection",
          "Vegetarian options available",
          "Side dishes & salads",
          "Beverages & soft drinks",
          "Outdoor seating arrangement",
          "Basic sound system"
        ],
        popular: false
      },
      {
        id: "bbq-premium",
        name: "Premium BBQ Experience",
        price: "LKR 65,000",
        duration: "6 hours",
        guests: "Up to 35 people",
        image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80",
        features: [
          "Professional BBQ chef service",
          "Premium meat & seafood buffet",
          "Live cooking stations",
          "Full beverage bar setup",
          "Pool access & games",
          "Comfortable outdoor furniture",
          "Background music system",
          "Photography service (2 hours)"
        ],
        popular: true
      }
    ],
    pool: [
      {
        id: "pool-splash",
        name: "Splash Pool Party",
        price: "LKR 55,000",
        duration: "5 hours",
        guests: "Up to 30 people",
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?auto=format&fit=crop&w=800&q=80",
        features: [
          "Pool access with safety equipment",
          "Poolside decorations & setup",
          "Water games & activities",
          "Pool floats & toys provided",
          "Refreshments & tropical drinks",
          "Poolside BBQ setup",
          "Music system with waterproof speakers",
          "Lifeguard service included"
        ],
        popular: true
      },
      {
        id: "pool-luxury",
        name: "Luxury Pool Experience",
        price: "LKR 95,000",
        duration: "7 hours",
        guests: "Up to 45 people",
        image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80",
        features: [
          "Premium pool setup with cabanas",
          "Pool bar with cocktail service",
          "Professional pool entertainment",
          "Luxury pool furniture & umbrellas",
          "Gourmet poolside dining",
          "Water sports equipment",
          "Professional photography",
          "Spa services available",
          "Evening pool lighting"
        ],
        popular: false
      }
    ],
    anniversary: [
      {
        id: "anniversary-romantic",
        name: "Romantic Anniversary Celebration",
        price: "LKR 65,000",
        duration: "5 hours",
        guests: "Up to 20 people",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        features: [
          "Romantic decoration with flowers & candles",
          "Anniversary cake with personalization",
          "Intimate dining setup for couple",
          "Soft background music",
          "Photography session (2 hours)",
          "Champagne toast service",
          "Memory lane photo display setup"
        ],
        popular: true
      },
      {
        id: "anniversary-grand",
        name: "Grand Anniversary Celebration",
        price: "LKR 110,000",
        duration: "7 hours",
        guests: "Up to 50 people",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
        features: [
          "Elegant venue decoration with floral arrangements",
          "Multi-tier anniversary cake",
          "Live music or DJ entertainment",
          "Full dinner service for guests",
          "Professional photography & videography",
          "Anniversary video montage display",
          "Special lighting and ambiance",
          "Guest accommodation coordination",
          "Anniversary gift presentation ceremony"
        ],
        popular: false
      }
    ],
    getogether: [
      {
        id: "getogether-casual",
        name: "Casual Get Together",
        price: "LKR 25,000",
        duration: "4 hours",
        guests: "Up to 25 people",
        image: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80",
        features: [
          "Comfortable seating arrangements",
          "Light refreshments & snacks",
          "Soft drinks & beverages",
          "Background music system",
          "Games and activities setup",
          "Basic photography service",
          "Clean-up service included"
        ],
        popular: true
      },
      {
        id: "getogether-premium",
        name: "Premium Get Together",
        price: "LKR 45,000",
        duration: "6 hours",
        guests: "Up to 40 people",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
        features: [
          "Premium lounge setup with comfortable furniture",
          "Full catering service with variety of cuisines",
          "Premium beverage bar",
          "Entertainment system with music & games",
          "Pool access and recreational activities",
          "Professional photography (3 hours)",
          "Event coordination service",
          "Transportation assistance"
        ],
        popular: false
      }
    ]
  };

  const handleBooking = async (packageData) => {
    console.log('handleBooking called with:', packageData);
    console.log('Current auth state:', isAuthenticated);
    const token = localStorage.getItem('token');
    console.log('Token in localStorage:', !!token);
    
    // Improved authentication check - prioritize token presence
    const userRole = localStorage.getItem('userRole');
    const userFullName = localStorage.getItem('userFullName');
    
    if (!token) {
      console.log('No token found, user not authenticated');
      localStorage.setItem('pendingBooking', JSON.stringify(packageData));
      setShowAuthModal(true);
      return;
    }
    
    // If we have a token, proceed even if isAuthenticated is still false due to async loading
    console.log('Token found, proceeding with booking form');
    console.log('User role:', userRole);
    console.log('User name:', userFullName);

    // Get user details - try database first, then localStorage fallback
    let currentUserProfile = userProfile;
    
    // If no profile from database, try to fetch it
    if (!currentUserProfile) {
      try {
        console.log('No user profile loaded, attempting to fetch...');
        const profileResponse = await bookingAPI.getUserProfile();
        if (profileResponse.ok && profileResponse.json) {
          currentUserProfile = profileResponse.json;
          setUserProfile(currentUserProfile);
          console.log('Profile fetched successfully:', currentUserProfile);
        }
      } catch (error) {
        console.warn('Failed to fetch user profile from API:', error);
      }
    }

    // Extract user details with comprehensive fallbacks
    const userName = currentUserProfile?.name || 
                    currentUserProfile?.full_name || 
                    currentUserProfile?.firstName || 
                    currentUserProfile?.username || 
                    localStorage.getItem('userFullName') ||
                    localStorage.getItem('username')?.split('@')[0] || // Use part before @ if email
                    'User';
    
    const userEmail = currentUserProfile?.email || 
                     localStorage.getItem('username') || // username is stored as email in your auth
                     '';

    console.log('Auto-filling form with user data:', { 
      userName, 
      userEmail, 
      userProfile: currentUserProfile,
      localStorageData: {
        userFullName: localStorage.getItem('userFullName'),
        username: localStorage.getItem('username'),
        token: !!localStorage.getItem('token')
      }
    });

    // User is authenticated, proceed with booking
    setSelectedPackage(packageData);
    setFormData(prev => ({
      ...prev,
      eventType: packageData.name,
      packageId: packageData.id,
      name: userName,
      email: userEmail
    }));
    setShowBookingForm(true);
  };

  // Helper function to map package names to event types
  const getEventTypeFromPackage = (packageName) => {
    if (packageName.toLowerCase().includes('birthday')) return 'Birthday Party';
    if (packageName.toLowerCase().includes('night')) return 'Night Function';
    if (packageName.toLowerCase().includes('bbq')) return 'BBQ Event';
    if (packageName.toLowerCase().includes('pool')) return 'Pool Party';
    if (packageName.toLowerCase().includes('anniversary')) return 'Anniversary';
    if (packageName.toLowerCase().includes('get together') || packageName.toLowerCase().includes('getogether')) return 'Get Together';
    return 'Other Event';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare booking data for API
      const bookingData = {
        packageId: formData.packageId,
        packageName: formData.eventType,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        eventDate: formData.eventDate,
        guestCount: formData.guestCount,
        specialRequests: formData.message || null
      };

      console.log("📋 Submitting event booking:", bookingData);
      console.log("🔑 Token available:", !!localStorage.getItem('token'));
      console.log("👤 User authenticated:", isAuthenticated);

      // Submit booking to database
      const response = await bookingAPI.createBooking(bookingData);
      
      console.log("📡 Booking submission response:", response);
      
      if (response.ok) {
        console.log("✅ Booking saved to database successfully:", response.json);
        setShowSuccessModal(true);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventType: "",
          eventDate: "",
          guestCount: "",
          message: "",
          packageId: ""
        });
      } else {
        console.error("❌ Booking submission failed:", response.error);
        
        // Show specific error messages
        if (response.error?.includes('Backend server not running')) {
          alert('❌ Backend server is not running!\n\nYour booking could not be saved to the database.\n\nPlease:\n1. Start your backend server\n2. Make sure it\'s running on the correct port\n3. Try submitting the booking again');
        } else if (response.error?.includes('Authentication')) {
          alert('❌ Authentication failed!\n\nPlease log in again and try booking.');
          // Optionally redirect to login
          navigate('/auth');
        } else {
          alert(`❌ Booking failed: ${response.error || 'Unknown error occurred'}`);
        }
      }
    } catch (error) {
      console.error("💥 Error submitting booking:", error);
      alert('❌ An unexpected error occurred while submitting your booking.\n\nPlease check:\n1. Your internet connection\n2. Backend server is running\n3. Try again later');
    }
  };

  return (
    <div className="bg-white text-gray-900">
      <Navbar />

      {/* Loading state */}
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Authentication Status Banner */}
          {!isAuthenticated && (
            <div className="bg-orange-50 border-b border-orange-200 py-3">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-orange-800">
                  <span className="font-semibold">Want to book an event?</span> 
                  <button 
                    onClick={redirectToAuth}
                    className="ml-2 text-orange-600 hover:text-orange-800 underline font-medium"
                  >
                    Login or Register here
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <div ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1920&q=80" 
            alt="Event Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        
        <div className="hero-content relative z-10 px-4 py-32 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Celebrate Life's 
              <span className="text-orange-500"> Special Moments</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Create unforgettable memories at WEGA VILLA 98 with our exclusive event packages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    const confirmRedirect = window.confirm(
                      "You need to be logged in to book an event. Would you like to go to the login page?"
                    );
                    if (confirmRedirect) {
                      redirectToAuth();
                    }
                    return;
                  }
                  // Scroll to packages section
                  packagesRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
              >
                <PartyPopper className="inline w-5 h-5 mr-2" />
                {isAuthenticated ? 'Book Your Event' : 'Login to Book Event'}
              </button>
              <button 
                onClick={() => packagesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-full transition-all duration-300"
              >
                View Packages
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Event Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully curated event packages designed to make your celebration extraordinary
            </p>
          </div>

          {/* Package Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: "birthday", name: "Birthday Parties", icon: Gift },
              { id: "night", name: "Night Functions", icon: Music },
              { id: "bbq", name: "BBQ Events", icon: Utensils },
              { id: "pool", name: "Pool Parties", icon: Users },
              { id: "anniversary", name: "Anniversary", icon: Sparkles },
              { id: "getogether", name: "Get Together", icon: Users }
            ].map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === id
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {name}
              </button>
            ))}
          </div>

          {/* Package Cards */}
          <div ref={packagesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventPackages[activeTab]?.map((pkg) => (
              <div 
                key={pkg.id} 
                className="package-card relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-orange-500">{pkg.price}</span>
                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center mb-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {pkg.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {pkg.guests}
                      </div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {pkg.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-sm text-orange-500 font-medium">
                        +{pkg.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                  
                  <button 
                    onClick={() => handleBooking(pkg)}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    Book This Package
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Events Information */}
          {/* Custom event section removed */}
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose WEGA VILLA 98?
            </h2>
            <p className="text-xl text-gray-600">
              Experience exceptional event hosting with our premium amenities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                title: "Prime Location",
                description: "Beautiful beachfront venue in Unawatuna with stunning ocean views"
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Professional event coordinators and hospitality staff at your service"
              },
              {
                icon: Camera,
                title: "Photo-Ready Venue",
                description: "Instagram-worthy spaces perfect for capturing memorable moments"
              },
              {
                icon: Sparkles,
                title: "Custom Experiences",
                description: "Tailored packages to match your vision and preferences"
              }
            ].map((feature, index) => (
              <div key={index} className="feature-item text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Event Gallery
            </h2>
            <p className="text-xl text-gray-600">
              See how we bring celebrations to life
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80"
            ].map((url, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl group cursor-pointer">
                <img 
                  src={url} 
                  alt={`Event ${index + 1}`}
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Plan Your Event?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's create an unforgettable experience together. Contact us today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  const confirmRedirect = window.confirm(
                    "You need to be logged in to book an event. Would you like to go to the login page?"
                  );
                  if (confirmRedirect) {
                    redirectToAuth();
                  }
                  return;
                }
                setShowBookingForm(true);
              }}
              className="px-8 py-4 bg-white text-orange-500 hover:bg-gray-100 font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              {isAuthenticated ? 'Book Now' : 'Login to Book'}
            </button>
            <a 
              href="tel:+94701234567"
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-orange-500 font-semibold rounded-full transition-all duration-300 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us: +94 70 1234567
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Book Your Event</h3>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {selectedPackage && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800">{selectedPackage.name}</h4>
                  <p className="text-orange-600">{selectedPackage.price} • {selectedPackage.duration} • {selectedPackage.guests}</p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select event package</option>
                    
                    {/* Birthday Packages */}
                    <optgroup label="Birthday Parties">
                      <option value="Classic Birthday Bash">Classic Birthday Bash</option>
                      <option value="Deluxe Birthday Celebration">Deluxe Birthday Celebration</option>
                      <option value="Premium Birthday Extravaganza">Premium Birthday Extravaganza</option>
                    </optgroup>
                    
                    {/* Night Function Packages */}
                    <optgroup label="Night Functions">
                      <option value="Night Groove Party">Night Groove Party</option>
                      <option value="VIP Night Experience">VIP Night Experience</option>
                    </optgroup>
                    
                    {/* BBQ Packages */}
                    <optgroup label="BBQ Events">
                      <option value="Classic BBQ Gathering">Classic BBQ Gathering</option>
                      <option value="Premium BBQ Experience">Premium BBQ Experience</option>
                    </optgroup>
                    
                    {/* Pool Party Packages */}
                    <optgroup label="Pool Parties">
                      <option value="Splash Pool Party">Splash Pool Party</option>
                      <option value="Luxury Pool Experience">Luxury Pool Experience</option>
                    </optgroup>
                    
                    {/* Anniversary Packages */}
                    <optgroup label="Anniversary">
                      <option value="Romantic Anniversary Celebration">Romantic Anniversary Celebration</option>
                      <option value="Grand Anniversary Celebration">Grand Anniversary Celebration</option>
                    </optgroup>
                    
                    {/* Get Together Packages */}
                    <optgroup label="Get Together">
                      <option value="Casual Get Together">Casual Get Together</option>
                      <option value="Premium Get Together">Premium Get Together</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <select
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select guest count</option>
                    <option value="10-20">10-20 guests</option>
                    <option value="21-35">21-35 guests</option>
                    <option value="36-50">36-50 guests</option>
                    <option value="51+">51+ guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests / Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Tell us about any special requirements or preferences..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                >
                  Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Authentication Required Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to book an event. Would you like to login or register now?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    // Set flag to indicate user is being redirected to login
                    localStorage.setItem('justLoggedIn', 'true');
                    navigate('/auth');
                  }}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300"
                >
                  Login / Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Request Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your event booking request has been submitted successfully. We'll contact you within 24 hours to confirm the details.
                {!localStorage.getItem('token')?.includes('.') && (
                  <span className="block text-sm text-orange-600 mt-2">
                    (Development mode: Backend connection will be established)
                  </span>
                )}
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setShowBookingForm(false);
                  setSelectedPackage(null);
                }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Great, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
