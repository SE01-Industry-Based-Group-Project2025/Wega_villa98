import React, { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} fill={i < rating ? "#facc15" : "none"} className="w-5 h-5" />
      ))}
    </div>
  );
};

const ClientReviews = () => {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([
    {
      name: "Ryan Samuel",
      date: "03 March 2023",
      rating: 4,
      comment:
        "this is the first time i came to the Sri Lanka and i had a great time with the people and the culture. The food was amazing and the hospitality was top-notch. I would definitely recommend this place to anyone looking for a great vacation.",
    },
  ]);
  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setReviews([{ ...newReview, date: new Date().toLocaleDateString() }, ...reviews]);
    setNewReview({ name: "", rating: 0, comment: "" });
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Client Reviews</h2>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">4.7</span>
          <StarRating rating={4} />
          <span className="text-gray-500">Based on {reviews.length} Reviews</span>
        </div>

        <div className="my-6 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-2">
              <Star className="text-yellow-400 w-4 h-4" fill="#facc15" />
              <div className="w-2/3 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-yellow-400 rounded-full"
                  style={{ width: `${Math.floor((reviews.filter(r => r.rating === star).length / reviews.length) * 100)}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{star}★</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">We value your opinion</h3>
          <p className="text-gray-600 mb-4">The time is now for it to be okay to be great. People in this world shun people for being great.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            WRITE A REVIEW
          </button>
        </div>

        {showForm && (
          <div className="mt-4 border p-4 rounded bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Your Review"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-2 border rounded"
                required
              ></textarea>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} Star</option>
                ))}
              </select>
              <button type="submit" className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500">
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b pb-4">
            <StarRating rating={review.rating} />
            <p className="text-gray-700 mt-2">{review.comment}</p>
            <div className="text-sm text-gray-500 mt-2">
              <span className="font-medium text-black">{review.name}</span> — {review.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientReviews;
