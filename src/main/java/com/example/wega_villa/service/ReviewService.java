package com.example.wega_villa.service;

import com.example.wega_villa.dto.ReviewRequest;
import com.example.wega_villa.model.Review;
import com.example.wega_villa.model.User;
import com.example.wega_villa.repository.ReviewRepository;
import com.example.wega_villa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create a new review
    public Review createReview(Long userId, ReviewRequest reviewRequest) {
        // Validate that user exists
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        // Allow multiple reviews per user - no restriction
        
        // Create and save review
        Review review = new Review(userId, reviewRequest.getMessage(), reviewRequest.getRating());
        return reviewRepository.save(review);
    }
    
    // Get all reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }
    
    // Get reviews by user ID
    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    // Get reviews by rating
    public List<Review> getReviewsByRating(Integer rating) {
        return reviewRepository.findByRatingOrderByCreatedAtDesc(rating);
    }
    
    // Get reviews with minimum rating
    public List<Review> getReviewsWithMinRating(Integer minRating) {
        return reviewRepository.findByRatingGreaterThanEqualOrderByCreatedAtDesc(minRating);
    }
    
    // Get review by ID
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }
    
    // Update review (only by the user who created it)
    public Review updateReview(Long reviewId, Long userId, ReviewRequest reviewRequest) {
        Optional<Review> existingReviewOpt = reviewRepository.findById(reviewId);
        if (existingReviewOpt.isEmpty()) {
            throw new RuntimeException("Review not found with ID: " + reviewId);
        }
        
        Review existingReview = existingReviewOpt.get();
        if (!existingReview.getUserId().equals(userId)) {
            throw new RuntimeException("You can only update your own reviews");
        }
        
        existingReview.setMessage(reviewRequest.getMessage());
        existingReview.setRating(reviewRequest.getRating());
        
        return reviewRepository.save(existingReview);
    }
    
    // Delete review (only by the user who created it or admin)
    public void deleteReview(Long reviewId, Long userId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isEmpty()) {
            throw new RuntimeException("Review not found with ID: " + reviewId);
        }
        
        Review review = reviewOpt.get();
        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        
        reviewRepository.deleteById(reviewId);
    }
    
    // Get review statistics
    public Map<String, Object> getReviewStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        Long totalReviews = reviewRepository.countAllReviews();
        Double avgRating = reviewRepository.getAverageRating();
        List<Object[]> ratingDistribution = reviewRepository.getRatingDistribution();
        
        stats.put("totalReviews", totalReviews != null ? totalReviews : 0);
        stats.put("averageRating", avgRating != null ? Math.round(avgRating * 100.0) / 100.0 : 0.0);
        
        // Format rating distribution
        Map<Integer, Long> distribution = new HashMap<>();
        for (Object[] row : ratingDistribution) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            distribution.put(rating, count);
        }
        stats.put("ratingDistribution", distribution);
        
        return stats;
    }
    
    // Check if user can review (always true now - multiple reviews allowed)
    public boolean canUserReview(Long userId) {
        return true; // Users can always submit reviews
    }
}
