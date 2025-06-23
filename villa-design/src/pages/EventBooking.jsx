import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EventBookingPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="bg-white text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center text-white text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Celebrate your day with us</h1>
          <button
            className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white font-semibold shadow-md hover:scale-105 transition"
            onClick={() => setShowPopup(true)}
          >
            Book your event
          </button>
        </div>
      </div>

      {/* Event Packages */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Event Packages</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {["Birthday", "Night Function", "BBQ", "Pool Party", "Get Together", "Custom"].map((event, idx) => (
            <div
              key={idx}
              className="bg-gray-100 hover:bg-orange-50 p-6 rounded-xl shadow-md text-center transition duration-300"
            >
              <p className="text-xl font-semibold">{event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Plan Your Event – Pictures</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            // Updated images at indices 0, 3, 5
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // Gallery 1 - new
            "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80", // Gallery 4 - new
            "https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=800&q=80", // Gallery 6 - new
          ].map((url, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl transform hover:scale-105 transition duration-500 shadow-lg"
            >
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Reviews</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-lg shadow-md p-6 max-w-sm w-full">
              <p className="italic">"It was good!"</p>
              <div className="text-yellow-500 mt-2">⭐⭐⭐⭐☆</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Popup Booking Form */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4">Book Your Event</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
              <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
              <select className="w-full p-2 border rounded">
                <option>Select Event Type</option>
                <option>Birthday</option>
                <option>BBQ</option>
                <option>Pool Party</option>
              </select>
              <input type="date" className="w-full p-2 border rounded" />
              <button
                type="submit"
                className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
