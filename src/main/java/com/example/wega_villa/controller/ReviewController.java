package com.example.wega_villa.controller;

import com.example.wega_villa.dto.ReviewRequest;
import com.example.wega_villa.model.Review;
import com.example.wega_villa.model.User;
import com.example.wega_villa.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    // Create a new review (authenticated users only)
    @PostMapping("/create")
    public ResponseEntity<?> createReview(@Valid @RequestBody ReviewRequest reviewRequest,
                                        BindingResult bindingResult) {
        try {
            System.out.println("=== REVIEW CREATION ATTEMPT ===");
            
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in to create a review"));
            }
            
            // Get user ID
            User user = (User) auth.getPrincipal();
            Long userId = user.getId();
            
            System.out.println("User ID: " + userId);
            System.out.println("Review Request: " + reviewRequest);
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> {
                    errors.put(error.getField(), error.getDefaultMessage());
                });
                return ResponseEntity.badRequest().body(Map.of("error", "Validation failed", "details", errors));
            }
            
            // Create review
            Review createdReview = reviewService.createReview(userId, reviewRequest);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Review created successfully");
            response.put("review", formatReviewResponse(createdReview));
            
            System.out.println("Review created successfully: " + createdReview);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            System.err.println("Review creation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error during review creation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Get all reviews (public access)
    @GetMapping("/all")
    public ResponseEntity<?> getAllReviews() {
        try {
            List<Review> reviews = reviewService.getAllReviews();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("reviews", reviews.stream().map(this::formatReviewResponse).toList());
            response.put("total", reviews.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching reviews: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch reviews"));
        }
    }
    
    // Get reviews by rating (public access)
    @GetMapping("/rating/{rating}")
    public ResponseEntity<?> getReviewsByRating(@PathVariable Integer rating) {
        try {
            if (rating < 1 || rating > 5) {
                return ResponseEntity.badRequest().body(Map.of("error", "Rating must be between 1 and 5"));
            }
            
            List<Review> reviews = reviewService.getReviewsByRating(rating);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("reviews", reviews.stream().map(this::formatReviewResponse).toList());
            response.put("rating", rating);
            response.put("total", reviews.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching reviews by rating: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch reviews"));
        }
    }
    
    // Get my reviews (authenticated user only)
    @GetMapping("/my-reviews")
    public ResponseEntity<?> getMyReviews() {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long userId = user.getId();
            
            List<Review> reviews = reviewService.getReviewsByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("reviews", reviews.stream().map(this::formatReviewResponse).toList());
            response.put("total", reviews.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching user reviews: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch your reviews"));
        }
    }
    
    // Update review (authenticated user only, own review only)
    @PutMapping("/update/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId,
                                        @Valid @RequestBody ReviewRequest reviewRequest,
                                        BindingResult bindingResult) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long userId = user.getId();
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> {
                    errors.put(error.getField(), error.getDefaultMessage());
                });
                return ResponseEntity.badRequest().body(Map.of("error", "Validation failed", "details", errors));
            }
            
            Review updatedReview = reviewService.updateReview(reviewId, userId, reviewRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Review updated successfully");
            response.put("review", formatReviewResponse(updatedReview));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error updating review: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update review"));
        }
    }
    
    // Delete review (authenticated user only, own review only)
    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long userId = user.getId();
            
            reviewService.deleteReview(reviewId, userId);
            
            return ResponseEntity.ok(Map.of("status", "success", "message", "Review deleted successfully"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error deleting review: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete review"));
        }
    }
    
    // Get review statistics (public access)
    @GetMapping("/statistics")
    public ResponseEntity<?> getReviewStatistics() {
        try {
            Map<String, Object> stats = reviewService.getReviewStatistics();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("statistics", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching review statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch statistics"));
        }
    }
    
    // Check if user can review (hasn't reviewed yet)
    @GetMapping("/can-review")
    public ResponseEntity<?> checkCanReview() {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long userId = user.getId();
            
            boolean canReview = reviewService.canUserReview(userId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "canReview", canReview,
                "message", canReview ? "User can submit a review" : "User has already submitted a review"
            ));
            
        } catch (Exception e) {
            System.err.println("Error checking review eligibility: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to check review eligibility"));
        }
    }
    
    // Helper method to format review response
    private Map<String, Object> formatReviewResponse(Review review) {
        Map<String, Object> reviewData = new HashMap<>();
        reviewData.put("id", review.getId());
        reviewData.put("userId", review.getUserId());
        reviewData.put("message", review.getMessage());
        reviewData.put("rating", review.getRating());
        reviewData.put("createdAt", review.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        reviewData.put("updatedAt", review.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        // Include user name if user relationship is loaded
        if (review.getUser() != null) {
            reviewData.put("userName", review.getUser().getName());
            reviewData.put("userEmail", review.getUser().getEmail());
        }
        
        return reviewData;
    }
}
