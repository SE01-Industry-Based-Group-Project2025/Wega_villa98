package com.example.wega_villa.service;

import com.example.wega_villa.dto.GuideProfileRequest;
import com.example.wega_villa.model.GuideProfile;
import com.example.wega_villa.model.Language;
import com.example.wega_villa.model.User;
import com.example.wega_villa.repository.GuideProfileRepository;
import com.example.wega_villa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class GuideProfileService {
    
    @Autowired
    private GuideProfileRepository guideProfileRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create a new guide profile
    public GuideProfile createProfile(Long guideId, GuideProfileRequest profileRequest) {
        // Verify guide exists and has TOUR_GUIDE role
        Optional<User> userOpt = userRepository.findById(guideId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + guideId);
        }
        
        User guide = userOpt.get();
        boolean hasGuideRole = guide.getRoles().stream()
                .anyMatch(role -> "TOUR_GUIDE".equals(role.getName()));
        
        if (!hasGuideRole) {
            throw new RuntimeException("User must have TOUR_GUIDE role to create a guide profile");
        }
        
        // Check if profile already exists
        if (guideProfileRepository.existsByGuideId(guideId)) {
            throw new RuntimeException("Guide profile already exists for this user");
        }
        
        // Create new profile
        GuideProfile profile = new GuideProfile(
            guideId,
            profileRequest.getPhoneNumber(),
            profileRequest.getGender(),
            profileRequest.getLanguages(),
            profileRequest.getBio(),
            profileRequest.getAddress(),
            profileRequest.getExperienceYears()
        );
        
        if (profileRequest.getImageUrl() != null) {
            profile.setImageUrl(profileRequest.getImageUrl());
        }
        
        GuideProfile savedProfile = guideProfileRepository.save(profile);
        System.out.println("Guide profile created successfully: " + savedProfile);
        return savedProfile;
    }
    
    // Update guide profile
    public GuideProfile updateProfile(Long guideId, GuideProfileRequest profileRequest) {
        GuideProfile profile = guideProfileRepository.findByGuideId(guideId)
                .orElseThrow(() -> new RuntimeException("Guide profile not found for guide ID: " + guideId));
        
        // Update fields
        profile.setPhoneNumber(profileRequest.getPhoneNumber());
        profile.setGender(profileRequest.getGender());
        profile.setLanguages(profileRequest.getLanguages());
        profile.setBio(profileRequest.getBio());
        profile.setAddress(profileRequest.getAddress());
        profile.setExperienceYears(profileRequest.getExperienceYears());
        
        if (profileRequest.getImageUrl() != null) {
            profile.setImageUrl(profileRequest.getImageUrl());
        }
        
        GuideProfile updatedProfile = guideProfileRepository.save(profile);
        System.out.println("Guide profile updated successfully: " + updatedProfile);
        return updatedProfile;
    }
    
    // Get guide profile by guide ID
    public Optional<GuideProfile> getProfileByGuideId(Long guideId) {
        return guideProfileRepository.findByGuideId(guideId);
    }
    
    // Get guide profile by profile ID
    public Optional<GuideProfile> getProfileById(Long profileId) {
        return guideProfileRepository.findById(profileId);
    }
    
    // Get all guide profiles
    public List<GuideProfile> getAllProfiles() {
        return guideProfileRepository.findAll();
    }
    
    // Get top rated guides
    public List<GuideProfile> getTopRatedGuides() {
        return guideProfileRepository.findTopRatedGuides();
    }
    
    // Get guides by language
    public List<GuideProfile> getGuidesByLanguage(Language language) {
        return guideProfileRepository.findByLanguage(language);
    }
    
    // Get guides with minimum rating
    public List<GuideProfile> getGuidesByMinRating(Double minRating) {
        return guideProfileRepository.findByRatingsGreaterThanEqual(minRating);
    }
    
    // Get guides with minimum experience
    public List<GuideProfile> getGuidesByMinExperience(Integer minExperience) {
        return guideProfileRepository.findByExperienceYearsGreaterThanEqual(minExperience);
    }
    
    // Search guides by keyword in bio
    public List<GuideProfile> searchGuidesByKeyword(String keyword) {
        return guideProfileRepository.searchByBioKeyword(keyword);
    }
    
    // Update guide rating and tour count (called after tour completion)
    public void updateGuideStats(Long guideId, Double newRating) {
        GuideProfile profile = guideProfileRepository.findByGuideId(guideId)
                .orElseThrow(() -> new RuntimeException("Guide profile not found for guide ID: " + guideId));
        
        // Update total tours
        profile.setTotalTours(profile.getTotalTours() + 1);
        
        // Calculate new average rating
        Double currentRating = profile.getRatings();
        Integer totalTours = profile.getTotalTours();
        
        if (totalTours == 1) {
            profile.setRatings(newRating);
        } else {
            // Calculate weighted average
            Double newAverageRating = ((currentRating * (totalTours - 1)) + newRating) / totalTours;
            profile.setRatings(Math.round(newAverageRating * 100.0) / 100.0); // Round to 2 decimal places
        }
        
        guideProfileRepository.save(profile);
        System.out.println("Guide stats updated - Tours: " + totalTours + ", Rating: " + profile.getRatings());
    }
    
    // Delete guide profile
    public void deleteProfile(Long guideId) {
        GuideProfile profile = guideProfileRepository.findByGuideId(guideId)
                .orElseThrow(() -> new RuntimeException("Guide profile not found for guide ID: " + guideId));
        
        guideProfileRepository.delete(profile);
        System.out.println("Guide profile deleted for guide ID: " + guideId);
    }
    
    // Get guide statistics
    public Map<String, Object> getGuideStatistics() {
        Object[] stats = guideProfileRepository.getGuideStatistics();
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalGuides", stats[0]);
        statistics.put("averageRating", stats[1]);
        statistics.put("totalTours", stats[2]);
        
        return statistics;
    }
    
    // Check if user can create guide profile
    public boolean canCreateProfile(Long userId) {
        // Check if user exists and has TOUR_GUIDE role
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        boolean hasGuideRole = user.getRoles().stream()
                .anyMatch(role -> "TOUR_GUIDE".equals(role.getName()));
        
        if (!hasGuideRole) {
            return false;
        }
        
        // Check if profile doesn't already exist
        return !guideProfileRepository.existsByGuideId(userId);
    }
}
