import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';

const RoomBooking = () => {
  const [showForm, setShowForm] = useState(false);

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
    setFormData({ ...formData, roomType: type });
    setShowForm(true);
  };

  const roomPackages = [
    {
      type: "Standard Room",
      price: "LKR 7000",
      image: "https://amorgoshotel.com/wp-content/uploads/2014/12/Amorgos-Standard-Room1-e1464286427430.jpg"
    },
    {
      type: "Deluxe Room",
      price: "LKR 9000",
      image: "https://www.oberoihotels.com/-/media/oberoi-hotels/website-images/the-oberoi-new-delhi/room-and-suites/deluxe-room/detail/deluxe-room-1.jpg"
    },
    {
      type: "Family Room",
      price: "LKR 10000",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt4RWUQBu5--E6P7T2CSdrVUGITy1TbPx9UA&s"
    },
    {
      type: "Single Room",
      price: "LKR 5000",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzdXJLfktZCpCbaENaOm-PKZOgQq_cZAPVlw&s"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')] bg-cover bg-center h-96 flex flex-col items-center justify-center text-white px-4">
        <div className="bg-black bg-opacity-50 w-full h-full absolute top-0 left-0 z-0"></div>
        <div className="z-10 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="p-2 rounded text-black"
              placeholder="Check-in Date"
            />
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="p-2 rounded text-black"
              placeholder="Check-out Date"
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 rounded text-black"
              placeholder="Guest"
            />
            <button
              onClick={() => setShowForm(true)}
              className="p-2 rounded-full bg-orange-500 hover:bg-orange-600"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Room Packages */}
      <div className="py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Room Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {roomPackages.map((room, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg"
              onClick={() => selectRoom(room.type)}
            >
              <img
                src={room.image}
                alt={room.type}
                className="w-full h-32 object-cover rounded mb-4"
              />
              <h3 className="font-bold">{room.type}</h3>
              <p>{room.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reserve Your Room Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow-lg max-w-md w-full space-y-3"
          >
            <h2 className="text-lg font-bold text-center">Reserve Your Room</h2>

            <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} className="w-full border px-3 py-1 rounded" required />
            <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} className="w-full border px-3 py-1 rounded" required />
            <input type="number" name="adults" value={formData.adults} onChange={handleChange} min="1" placeholder="Adults" className="w-full border px-3 py-1 rounded" />
            <input type="number" name="children" value={formData.children} onChange={handleChange} min="0" placeholder="Children" className="w-full border px-3 py-1 rounded" />
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-1 rounded" required />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full border px-3 py-1 rounded" required />
            <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} className="w-full border px-3 py-1 rounded" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border px-3 py-1 rounded" required />
            <input type="text" name="roomType" value={formData.roomType} placeholder="Room Type" readOnly className="w-full border px-3 py-1 rounded bg-gray-100" />
            <input type="number" name="noOfRooms" placeholder="Number of Rooms" value={formData.noOfRooms} onChange={handleChange} min="1" className="w-full border px-3 py-1 rounded" />
            <textarea name="specialRequest" placeholder="Special Requests" value={formData.specialRequest} onChange={handleChange} className="w-full border px-3 py-1 rounded"></textarea>

            <button type="submit" className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Confirm</button>
            <button type="button" className="w-full text-sm text-gray-600 mt-1" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RoomBooking;