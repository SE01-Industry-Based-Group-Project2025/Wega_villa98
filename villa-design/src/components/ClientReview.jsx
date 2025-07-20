import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, LogIn } from "lucide-react";
import { reviewAPI, showCustomNotification } from "../utils/api";

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
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ message: "", rating: 0 });

  // Load reviews on component mount
  useEffect(() => {
    loadReviews();
  }, []);

  // Load all reviews from database
  const loadReviews = async () => {
    try {
      const result = await reviewAPI.getAllReviews();
      if (result.ok && result.json) {
        // Backend returns { status: "success", reviews: [...], total: number }
        const reviewsData = result.json.reviews || result.json;
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      showCustomNotification('Failed to load reviews', 'error');
    }
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Calculate rating distribution
  const getRatingDistribution = (star) => {
    if (reviews.length === 0) return 0;
    const count = reviews.filter(r => r.rating === star).length;
    return Math.floor((count / reviews.length) * 100);
  };

  const handleWriteReviewClick = async () => {
    if (!isLoggedIn()) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 5000); // Auto hide after 5 seconds
      return;
    }
    
    // Reset form for new review (allow multiple reviews per user)
    setNewReview({ message: "", rating: 0 });
    setShowForm(true);
  };

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);
    try {
      // Prepare review data for API (no userId needed - backend gets it from auth context)
      const reviewData = {
        message: newReview.message,
        rating: newReview.rating
      };

      console.log('=== FRONTEND REVIEW SUBMISSION ===');
      console.log('Submitting review:', reviewData);
      console.log('Token available:', !!localStorage.getItem('token'));
      console.log('Token value:', localStorage.getItem('token')?.substring(0, 50) + '...');

      const result = await reviewAPI.createReview(reviewData);
      
      console.log('Review API response:', result);
      
      if (result.ok) {
        showCustomNotification('Review submitted successfully!', 'success');
        setNewReview({ message: "", rating: 0 });
        setShowForm(false);
        
        // Reload reviews to show the new one
        await loadReviews();
      } else {
        console.error('Failed to submit review:', result.error);
        // Handle the specific case where backend restricts multiple reviews
        if (result.error && result.error.toLowerCase().includes('already')) {
          showCustomNotification('Note: Our system currently allows one review per user, but we appreciate your continued feedback!', 'warning');
        } else {
          showCustomNotification(result.error || 'Failed to submit review', 'error');
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      showCustomNotification('Failed to submit review. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Client Reviews</h2>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{calculateAverageRating()}</span>
          <StarRating rating={Math.round(parseFloat(calculateAverageRating()))} />
          <span className="text-gray-500">Based on {reviews.length} Review{reviews.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="my-6 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-2">
              <Star className="text-yellow-400 w-4 h-4" fill="#facc15" />
              <div className="w-2/3 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${getRatingDistribution(star)}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{star}★</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Share your experience</h3>
          <p className="text-gray-600 mb-4">We value your feedback! Feel free to share your thoughts about your stay with us.</p>
          
          {/* Login Prompt */}
          {showLoginPrompt && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-800">
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Please log in first to write a review</span>
              </div>
              <p className="text-amber-700 text-sm mt-1">
                You need to be logged in to share your experience with us.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="mt-2 bg-amber-600 text-white px-4 py-2 rounded text-sm hover:bg-amber-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}
          
          <button
            onClick={handleWriteReviewClick}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            WRITE A REVIEW
          </button>
        </div>

        {showForm && isLoggedIn() && (
          <div className="mt-4 border p-4 rounded bg-gray-50">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Write Your Review</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  placeholder="Share your experience with us..."
                  value={newReview.message}
                  onChange={(e) => setNewReview({ ...newReview, message: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                  disabled={loading}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating *
                </label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num > 1 ? 's' : ''} - {
                        num === 1 ? 'Poor' : 
                        num === 2 ? 'Fair' : 
                        num === 3 ? 'Good' : 
                        num === 4 ? 'Very Good' : 
                        'Excellent'
                      }
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-yellow-400 px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Star className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 text-lg">No reviews yet</p>
            <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div key={review.id || index} className="border-b pb-4">
              <StarRating rating={review.rating} />
              <p className="text-gray-700 mt-2">{review.message}</p>
              <div className="text-sm text-gray-500 mt-2">
                <span className="font-medium text-black">
                  {review.userName || 'Anonymous User'}
                </span> 
                — {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientReviews;
