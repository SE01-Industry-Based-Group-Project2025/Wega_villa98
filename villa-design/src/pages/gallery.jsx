import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';

const Gallery = () => {
  const [filter, setFilter] = useState("Sri Lanka"); // Show all by default

  const allImages = [
    {
      src: "https://do6raq9h04ex.cloudfront.net/sites/8/2021/07/galle-fort-1050x700-1.jpg",
      alt: "Galle Fort",
      category: "Galle",
    },
    {
      src: "https://farm6.staticflickr.com/5569/14805226551_1860f118be_z.jpg",
      alt: "Unawatuna Beach",
      category: "Unawatuna",
    },
    {
      src: "https://www.soulsrilanka.com/image/experiences/three-temple-tour/03.jpg",
      alt: "Sri Lankan Temple",
      category: "Sri Lanka",
    },
    {
      src: "https://nl.lakpura.com/cdn/shop/products/LK60410500-01-E-1280-720.jpg?v=1626270785",
      alt: "Unawatuna Coast",
      category: "Unawatuna",
    },
    {
      src: "https://www.srilanka.travel/buddhist-places/resources/images/gallary-img/Samadhi_Statue-1-thumb.jpg",
      alt: "Buddha Statue",
      category: "Sri Lanka",
    },
    {
      src: "https://media.tacdn.com/media/attractions-splice-spp-674x446/07/ba/dc/be.jpg",
      alt: "Galle Jungle",
      category: "Galle",
    },
    {
      src: "https://www.storiesbysoumya.com/wp-content/uploads/2021/11/sigiriya-rock-fortress.jpg",
      alt: "Sigiriya Rock",
      category: "Sri Lanka",
    },
  ];

  // Show all if "Sri Lanka" is selected
  const filteredImages =
    filter === "Sri Lanka" ? allImages : allImages.filter(img => img.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">Tourist Places</h1>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {["Galle", "Unawatuna", "Sri Lanka"].map((btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-6 py-2 rounded-full border transition font-medium ${
                filter === btn
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredImages.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transform hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>

        {/* Link to Galle Page */}
        <div className="mt-10">
          <Link
            to="/galle"
            className="inline-block mt-6 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Explore Galle
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
