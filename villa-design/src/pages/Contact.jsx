import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'SL',
    message: '',
    privacy: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 'SL',
        message: '',
        privacy: false
      });
    }, 3000);
  };

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen">
        {/* Animated Background with Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(119,198,255,0.1),transparent)] animate-pulse"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-400/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Main Content Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
              
              {/* Header Section */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-pulse">
                  Get in Touch
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Ready to experience luxury at <span className="font-semibold text-blue-600">WEGA VILLA 98</span>? 
                  <br />We're here to make your dream getaway a reality.
                </p>
              </div>

              <div className="grid lg:grid-cols-5 gap-12 items-start">
                
                {/* Contact Info Cards */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="group">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Call Us</h3>
                          <p className="text-blue-100">+94 70 1234567</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Email Us</h3>
                          <p className="text-purple-100">info@wegavilla98.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Visit Us</h3>
                          <p className="text-pink-100">Negombo, Sri Lanka</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-3">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 shadow-xl">
                    {!isSubmitted ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* First Name */}
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('firstName')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                                focusedField === 'firstName' 
                                  ? 'border-blue-500 shadow-lg shadow-blue-500/25 scale-105' 
                                  : 'border-white/30 hover:border-blue-300'
                              } focus:outline-none`}
                              required
                            />
                          </div>

                          {/* Last Name */}
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('lastName')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                                focusedField === 'lastName' 
                                  ? 'border-blue-500 shadow-lg shadow-blue-500/25 scale-105' 
                                  : 'border-white/30 hover:border-blue-300'
                              } focus:outline-none`}
                              required
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField('')}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                              focusedField === 'email' 
                                ? 'border-blue-500 shadow-lg shadow-blue-500/25 scale-105' 
                                : 'border-white/30 hover:border-blue-300'
                            } focus:outline-none`}
                            required
                          />
                        </div>

                        {/* Phone */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Phone Number
                          </label>
                          <div className={`flex rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                            focusedField === 'phone' 
                              ? 'border-blue-500 shadow-lg shadow-blue-500/25 scale-105' 
                              : 'border-white/30 hover:border-blue-300'
                          }`}>
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="bg-transparent px-4 py-3 text-gray-800 font-medium focus:outline-none rounded-l-xl"
                            >
                              <option value="SL">🇱🇰 SL</option>
                              <option value="CA">🇨🇦 CA</option>
                              <option value="EU">🇪🇺 EU</option>
                            </select>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField('')}
                              placeholder="70 1234567"
                              className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-800"
                              required
                            />
                          </div>
                        </div>

                        {/* Message */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Your Message
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField('')}
                            rows={4}
                            placeholder="Tell us about your dream stay..."
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none ${
                              focusedField === 'message' 
                                ? 'border-blue-500 shadow-lg shadow-blue-500/25 scale-105' 
                                : 'border-white/30 hover:border-blue-300'
                            } focus:outline-none`}
                            required
                          />
                        </div>

                        {/* Privacy Checkbox */}
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="privacy"
                              id="privacy"
                              checked={formData.privacy}
                              onChange={handleInputChange}
                              className="sr-only"
                              required
                            />
                            <div 
                              onClick={() => setFormData(prev => ({...prev, privacy: !prev.privacy}))}
                              className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                                formData.privacy 
                                  ? 'bg-blue-500 border-blue-500' 
                                  : 'bg-white/50 border-white/30 hover:border-blue-300'
                              }`}
                            >
                              {formData.privacy && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>                          <label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                            I agree to the{' '}
                            <button type="button" className="text-blue-600 hover:text-blue-800 underline font-medium">
                              privacy policy
                            </button>
                          </label>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
                        >
                          <span>Send Message</span>
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 animate-bounce">
                          <Check className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Message Sent!</h3>
                        <p className="text-gray-600">
                          Thank you for contacting WEGA VILLA 98. We'll get back to you soon!
                        </p>
                      </div>
                    )}
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