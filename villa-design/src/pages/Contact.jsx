import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { api } from '../utils/api.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState('');

  // Animation refs
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const avatarsRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Hero section animation
    tl.fromTo(heroRef.current.querySelector('.hero-content'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    // Floating avatars animation
    gsap.to(".floating-avatar", {
      y: "random(-20, 20)",
      x: "random(-10, 10)",
      rotation: "random(-15, 15)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: 0.2
    });

    // Form animation
    gsap.fromTo(formRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.3 }
    );

    // Map animation
    gsap.fromTo(mapRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.5 }
    );

  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Prepare the exact data structure expected by backend
    const contactData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      message: formData.message
    };

    // Debug: Log the exact JSON structure being sent
    console.log('=== FRONTEND CONTACT FORM SUBMISSION ===');
    console.log('Sending contact data:', contactData);
    console.log('JSON string:', JSON.stringify(contactData, null, 2));

    try {
      const result = await api.post('/api/contact/submit', contactData);

      // Check if the API call was successful and get the actual response data
      if (result.ok && result.json) {
        const responseData = result.json;
        console.log('Contact form submitted successfully:', responseData);
        
        // Check if the backend response indicates success (should have id and submittedAt)
        if (responseData.id && responseData.submittedAt) {
          // Show success state
          setIsSubmitted(true);
          
          // Clear form
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            message: ''
          });

          // Reset success message after 3 seconds
          setTimeout(() => {
            setIsSubmitted(false);
          }, 3000);
        } else {
          // If response doesn't have expected success fields, treat as error
          throw new Error('Unexpected response format from server');
        }
      } else {
        // If API call failed, throw an error
        throw new Error(result.error || 'Failed to submit contact form');
      }

    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // Handle different types of errors based on your backend controller
      if (error.response) {
        // Server responded with error status (400, 500, etc.)
        const errorData = error.response.data;
        
        if (error.response.status === 400) {
          // Validation errors from backend
          if (errorData && errorData.error) {
            setError(errorData.error);
          } else {
            setError('Please check your input and try again.');
          }
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('An error occurred. Please try again.');
        }
      } else if (error.message && error.message.includes('Failed to submit')) {
        // API utility returned an error
        setError('Failed to submit contact form. Please try again.');
      } else if (error.message && error.message.includes('Network error')) {
        // Network error - no response received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other errors (client-side, etc.)
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="mt-10 relative min-h-screen bg-gray-50">
        {/* Hero Section with Curved Background */}
        <div ref={heroRef} className="relative overflow-hidden">          {/* Curved Orange Background */}
          <div className="absolute inset-0">
            <svg 
              viewBox="0 0 1440 1000" 
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="50%" stopColor="#F7931E" />
                  <stop offset="100%" stopColor="#FFB347" />
                </linearGradient>
              </defs>
              <path 
                fill="url(#gradient)" 
                d="M0,0 L1440,0 L1440,600 C1200,800 800,700 600,600 C400,500 200,550 0,600 Z"
              />
            </svg>
          </div>

          {/* Floating Avatars */}
          <div ref={avatarsRef} className="absolute inset-0 overflow-hidden">
            {/* Avatar 1 */}
            <div className="floating-avatar absolute top-20 left-20 w-16 h-16 rounded-full bg-white shadow-lg overflow-hidden">
              <img 
                src="https://randomuser.me/api/portraits/women/1.jpg" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Avatar 2 */}
            <div className="floating-avatar absolute top-32 right-32 w-12 h-12 rounded-full bg-white shadow-lg overflow-hidden">
              <img 
                src="https://randomuser.me/api/portraits/men/2.jpg" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Avatar 3 */}
            <div className="floating-avatar absolute top-48 left-1/3 w-14 h-14 rounded-full bg-white shadow-lg overflow-hidden">
              <img 
                src="https://randomuser.me/api/portraits/women/3.jpg" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Avatar 4 */}
            <div className="floating-avatar absolute bottom-32 right-20 w-16 h-16 rounded-full bg-white shadow-lg overflow-hidden">
              <img 
                src="https://randomuser.me/api/portraits/men/4.jpg" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Avatar 5 */}
            <div className="floating-avatar absolute bottom-48 left-16 w-12 h-12 rounded-full bg-white shadow-lg overflow-hidden">
              <img 
                src="https://randomuser.me/api/portraits/women/5.jpg" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Heart Icon */}
            <div className="floating-avatar absolute top-20 right-48 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-red-500 text-xl">❤️</span>
            </div>
          </div>          {/* Hero Content */}
          <div className="hero-content relative z-10 text-center py-40 px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Contact
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Ready to experience luxury at WEGA VILLA 98? We're here to make your dream getaway a reality.
            </p>
          </div>
        </div>        {/* Main Content */}
        <div className="relative -mt-16 z-20 px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">Get in touch</h2>
                  
                  <div className="space-y-6">
                    {/* Phone */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                        <p className="text-gray-600 text-sm mb-2">Ready to help you 24/7 care and ongoing support. Please contact us whenever you need it.</p>
                        <p className="text-orange-600 font-medium">+94 70 1234567</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                        <p className="text-gray-600 text-sm mb-2">Contact us via email for any inquiries or support requests.</p>
                        <p className="text-blue-600 font-medium">info@wegavilla98.com</p>
                      </div>
                    </div>

                    {/* Location Office */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Location Office</h3>
                        <p className="text-gray-600 text-sm mb-2">Visit our office for a personal consultation and experience.</p>
                        <p className="text-green-600 font-medium text-sm">
                          156 Galle Road, Unawatuna Beach, Galle, SRI LANKA
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div ref={formRef} className="bg-white rounded-2xl p-8 shadow-xl">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('firstName')}
                            onBlur={() => setFocusedField('')}
                            placeholder="John"
                            className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                              focusedField === 'firstName' ? 'ring-2 ring-orange-500' : ''
                            }`}
                            required
                          />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('lastName')}
                            onBlur={() => setFocusedField('')}
                            placeholder="Doe"
                            className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                              focusedField === 'lastName' ? 'ring-2 ring-orange-500' : ''
                            }`}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          placeholder="john@example.com"
                          className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                            focusedField === 'email' ? 'ring-2 ring-orange-500' : ''
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField('')}
                          rows={4}
                          placeholder="Your message..."
                          className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none ${
                            focusedField === 'message' ? 'ring-2 ring-orange-500' : ''
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
                      <Send className="w-5 h-5" />
                    </button>

                    {/* Error Message */}
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-medium">{error}</p>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 animate-bounce">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for contacting WEGA VILLA 98. We'll get back to you soon!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Google Maps Section */}
            <div ref={mapRef} className="mt-16">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Find Us</h3>
                  <p className="text-gray-600">Located in the beautiful Unawatuna Beach, Galle</p>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.813347543764!2d80.26288761036223!3d6.020343828781079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae17287d17d0ea9%3A0x62641caea5842134!2sWega%20Villa%2098!5e0!3m2!1sen!2slk!4v1750933235083!5m2!1sen!2slk"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Wega Villa 98 Location"
                  ></iframe>
                  
                  {/* Map Overlay */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-800">WEGA VILLA 98</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
