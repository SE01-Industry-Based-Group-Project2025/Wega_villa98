package com.example.wega_villa.dto;

import jakarta.validation.constraints.*;

public class ReviewRequest {
    
    @NotBlank(message = "Review message is required")
    @Size(max = 1000, message = "Review message must not exceed 1000 characters")
    private String message;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;
    
    // Default constructor
    public ReviewRequest() {}
    
    // Constructor
    public ReviewRequest(String message, Integer rating) {
        this.message = message;
        this.rating = rating;
    }
    
    // Getters and Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    @Override
    public String toString() {
        return "ReviewRequest{" +
                "message='" + message + '\'' +
                ", rating=" + rating +
                '}';
    }
}
