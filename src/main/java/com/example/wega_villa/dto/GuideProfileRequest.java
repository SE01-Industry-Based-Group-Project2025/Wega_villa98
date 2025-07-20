package com.example.wega_villa.dto;

import com.example.wega_villa.model.Gender;
import com.example.wega_villa.model.Language;
import jakarta.validation.constraints.*;
import java.util.Set;

public class GuideProfileRequest {
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9\\s\\-()]{7,15}$", message = "Invalid phone number format")
    private String phoneNumber;
    
    @NotNull(message = "Gender is required")
    private Gender gender;
    
    @NotEmpty(message = "At least one language must be selected")
    private Set<Language> languages;
    
    @NotBlank(message = "Bio is required")
    @Size(max = 2000, message = "Bio must not exceed 2000 characters")
    private String bio;
    
    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @NotNull(message = "Experience years is required")
    @Min(value = 0, message = "Experience years cannot be negative")
    @Max(value = 50, message = "Experience years cannot exceed 50")
    private Integer experienceYears;
    
    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String imageUrl;
    
    // Default constructor
    public GuideProfileRequest() {}
    
    // Constructor
    public GuideProfileRequest(String phoneNumber, Gender gender, Set<Language> languages,
                              String bio, String address, Integer experienceYears) {
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.languages = languages;
        this.bio = bio;
        this.address = address;
        this.experienceYears = experienceYears;
    }
    
    // Getters and Setters
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
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    @Override
    public String toString() {
        return "GuideProfileRequest{" +
                "phoneNumber='" + phoneNumber + '\'' +
                ", gender=" + gender +
                ", languages=" + languages +
                ", bio='" + bio + '\'' +
                ", address='" + address + '\'' +
                ", experienceYears=" + experienceYears +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
