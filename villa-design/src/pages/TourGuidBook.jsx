import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';

const TourGuidBook = () => {
  const initialFormState = {
    name: "",
    id: "",
    date: "",
    language: "",
    adults: 0,
    children: 0,
    specialRequests: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = name === "adults" || name === "children" ? Number(value) : value;
    setFormData({ ...formData, [name]: val });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.id.trim()) newErrors.id = "ID is required";
    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (!formData.language.trim()) newErrors.language = "Language is required";
    if (formData.adults === 0 && formData.children === 0)
      newErrors.adults = "At least one guest must be selected";
    return newErrors;
  };

  const handleConfirm = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      alert("Booking confirmed!");
      setFormData(initialFormState); // Reset the form
    }
  };

  return (
    <div className="bg-[#f7f3ef] min-h-screen flex flex-col">
   
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-6">Book Tour</h2>

          <form className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-amber-800 rounded px-3 py-2"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="id"
                placeholder="ID"
                value={formData.id}
                onChange={handleChange}
                className="w-full border border-amber-800 rounded px-3 py-2"
              />
              {errors.id && (
                <p className="text-red-600 text-sm mt-1">{errors.id}</p>
              )}
            </div>

            <div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-amber-800 rounded px-3 py-2"
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="language"
                placeholder="Preferred Language"
                value={formData.language}
                onChange={handleChange}
                className="w-full border border-amber-800 rounded px-3 py-2"
              />
              {errors.language && (
                <p className="text-red-600 text-sm mt-1">{errors.language}</p>
              )}
            </div>

            <div className="flex justify-between space-x-4">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Adult</label>
                <select
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  className="w-full border border-amber-800 rounded px-2 py-2"
                >
                  {[...Array(11).keys()].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label className="block text-sm mb-1">Child</label>
                <select
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  className="w-full border border-amber-800 rounded px-2 py-2"
                >
                  {[...Array(11).keys()].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.adults && (
              <p className="text-red-600 text-sm mt-1">{errors.adults}</p>
            )}

            <textarea
              name="specialRequests"
              placeholder="Special Requests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="4"
              className="w-full border border-amber-800 rounded px-3 py-2"
            ></textarea>

            <div className="text-md font-semibold mt-4">Total Amount: {/* Add logic if needed */}</div>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full bg-[#C8B7A6] hover:bg-amber-600 text-white py-2 rounded mt-4 transition"
            >
              Confirm
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TourGuidBook;
