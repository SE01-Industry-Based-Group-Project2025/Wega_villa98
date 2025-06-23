import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      {/* Hero Section with Parallax */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-amber-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-orange-300 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Parallax Content */}
        <div 
          className={`relative z-10 text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <h1 className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 mb-8 tracking-tight">
            Our Story
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-8">
              Discover the <span className="text-orange-600 font-semibold">magical experience</span> that awaits you in Sri Lanka.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Immerse in unique experiences, blending <span className="text-amber-600 font-medium">adventure with serenity</span>, 
              creating a truly memorable stay.
            </p>
          </div>
          
          {/* Animated Call to Action */}
          <div className="mt-12">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <span className="relative z-10">Begin Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Animated Landscape */}
        <div className="absolute bottom-0 left-0 right-0 h-32">
          <svg viewBox="0 0 1200 120" className="w-full h-full text-orange-300">
            <path 
              d="M0,80 C200,60 400,90 600,70 C800,50 1000,80 1200,60 L1200,120 L0,120 Z" 
              fill="currentColor" 
              className="animate-pulse opacity-30"
            />
            <path 
              d="M0,90 C300,70 600,100 900,80 C1050,70 1150,85 1200,75 L1200,120 L0,120 Z" 
              fill="currentColor" 
              className="opacity-20"
            />
          </svg>
        </div>
      </div>

      {/* Who We Are Section with Reveal Animation */}
      <div className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-800 mb-4 tracking-wider">WHO WE ARE</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image with Hover Effects */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Villa with swimming pool"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
            
            {/* Content with Staggered Animation */}
            <div className="space-y-8">
              <div className="transform transition-all duration-700 hover:translate-x-2">
                <h3 className="text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  By Sri Lanka, for the world
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="group p-6 rounded-xl hover:bg-orange-50 transition-all duration-300 cursor-pointer">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    <span className="text-6xl font-bold text-orange-500 float-left mr-4 mt-2 leading-none">W</span>
                    aya vila 92 is a <span className="text-orange-600 font-semibold">peaceful escape</span> nestled in the heart of 
                    Sri Lanka, in the quaint village called captain lagoon. Located 
                    in the part of the bay, it's close to beaches, clubs, and restaurants 
                    but tucked among the hills offers a <span className="text-amber-600 font-semibold">unique view</span> within walking 
                    distance to the lagoon.
                  </p>
                </div>
                
                <div className="group p-6 rounded-xl hover:bg-amber-50 transition-all duration-300 cursor-pointer">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    We have beautiful staff with owners, dedicated individuals who share 
                    their <span className="text-orange-600 font-semibold">love for travel</span> for those who share the same sense of 
                    adventure and peace of mind. We believe our guests should experience exactly 
                    what we'd want as guests: <span className="text-amber-600 font-semibold italic">wows with a side of wow</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expect the Extraordinary with Interactive Elements */}
      <div className="py-24 px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-200 to-transparent animate-pulse"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-gray-800 mb-8 tracking-wider">
            EXPECT THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">EXTRAORDINARY</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mb-12"></div>
          
          <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-orange-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">

      {/* Manager Message */}
      <div className="bg-white border-l-4 border-orange-400 p-6 rounded-xl shadow-md max-w-3xl mx-auto text-left">
        <p className="text-gray-800 text-lg leading-relaxed italic mb-4">
          “At Wega Villa 92, we don’t just offer a place to stay — we offer a place to belong. 
          Each corner of our villa is designed to reflect Sri Lanka’s warmth, nature, and hospitality. 
          Come as a guest, leave as family.”
        </p>
        <p className="text-orange-600 font-semibold text-right">– Manager, Wega Villa 92</p>
      </div>

          </div>
        </div>
      </div>

      {/* Belief Section with Circle Left & Text Right */}
<div className="flex flex-col lg:flex-row items-center justify-center mt-40 mb-20 gap-16">
  {/* Circular Image on the Left */}
  <div className="relative group self-center">
    <div className="absolute -inset-8 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
    <div className="relative">
      <div className="w-96 h-96 rounded-full overflow-hidden shadow-2xl border-8 border-white transform group-hover:scale-110 transition-transform duration-500">
        <img 
          src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
          alt="Beach walkway"
          className="w-full h-full object-cover mb-5"
        />
      </div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-500/20 to-transparent"></div>
    </div>
  </div>

  {/* Belief Content on the Right */}
  <div className="flex flex-col gap-8 max-w-xl">
    <div className="group bg-white p-8 rounded-2xl shadow-2xl border border-orange-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full"></div>
      <p className="text-gray-800 font-medium leading-relaxed text-lg group-hover:text-orange-700 transition-colors duration-300">
        We strive more than just a stay, we are your source of 
        <span className="text-orange-600 font-semibold"> discovery, inspiration, celebration, and connection</span>.
      </p>
    </div>
    
    <div className="group bg-white p-8 rounded-2xl shadow-2xl border border-amber-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:-rotate-1">
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full"></div>
      <p className="text-gray-800 font-medium leading-relaxed text-lg group-hover:text-amber-700 transition-colors duration-300">
        We know the <span className="text-amber-600 font-semibold">hidden places, the ancient myths</span> around Earth 
        and strive you to walk where the locals travel and the heart of Sri Lanka.
      </p>
    </div>
  </div>
</div>
      <Footer />
    </div>
  );
}