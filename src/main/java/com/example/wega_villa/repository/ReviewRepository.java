package com.example.wega_villa.repository;

import com.example.wega_villa.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Find all reviews ordered by creation date (newest first)
    List<Review> findAllByOrderByCreatedAtDesc();
    
    // Find reviews by user ID
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find reviews by rating
    List<Review> findByRatingOrderByCreatedAtDesc(Integer rating);
    
    // Find reviews with rating greater than or equal to specified value
    List<Review> findByRatingGreaterThanEqualOrderByCreatedAtDesc(Integer rating);
    
    // Count total reviews
    @Query("SELECT COUNT(r) FROM Review r")
    Long countAllReviews();
    
    // Calculate average rating
    @Query("SELECT AVG(r.rating) FROM Review r")
    Double getAverageRating();
    
    // Get rating distribution
    @Query("SELECT r.rating, COUNT(r) FROM Review r GROUP BY r.rating ORDER BY r.rating")
    List<Object[]> getRatingDistribution();
    
    // Check if user has already reviewed
    boolean existsByUserId(Long userId);
    
    // Get review statistics
    @Query("SELECT " +
           "COUNT(r) as totalReviews, " +
           "AVG(r.rating) as avgRating, " +
           "MIN(r.rating) as minRating, " +
           "MAX(r.rating) as maxRating " +
           "FROM Review r")
    Object getReviewStatistics();
}
