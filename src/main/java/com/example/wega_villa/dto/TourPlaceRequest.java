package com.example.wega_villa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class TourPlaceRequest {
    
    @NotBlank(message = "Tour place name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;
    
    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;
    
    private Boolean isActive = true;
    
    private List<String> imageUrls;
    private List<String> imageAltTexts;
    
    // Default constructor
    public TourPlaceRequest() {}
    
    // Constructor with required fields
    public TourPlaceRequest(String name, String description, String location, String category) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.category = category;
        this.isActive = true;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public List<String> getImageAltTexts() {
        return imageAltTexts;
    }
    
    public void setImageAltTexts(List<String> imageAltTexts) {
        this.imageAltTexts = imageAltTexts;
    }
    
    @Override
    public String toString() {
        return "TourPlaceRequest{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
                ", category='" + category + '\'' +
                ", isActive=" + isActive +
                ", imageUrls=" + imageUrls +
                ", imageAltTexts=" + imageAltTexts +
                '}';
    }
}
