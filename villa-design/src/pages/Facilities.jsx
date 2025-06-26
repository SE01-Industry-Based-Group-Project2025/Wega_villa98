import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, Tag, Button, Modal, Image } from "antd";
import { EyeOutlined, HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePageTransition } from "../hooks/usePageTransition";

gsap.registerPlugin(ScrollTrigger);

const Facilities = () => {
  const { transitionTo } = usePageTransition();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const heroRef = useRef(null);
  const galleryRef = useRef(null);
  const facilitiesRef = useRef(null);
  const packagesRef = useRef(null);

  // Gallery images with categories
  const galleryImages = [
    // Rooms
    { id: 1, src: "/assets/hotel1.jpg", category: "rooms", title: "Deluxe Room" },
    { id: 2, src: "/assets/hotel2.jpg", category: "rooms", title: "Premium Suite" },
    { id: 3, src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/628052136.jpg", category: "rooms", title: "Ocean View Room" },
    
    // Bathrooms
    { id: 4, src: "https://images.unsplash.com/photo-1584622781564-1d987ce8040c?w=500", category: "bathroom", title: "Modern Bathroom" },
    { id: 5, src: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500", category: "bathroom", title: "Luxury Bath" },
    { id: 6, src: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500", category: "bathroom", title: "Spa Bathroom" },
    
    // Beach
    { id: 7, src: "/assets/beach.jpg", category: "beach", title: "Unawatuna Beach" },
    { id: 8, src: "/assets/Unawatuna-Beach-Sri-Lanka-.jpg", category: "beach", title: "Beach View" },
    { id: 9, src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500", category: "beach", title: "Sunset Beach" },
    
    // Foods
    { id: 10, src: "/assets/BBQ.jpg", category: "foods", title: "BBQ Special" },
    { id: 11, src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500", category: "foods", title: "Sri Lankan Cuisine" },
    { id: 12, src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500", category: "foods", title: "Fresh Seafood" }
  ];

  // Facilities data
  const facilities = [
    { icon: "📶", title: "Free WiFi", description: "High-speed internet throughout the property" },
    { icon: "🏄‍♂️", title: "Surfing", description: "Surfboard rental and lessons available" },
    { icon: "🚭", title: "No Smoking", description: "Smoke-free environment for your comfort" },
    { icon: "🅿️", title: "Free Parking", description: "Complimentary parking for all guests" },
    { icon: "🏊‍♀️", title: "Swimming Pool", description: "Outdoor pool with ocean view" },
    { icon: "🍽️", title: "Restaurant", description: "On-site dining with local and international cuisine" },
    { icon: "🧘‍♀️", title: "Spa Services", description: "Relaxing spa treatments and massages" },
    { icon: "🚗", title: "Airport Transfer", description: "Convenient transportation service" },
    { icon: "🌴", title: "Garden View", description: "Beautiful tropical garden setting" },
    { icon: "❄️", title: "Air Conditioning", description: "Climate-controlled rooms" },
    { icon: "🔒", title: "Safe Deposit", description: "Secure storage for valuables" },
    { icon: "☕", title: "Coffee Maker", description: "In-room coffee and tea facilities" }
  ];

  // Package offers
  const packages = [
    {
      id: 1,
      title: "Romantic Getaway",
      price: "₹15,000",
      duration: "2 Days / 1 Night",
      features: ["Ocean view room", "Candlelight dinner", "Couple spa", "Beach walk"],
      image: "/assets/couple.png",
      discount: "20% OFF"
    },
    {
      id: 2,
      title: "Adventure Package",
      price: "₹25,000",
      duration: "3 Days / 2 Nights",
      features: ["Surfing lessons", "Galle fort tour", "Turtle watching", "BBQ night"],
      image: "/assets/travel.jpg",
      discount: "15% OFF"
    },
    {
      id: 3,
      title: "Family Fun",
      price: "₹35,000",
      duration: "4 Days / 3 Nights",
      features: ["Family rooms", "Kids activities", "Beach games", "Local tours"],
      image: "/assets/beach.jpg",
      discount: "25% OFF"
    }
  ];

  // Filter gallery images
  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

  // GSAP Animations
  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );

    // Gallery animation with ScrollTrigger
    gsap.fromTo(".gallery-item", {
      opacity: 0,
      y: 50,
      scale: 0.9
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: galleryRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Facilities animation
    gsap.fromTo(".facility-card", {
      opacity: 0,
      x: -50
    }, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: facilitiesRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Packages animation
    gsap.fromTo(".package-card", {
      opacity: 0,
      y: 100,
      rotationY: 15
    }, {
      opacity: 1,
      y: 0,
      rotationY: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: packagesRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

  }, []);

  // Filter animation
  useEffect(() => {
    gsap.fromTo(".gallery-item", {
      opacity: 0,
      scale: 0.8
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out"
    });
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-96 bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
            Our Facilities
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Discover luxury amenities and unforgettable experiences
          </p>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 border-2 border-amber-200/40 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 bg-white/20 rounded-full animate-ping"></div>
      </section>

      {/* Image Gallery Section */}
      <section ref={galleryRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Gallery
            </h2>
            <p className="text-xl text-gray-600">
              Explore our beautiful spaces and amenities
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { key: 'all', label: 'All' },
              { key: 'rooms', label: 'Rooms' },
              { key: 'bathroom', label: 'Bathrooms' },
              { key: 'beach', label: 'Beach' },
              { key: 'foods', label: 'Foods' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeFilter === filter.key
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border-2 border-amber-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="gallery-item group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  preview={{
                    mask: (
                      <div className="flex items-center justify-center space-x-4">
                        <EyeOutlined className="text-2xl" />
                        <span>View</span>
                      </div>
                    ),
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    <Tag color="gold" className="mt-1 capitalize">{image.category}</Tag>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<HeartOutlined />}
                    className="bg-red-500 border-red-500 hover:bg-red-600"
                  />
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<ShareAltOutlined />}
                    className="bg-blue-500 border-blue-500 hover:bg-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section ref={facilitiesRef} className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our Facilities
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for a perfect stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="facility-card group bg-gradient-to-br from-white to-amber-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-amber-100"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {facility.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                  {facility.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {facility.description}
                </p>
                <div className="mt-4 w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section ref={packagesRef} className="py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Special Offers
            </h2>
            <p className="text-xl text-gray-600">
              Exclusive packages tailored for unforgettable experiences
            </p>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="package-card group relative shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden transform hover:-translate-y-4 border-0"
                cover={
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <Tag 
                      color="error" 
                      className="absolute top-4 right-4 text-sm font-bold transform rotate-12 group-hover:rotate-0 transition-transform duration-500"
                    >
                      {pkg.discount}
                    </Tag>
                  </div>
                }
                actions={[                  <Button 
                    type="primary" 
                    size="large" 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 hover:from-amber-600 hover:to-orange-600"
                    onClick={() => transitionTo('/rooms-booking')}
                  >
                    Book Now
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                      {pkg.title}
                    </h3>
                  }
                  description={
                    <div>
                      <p className="text-gray-600 mb-4">{pkg.duration}</p>
                      <div className="space-y-2 mb-6">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-gray-700">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-amber-600">{pkg.price}</span>
                        <span className="text-gray-500 text-sm ml-1">per package</span>
                      </div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Buttons Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Experience Paradise?
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Book your stay or event with us and create unforgettable memories
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">            <button
              onClick={() => transitionTo('/rooms-booking')}
              className="group relative bg-white text-amber-600 px-12 py-4 rounded-full text-xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">🏠 Book Your Room</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            
            <button
              onClick={() => transitionTo('/event-booking')}
              className="group relative border-2 border-white text-white px-12 py-4 rounded-full text-xl font-bold transition-all duration-500 transform hover:scale-105 hover:bg-white hover:text-amber-600 overflow-hidden"
            >
              <span className="relative z-10">🎉 Book Your Event</span>
            </button>
          </div>
        </div>
      </section>      <Footer />
    </div>
  );
};

export default Facilities;
