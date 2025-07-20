import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/Footer";
import Review from "../components/ClientReview";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import { usePageTransition } from "../hooks/usePageTransition";

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const Home = () => {
  const { transitionTo, currentPath } = usePageTransition();
  const images = [
    "https://explore.vacations/wp-content/uploads/2024/12/Unawatuna-Beach-Sri-Lanka-.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/628052136.jpg?k=b96629e8fd1bb147acf181a7b7b902112f8460f5b8e15f9988ab6607b2d58534&o=&hp=1",
    "https://www.dearsrilanka.com/_next/image?url=%2Fdestinations%2Fgalle-tour-srilanka.avif&w=3840&q=75"
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const overlayRef = useRef(null);
  const decorativeRef = useRef(null);
  
  // Section refs for scroll animations
  const welcomeRef = useRef(null);
  const welcomeImageRef = useRef(null);
  const welcomeTextRef = useRef(null);
  const bbqRef = useRef(null);
  const bbqImageRef = useRef(null);
  const bbqTextRef = useRef(null);
  const nightRef = useRef(null);
  const nightImageRef = useRef(null);
  const nightTextRef = useRef(null);
  const tourRef = useRef(null);
  const tourImageRef = useRef(null);
  const tourTextRef = useRef(null);
  const reviewsRef = useRef(null);
  
  // Floating elements refs
  const particlesRef = useRef(null);
  const dotsRef = useRef(null);

  const texts = [
    "EXPERIENCE LUXURY",
    "ENJOY & RELAX",
    "DISCOVER PARADISE"
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Text animation cycle
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(textInterval);
  }, [texts.length]);

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Initial page load animations
    tl.fromTo(titleRef.current, 
      { y: 100, opacity: 0, scale: 0.8 }, 
      { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
      "-=1"
    )
    .fromTo(buttonRef.current, 
      { y: 30, opacity: 0, scale: 0.9 }, 
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 
      "-=0.5"
    );

    // Continuous floating animations
    gsap.to(decorativeRef.current, {
      y: -20,
      rotation: 360,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Enhanced button pulse animation
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Floating particles animation
    gsap.to(".floating-particle", {
      y: -30,
      x: 15,
      rotation: 180,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: 0.5
    });

    // Side dots animation
    gsap.to(".nav-dot", {
      scale: 1.2,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: 0.3
    });

    // Welcome Section Scroll Animation
    gsap.fromTo(welcomeImageRef.current,
      { x: -100, opacity: 0, rotation: -10 },
      {
        x: 0,
        opacity: 1,
        rotation: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: welcomeRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(welcomeTextRef.current,
      { x: 100, opacity: 0, y: 50 },
      {
        x: 0,
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: welcomeRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // BBQ Section Animation
    gsap.fromTo(bbqImageRef.current,
      { scale: 0.8, opacity: 0, rotation: 5 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: bbqRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(bbqTextRef.current,
      { x: 150, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bbqRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Night Functions Animation
    gsap.fromTo(nightTextRef.current,
      { x: -150, opacity: 0, y: 30 },
      {
        x: 0,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: nightRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(nightImageRef.current,
      { scale: 0.7, opacity: 0, rotation: -10 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.8)",
        scrollTrigger: {
          trigger: nightRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Tour Guide Animation
    gsap.fromTo(tourImageRef.current,
      { y: 100, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: tourRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(tourTextRef.current,
      { x: 100, opacity: 0, y: 30 },
      {
        x: 0,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: tourRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Reviews Section Animation
    gsap.fromTo(reviewsRef.current,
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: reviewsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Parallax effect for sections
    gsap.to(".parallax-bg", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-bg",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Continuous hover animations for images
    const images = [bbqImageRef.current, nightImageRef.current, tourImageRef.current];
    images.forEach(img => {
      if (img) {
        img.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.1, rotation: 2, duration: 0.3, ease: "power2.out" });
        });
        img.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Text change animation
  useEffect(() => {
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        text: texts[currentTextIndex],
        duration: 1,
        ease: "power2.out"
      });
    }
  }, [currentTextIndex, texts]);
  return (
    <PageTransition transitionKey={currentPath}>
      <div className="page-content min-h-screen bg-gray-50">
        <Navbar />{/* Enhanced Hero Section */}
      <div 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center bg-cover bg-center transition-all duration-1000 overflow-hidden"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >        {/* Animated Background Overlay */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/65 to-black/50"
        ></div>
        
        {/* Decorative Elements */}
        <div 
          ref={decorativeRef}
          className="absolute top-20 right-20 w-32 h-32 border-2 border-amber-400/30 rounded-full hidden md:block"
        ></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white/20 rounded-full hidden md:block"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-particle absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <div className="floating-particle absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="floating-particle absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse"></div>
          <div className="floating-particle absolute top-1/2 right-1/4 w-1 h-1 bg-white/80 rounded-full animate-ping"></div>
          <div className="floating-particle absolute bottom-1/3 right-1/2 w-2 h-2 bg-amber-500/70 rounded-full"></div>
          <div className="floating-particle absolute top-3/4 left-1/5 w-1.5 h-1.5 bg-white/60 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl">
          {/* Villa Name Badge */}
          <div className="inline-block mb-6 px-6 py-2 border border-amber-400/50 rounded-full backdrop-blur-sm bg-white/10">
            <span className="text-amber-300 font-medium tracking-wide">WEGA VILLA 98</span>
          </div>
          
          {/* Animated Title */}
          <h1 
            ref={titleRef}
            className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'serif' }}
          >
            {texts[currentTextIndex]}
          </h1>
          
          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover serenity in the heart of Unawatuna, where luxury meets tranquility 
            and every moment becomes a cherished memory
          </p>
          
          {/* Enhanced CTA Button */}          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">            <button 
              ref={buttonRef}
              onClick={() => transitionTo('/room-booking')}
              className="group relative bg-gradient-to-r from-amber-500 to-amber-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform shadow-xl"
            >
              <span className="relative z-10">Book Your Room</span>
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 transition-opacity duration-300"></div>
            </button>
            <button 
              onClick={() => transitionTo('/about')}
              className="group border-2 border-white/50 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 backdrop-blur-sm"
            >
              <span className="transition-colors duration-300">Explore More</span>
            </button>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Side Navigation Dots */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-4 hidden md:block">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}              
              className={`nav-dot w-3 h-3 rounded-full transition-all duration-300 ${
                currentImage === index 
                  ? 'bg-amber-400 scale-125' 
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

       {/* Welcome Section */}
        <section ref={welcomeRef} className="py-16 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12">
            {/* Image Left */}
            <div ref={welcomeImageRef} className="md:w-1/2 flex justify-center">
              <img
                src="/assets/couple.png"
                alt="Couple"
                className="w-80 md:w-[500px]"
              />
            </div>

            {/* Text Right */}
            <div ref={welcomeTextRef} className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-amber-950 mb-4 mt-10">
                Welcome to Wega Villa <span className="text-amber-600">98!</span>
              </h2>
              <p className="text-lg leading-relaxed text-black">
                Welcome to WEGA VILLA 98, your peaceful getaway nestled in the heart
                of Unawatuna, Galle. Enjoy a calm and relaxing environment surrounded
                by nature, with comfortable rooms and modern amenities. Whether
                you're here to unwind or explore, our villa offers easy access to
                nearby attractions, cultural sites, and beautiful beaches. We're here
                to make your stay memorable and enjoyable.
              </p>
            </div>
          </div>
        </section>


      {/* BBQ Section */}
      <section ref={bbqRef} className="mt-20 py-16 px-4 bg-[#EAE4D5] parallax-bg">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img ref={bbqImageRef} src="/assets/BBQ.jpg" alt="BBQ" className="w-full md:w-1/2 rounded-lg shadow-lg -mt-12 md:-mt-20 transition-transform duration-500"/>
          <div ref={bbqTextRef}>
            <h3 className="text-2xl font-bold mb-4">BBQ Party</h3>
            <p className="text-lg">
              Join us for a fun-filled BBQ party under the stars at WEGA VILLA 98!
              Enjoy delicious grilled dishes, good music, and a garden setting
              perfect for relaxing and making memories with friends and family.
            </p>
          </div>
        </div>
      </section>

      {/* Night Functions */}
      <section ref={nightRef} className="mt-24 py-16 px-4 bg-[#FFE8CD] parallax-bg">
        <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
          <div ref={nightTextRef}>
            <h3 className="text-2xl font-bold mb-4">Night Functions</h3>
            <p className="text-lg">
              Celebrate your special moments at WEGA VILLA 98 with unforgettable
              night functions! Whether it's a birthday, friends' meetup, or
              anniversary, our peaceful garden and lighting set the perfect mood
              for a joyful and private evening.
            </p>
          </div>          
          <img ref={nightImageRef} src="/assets/night.png" alt="Night Party" className="w-full md:w-1/2 rounded-lg shadow-lg -mt-12 md:-mt-20 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Tour Guide */}
      <section ref={tourRef} className=" mt-24 py-10 px-4 bg-[#fff5eb] parallax-bg">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">          
          <img ref={tourImageRef} src="/assets/travel.jpg" alt="Tour Guide"
            className="w-full md:w-1/2 rounded-lg shadow-lg -mt-12 md:-mt-20 transition-transform duration-500"/>
          <div ref={tourTextRef} className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">Tour Guide</h3>
            <p className="text-lg">
              Explore the beauty of Galle with the help of our friendly tour
              guides. From historic sites like the Galle Fort and Dutch Reformed
              Church to relaxing beaches, turtle hatcheries, and local markets,
              our guides will help you discover the best nearby attractions with
              comfort and local insight.
            </p>
          </div>
        </div>
      </section>

      {/* reviews */}
      <section ref={reviewsRef} className=" mt-24 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <Review />
        </div>
      </section>
      <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;