import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Review from "../components/ClientReview";
import Navbar from "../components/Navbar";

const Home = () => {
  const images = [
    "https://explore.vacations/wp-content/uploads/2024/12/Unawatuna-Beach-Sri-Lanka-.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/628052136.jpg?k=b96629e8fd1bb147acf181a7b7b902112f8460f5b8e15f9988ab6607b2d58534&o=&hp=1",
    "https://www.dearsrilanka.com/_next/image?url=%2Fdestinations%2Fgalle-tour-srilanka.avif&w=3840&q=75"
  ];

  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${images[currentImage]})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          ENJOY & RELAX YOUR TIME
        </h1>
        <p className="text-xl text-white mb-8">
          Make your day relaxing and enjoyable day, join with us
        </p>
        <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md text-lg font-medium transition transform hover:scale-105">
          Book Now
        </button>
      </div>
    </div>

       {/* Welcome Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12">
            {/* Image Left */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/assets/couple.png"
                alt="Couple"
                className="w-80 md:w-[500px]"
              />
            </div>

            {/* Text Right */}
            <div className="md:w-1/2 text-center md:text-left">
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
      <section className="mt-20 py-16 px-4 bg-[#EAE4D5]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img src="/assets/BBQ.jpg" alt="BBQ" className="w-full md:w-1/2 rounded-lg shadow-lg -mt-12 md:-mt-20 transition-transform duration-500 hover:scale-105"/>
          <div>
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
      <section className="mt-24 py-16 px-4 bg-[#FFE8CD]">
        <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Night Functions</h3>
            <p className="text-lg">
              Celebrate your special moments at WEGA VILLA 98 with unforgettable
              night functions! Whether it's a birthday, friends' meetup, or
              anniversary, our peaceful garden and lighting set the perfect mood
              for a joyful and private evening.
            </p>
          </div>
          <img src="/assets/night.png" alt="Night Party" className="w-full md:w-1/2 rounded-lg shadow-lg -mt-12 md:-mt-20 transition-transform duration-500 hover:scale-105"
          />
        </div>
      </section>

      {/* Tour Guide */}
      <section className=" mt-24 py-10 px-4 bg-[#fff5eb]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img src="/assets/travel.jpg" alt="Tour Guide"
            className="w-full md:w-1/2 rounded-lg shadow-lg -mt-12 md:-mt-20 transition-transform duration-500 hover:scale-105"/>
          <div className="text-center md:text-left">
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
      <section className=" mt-24 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <Review />
        </div>
      </section>

      <Footer/>
    </div>
  );
};

export default Home;