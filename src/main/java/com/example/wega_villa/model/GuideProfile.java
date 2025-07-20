package com.example.wega_villa.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "guide_profiles")
public class GuideProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "guide_id", nullable = false, unique = true)
    private Long guideId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id", insertable = false, updatable = false)
    private User guide;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "guide_languages", joinColumns = @JoinColumn(name = "guide_profile_id"))
    @Column(name = "language")
    private Set<Language> languages;
    
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "experience_years")
    private Integer experienceYears;
    
    @Column(name = "ratings")
    private Double ratings = 0.0;
    
    @Column(name = "total_tours")
    private Integer totalTours = 0;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public GuideProfile() {}
    
    public GuideProfile(Long guideId, String phoneNumber, Gender gender, Set<Language> languages,
                       String bio, String address, Integer experienceYears) {
        this.guideId = guideId;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.languages = languages;
        this.bio = bio;
        this.address = address;
        this.experienceYears = experienceYears;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getGuideId() {
        return guideId;
    }
    
    public void setGuideId(Long guideId) {
        this.guideId = guideId;
    }
    
    public User getGuide() {
        return guide;
    }
    
    public void setGuide(User guide) {
        this.guide = guide;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public Gender getGender() {
        return gender;
    }
    
    public void setGender(Gender gender) {
        this.gender = gender;
    }
    
    public Set<Language> getLanguages() {
        return languages;
    }
    
    public void setLanguages(Set<Language> languages) {
        this.languages = languages;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public Integer getExperienceYears() {
        return experienceYears;
    }
    
    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }
    
    public Double getRatings() {
        return ratings;
    }
    
    public void setRatings(Double ratings) {
        this.ratings = ratings;
    }
    
    public Integer getTotalTours() {
        return totalTours;
    }
    
    public void setTotalTours(Integer totalTours) {
        this.totalTours = totalTours;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "GuideProfile{" +
                "id=" + id +
                ", guideId=" + guideId +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", gender=" + gender +
                ", languages=" + languages +
                ", bio='" + bio + '\'' +
                ", address='" + address + '\'' +
                ", experienceYears=" + experienceYears +
                ", ratings=" + ratings +
                ", totalTours=" + totalTours +
                ", createdAt=" + createdAt +
                '}';
    }
}
