package com.example.wega_villa.controller;

import com.example.wega_villa.dto.GuideProfileRequest;
import com.example.wega_villa.model.GuideProfile;
import com.example.wega_villa.model.Language;
import com.example.wega_villa.model.User;
import com.example.wega_villa.service.GuideProfileService;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/guide-profile")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class GuideProfileController {
    
    @Autowired
    private GuideProfileService guideProfileService;
    
    // Create guide profile (TOUR_GUIDE only)
    @PostMapping("/create")
    public ResponseEntity<?> createProfile(@Valid @RequestBody GuideProfileRequest profileRequest,
                                         BindingResult bindingResult) {
        try {
            System.out.println("=== GUIDE PROFILE CREATION ATTEMPT ===");
            
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Get user ID
            User user = (User) auth.getPrincipal();
            Long guideId = user.getId();
            
            System.out.println("Guide ID: " + guideId);
            System.out.println("Profile Request: " + profileRequest);
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                System.out.println("Validation errors: " + errors);
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Create profile
            GuideProfile savedProfile = guideProfileService.createProfile(guideId, profileRequest);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedProfile.getId());
            response.put("guideId", savedProfile.getGuideId());
            response.put("phoneNumber", savedProfile.getPhoneNumber());
            response.put("gender", savedProfile.getGender().name());
            response.put("languages", savedProfile.getLanguages());
            response.put("bio", savedProfile.getBio());
            response.put("address", savedProfile.getAddress());
            response.put("experienceYears", savedProfile.getExperienceYears());
            response.put("imageUrl", savedProfile.getImageUrl());
            response.put("ratings", savedProfile.getRatings());
            response.put("totalTours", savedProfile.getTotalTours());
            response.put("createdAt", savedProfile.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("status", "success");
            response.put("message", "Guide profile created successfully!");
            
            System.out.println("Guide profile created successfully with ID: " + savedProfile.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error creating guide profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Update guide profile (TOUR_GUIDE only - own profile)
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody GuideProfileRequest profileRequest,
                                         BindingResult bindingResult) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long guideId = user.getId();
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Update profile
            GuideProfile updatedProfile = guideProfileService.updateProfile(guideId, profileRequest);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedProfile.getId());
            response.put("guideId", updatedProfile.getGuideId());
            response.put("phoneNumber", updatedProfile.getPhoneNumber());
            response.put("gender", updatedProfile.getGender().name());
            response.put("languages", updatedProfile.getLanguages());
            response.put("bio", updatedProfile.getBio());
            response.put("address", updatedProfile.getAddress());
            response.put("experienceYears", updatedProfile.getExperienceYears());
            response.put("imageUrl", updatedProfile.getImageUrl());
            response.put("ratings", updatedProfile.getRatings());
            response.put("totalTours", updatedProfile.getTotalTours());
            response.put("updatedAt", updatedProfile.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("status", "success");
            response.put("message", "Guide profile updated successfully!");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error updating guide profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get own guide profile
    @GetMapping("/my-profile")
    public ResponseEntity<?> getMyProfile() {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long guideId = user.getId();
            
            Optional<GuideProfile> profileOpt = guideProfileService.getProfileByGuideId(guideId);
            if (profileOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Guide profile not found"));
            }
            
            GuideProfile profile = profileOpt.get();
            
            // Prepare response including guide info
            Map<String, Object> response = new HashMap<>();
            response.put("id", profile.getId());
            response.put("guideId", profile.getGuideId());
            response.put("guideName", user.getName());
            response.put("guideEmail", user.getEmail());
            response.put("phoneNumber", profile.getPhoneNumber());
            response.put("gender", profile.getGender().name());
            response.put("languages", profile.getLanguages());
            response.put("bio", profile.getBio());
            response.put("address", profile.getAddress());
            response.put("experienceYears", profile.getExperienceYears());
            response.put("imageUrl", profile.getImageUrl());
            response.put("ratings", profile.getRatings());
            response.put("totalTours", profile.getTotalTours());
            response.put("createdAt", profile.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("updatedAt", profile.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error getting guide profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get profile"));
        }
    }
    
    // Get guide profile by guide ID (public)
    @GetMapping("/guide/{guideId}")
    public ResponseEntity<?> getProfileByGuideId(@PathVariable Long guideId) {
        try {
            Optional<GuideProfile> profileOpt = guideProfileService.getProfileByGuideId(guideId);
            if (profileOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Guide profile not found"));
            }
            
            GuideProfile profile = profileOpt.get();
            
            // Prepare public response (no sensitive info)
            Map<String, Object> response = new HashMap<>();
            response.put("id", profile.getId());
            response.put("guideId", profile.getGuideId());
            response.put("guideName", profile.getGuide().getName());
            response.put("gender", profile.getGender().name());
            response.put("languages", profile.getLanguages());
            response.put("bio", profile.getBio());
            response.put("experienceYears", profile.getExperienceYears());
            response.put("imageUrl", profile.getImageUrl());
            response.put("ratings", profile.getRatings());
            response.put("totalTours", profile.getTotalTours());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error getting guide profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get profile"));
        }
    }
    
    // Get all guide profiles (public)
    @GetMapping("/all")
    public ResponseEntity<?> getAllProfiles() {
        try {
            List<GuideProfile> profiles = guideProfileService.getAllProfiles();
            
            List<Map<String, Object>> response = profiles.stream().map(profile -> {
                Map<String, Object> profileMap = new HashMap<>();
                profileMap.put("id", profile.getId());
                profileMap.put("guideId", profile.getGuideId());
                profileMap.put("guideName", profile.getGuide().getName());
                profileMap.put("gender", profile.getGender().name());
                profileMap.put("languages", profile.getLanguages());
                profileMap.put("bio", profile.getBio());
                profileMap.put("experienceYears", profile.getExperienceYears());
                profileMap.put("imageUrl", profile.getImageUrl());
                profileMap.put("ratings", profile.getRatings());
                profileMap.put("totalTours", profile.getTotalTours());
                return profileMap;
            }).toList();
            
            return ResponseEntity.ok(Map.of("guides", response, "total", response.size()));
            
        } catch (Exception e) {
            System.err.println("Error getting all guide profiles: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get profiles"));
        }
    }
    
    // Get guides by language
    @GetMapping("/by-language/{language}")
    public ResponseEntity<?> getGuidesByLanguage(@PathVariable Language language) {
        try {
            List<GuideProfile> profiles = guideProfileService.getGuidesByLanguage(language);
            
            List<Map<String, Object>> response = profiles.stream().map(profile -> {
                Map<String, Object> profileMap = new HashMap<>();
                profileMap.put("id", profile.getId());
                profileMap.put("guideId", profile.getGuideId());
                profileMap.put("guideName", profile.getGuide().getName());
                profileMap.put("languages", profile.getLanguages());
                profileMap.put("ratings", profile.getRatings());
                profileMap.put("totalTours", profile.getTotalTours());
                profileMap.put("experienceYears", profile.getExperienceYears());
                return profileMap;
            }).toList();
            
            return ResponseEntity.ok(Map.of("guides", response, "language", language, "total", response.size()));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get guides by language"));
        }
    }
    
    // Get top rated guides
    @GetMapping("/top-rated")
    public ResponseEntity<?> getTopRatedGuides() {
        try {
            List<GuideProfile> profiles = guideProfileService.getTopRatedGuides();
            
            List<Map<String, Object>> response = profiles.stream().limit(10).map(profile -> {
                Map<String, Object> profileMap = new HashMap<>();
                profileMap.put("id", profile.getId());
                profileMap.put("guideId", profile.getGuideId());
                profileMap.put("guideName", profile.getGuide().getName());
                profileMap.put("ratings", profile.getRatings());
                profileMap.put("totalTours", profile.getTotalTours());
                profileMap.put("experienceYears", profile.getExperienceYears());
                profileMap.put("languages", profile.getLanguages());
                profileMap.put("imageUrl", profile.getImageUrl());
                return profileMap;
            }).toList();
            
            return ResponseEntity.ok(Map.of("topGuides", response, "total", response.size()));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get top rated guides"));
        }
    }
    
    // Search guides by keyword
    @GetMapping("/search")
    public ResponseEntity<?> searchGuides(@RequestParam String keyword) {
        try {
            List<GuideProfile> profiles = guideProfileService.searchGuidesByKeyword(keyword);
            
            List<Map<String, Object>> response = profiles.stream().map(profile -> {
                Map<String, Object> profileMap = new HashMap<>();
                profileMap.put("id", profile.getId());
                profileMap.put("guideId", profile.getGuideId());
                profileMap.put("guideName", profile.getGuide().getName());
                profileMap.put("bio", profile.getBio());
                profileMap.put("ratings", profile.getRatings());
                profileMap.put("totalTours", profile.getTotalTours());
                profileMap.put("experienceYears", profile.getExperienceYears());
                profileMap.put("languages", profile.getLanguages());
                return profileMap;
            }).toList();
            
            return ResponseEntity.ok(Map.of("guides", response, "keyword", keyword, "total", response.size()));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to search guides"));
        }
    }
    
    // Check if user can create profile
    @GetMapping("/can-create")
    public ResponseEntity<?> canCreateProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            boolean canCreate = guideProfileService.canCreateProfile(user.getId());
            
            return ResponseEntity.ok(Map.of("canCreate", canCreate));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to check profile creation eligibility"));
        }
    }
    
    // Delete guide profile (own profile only)
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            guideProfileService.deleteProfile(user.getId());
            
            return ResponseEntity.ok(Map.of("message", "Guide profile deleted successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
