package com.example.wega_villa.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tour_place_images")
public class TourPlaceImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_place_id", nullable = false)
    private TourPlace tourPlace;
    
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
    
    @Column(name = "alt_text")
    private String altText;
    
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;
    
    @Column(name = "display_order")
    private Integer displayOrder = 0;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Default constructor
    public TourPlaceImage() {}
    
    // Constructor with required fields
    public TourPlaceImage(TourPlace tourPlace, String imageUrl, String altText) {
        this.tourPlace = tourPlace;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.isPrimary = false;
        this.displayOrder = 0;
    }
    
    // Constructor with all fields
    public TourPlaceImage(TourPlace tourPlace, String imageUrl, String altText, Boolean isPrimary, Integer displayOrder) {
        this.tourPlace = tourPlace;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.isPrimary = isPrimary;
        this.displayOrder = displayOrder;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public TourPlace getTourPlace() {
        return tourPlace;
    }
    
    public void setTourPlace(TourPlace tourPlace) {
        this.tourPlace = tourPlace;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getAltText() {
        return altText;
    }
    
    public void setAltText(String altText) {
        this.altText = altText;
    }
    
    public Boolean getIsPrimary() {
        return isPrimary;
    }
    
    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "TourPlaceImage{" +
                "id=" + id +
                ", imageUrl='" + imageUrl + '\'' +
                ", altText='" + altText + '\'' +
                ", isPrimary=" + isPrimary +
                ", displayOrder=" + displayOrder +
                ", createdAt=" + createdAt +
                '}';
    }
}
