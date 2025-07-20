import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';

const RoomBooking = () => {
  const [showForm, setShowForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    name: "",
    age: "",
    contact: "",
    email: "",
    roomType: "",
    noOfRooms: 1,
    specialRequest: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Confirmed", formData);
  };

  const selectRoom = (type) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Show login prompt instead of booking form
      setShowLoginPrompt(true);
      return;
    }
    
    // User is logged in, proceed with booking
    setFormData({ ...formData, roomType: type });
    setShowForm(true);
  };

  const roomPackages = [
    {
      id: 1,
      type: "Standard Room",
      price: "LKR 7,000",
      pricePerNight: "per night",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Comfortable accommodation with modern amenities, perfect for couples or solo travelers.",
      features: ["Queen Size Bed", "Private Bathroom", "Air Conditioning", "Free WiFi", "City View"],
      maxGuests: 2,
      chefIncluded: false,
      foodNote: "No meals included"
    },
    {
      id: 2,
      type: "Standard Room",
      price: "LKR 7,000",
      pricePerNight: "per night",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Cozy standard room with essential amenities for a comfortable stay.",
      features: ["Queen Size Bed", "Private Bathroom", "Air Conditioning", "Free WiFi", "Garden View"],
      maxGuests: 2,
      chefIncluded: false,
      foodNote: "No meals included"
    },
    {
      id: 3,
      type: "Deluxe Room with Chef",
      price: "LKR 12,000",
      pricePerNight: "per night",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Luxurious deluxe room with premium amenities and dedicated chef service for all your meals.",
      features: ["King Size Bed", "Premium Bathroom", "Air Conditioning", "Free WiFi", "Ocean View", "Mini Bar", "Private Chef Service"],
      maxGuests: 3,
      chefIncluded: true,
      foodNote: "All meals included with dedicated chef"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')] bg-cover bg-center h-[500px] flex flex-col items-center justify-center text-white px-4">
        <div className="bg-black bg-opacity-50 w-full h-full absolute top-0 left-0 z-0"></div>
        <div className="z-10 text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Book Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Experience luxury and comfort at Wega Villa with our exclusive room packages
          </p>
          
          {/* Quick Booking Form */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
            <h3 className="text-gray-800 text-lg font-semibold mb-4">Quick Availability Check</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm mb-1">Check-in</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="p-3 rounded-lg text-black border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm mb-1">Check-out</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="p-3 rounded-lg text-black border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm mb-1">Guest Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 rounded-lg text-black border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      setShowLoginPrompt(true);
                    } else {
                      setShowForm(true);
                    }
                  }}
                  className="p-3 px-6 rounded-lg bg-orange-500 hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 text-white font-medium shadow-lg"
                >
                  Check Availability ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Packages */}
      <div className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Room Packages</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully designed accommodations to make your stay at Wega Villa unforgettable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomPackages.map((room, index) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden group"
                onClick={() => selectRoom(room.type)}
              >
                {/* Room Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.type}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {room.chefIncluded && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Chef Included 👨‍🍳
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
                    <span className="text-sm">Max {room.maxGuests} guests</span>
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{room.type}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-orange-500">{room.price}</span>
                      <p className="text-sm text-gray-500">{room.pricePerNight}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{room.description}</p>

                  {/* Food Info */}
                  <div className={`mb-4 p-3 rounded-lg ${room.chefIncluded ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{room.chefIncluded ? '🍽️' : '🚫'}</span>
                      <span className={`text-sm font-medium ${room.chefIncluded ? 'text-green-700' : 'text-orange-700'}`}>
                        {room.foodNote}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {room.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    {room.features.length > 4 && (
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                        {room.features[4]}
                      </div>
                    )}
                    {room.features.length > 5 && (
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                        {room.features[5]}
                      </div>
                    )}
                    {room.features.length > 6 && (
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                        {room.features[6]}
                      </div>
                    )}
                  </div>

                  {/* Book Now Button */}
                  <button className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors transform hover:scale-105 duration-200">
                    Select This Room
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Information</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                • Chef service is available on request for Standard rooms at additional cost<br/>
                • All rooms include complimentary WiFi and daily housekeeping<br/>
                • Check-in: 2:00 PM | Check-out: 11:00 AM<br/>
                • Cancellation policy: Free cancellation up to 24 hours before arrival
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reserve Your Room Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reserve Your Room</h2>
                <p className="text-gray-600">Complete your booking details below</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <input 
                    type="date" 
                    name="checkIn" 
                    value={formData.checkIn} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                  <input 
                    type="date" 
                    name="checkOut" 
                    value={formData.checkOut} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                  <input 
                    type="number" 
                    name="adults" 
                    value={formData.adults} 
                    onChange={handleChange} 
                    min="1" 
                    placeholder="Number of adults" 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                  <input 
                    type="number" 
                    name="children" 
                    value={formData.children} 
                    onChange={handleChange} 
                    min="0" 
                    placeholder="Number of children" 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter your full name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input 
                    type="number" 
                    name="age" 
                    placeholder="Your age" 
                    value={formData.age} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input 
                    type="text" 
                    name="contact" 
                    placeholder="Phone number" 
                    value={formData.contact} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selected Room</label>
                  <input 
                    type="text" 
                    name="roomType" 
                    value={formData.roomType} 
                    placeholder="Room Type" 
                    readOnly 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 text-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms</label>
                  <input 
                    type="number" 
                    name="noOfRooms" 
                    placeholder="Rooms needed" 
                    value={formData.noOfRooms} 
                    onChange={handleChange} 
                    min="1" 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea 
                  name="specialRequest" 
                  placeholder="Any special requirements or requests..." 
                  value={formData.specialRequest} 
                  onChange={handleChange} 
                  rows="3"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Confirm Booking
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h3>
              <p className="text-gray-600">Please log in to your account to book a room at Wega Villa.</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  window.location.href = '/auth';
                }}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RoomBooking;