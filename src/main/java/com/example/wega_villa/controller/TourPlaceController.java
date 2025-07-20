package com.example.wega_villa.controller;

import com.example.wega_villa.dto.TourPlaceRequest;
import com.example.wega_villa.model.TourPlace;
import com.example.wega_villa.model.TourPlaceImage;
import com.example.wega_villa.model.User;
import com.example.wega_villa.service.TourPlaceService;
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
@RequestMapping("/api/tour-places")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class TourPlaceController {
    
    @Autowired
    private TourPlaceService tourPlaceService;
    
    // Create a new tour place (MANAGER/ADMIN only)
    @PostMapping
    public ResponseEntity<?> createTourPlace(@Valid @RequestBody TourPlaceRequest request,
                                           BindingResult bindingResult) {
        try {
            System.out.println("=== TOUR PLACE CREATION ATTEMPT ===");
            
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has MANAGER or ADMIN role
            User user = (User) auth.getPrincipal();
            boolean canManage = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER") || 
                                         authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!canManage) {
                return ResponseEntity.status(403).body(Map.of("error", "Only managers and admins can create tour places"));
            }
            
            System.out.println("User: " + user.getEmail());
            System.out.println("Tour Place Request: " + request);
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Create tour place
            TourPlace createdTourPlace = tourPlaceService.createTourPlace(request);
            
            // Format response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tour place created successfully");
            response.put("tourPlace", formatTourPlaceResponse(createdTourPlace));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            System.err.println("Tour place creation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error during tour place creation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Get all tour places (public access)
    @GetMapping
    public ResponseEntity<?> getAllTourPlaces(@RequestParam(required = false, defaultValue = "true") String activeOnly) {
        try {
            List<TourPlace> tourPlaces;
            
            if ("false".equalsIgnoreCase(activeOnly)) {
                // Admin/Manager can see all including inactive
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                    User user = (User) auth.getPrincipal();
                    boolean canManage = user.getAuthorities().stream()
                            .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER") || 
                                                 authority.getAuthority().equals("ROLE_ADMIN"));
                    if (canManage) {
                        tourPlaces = tourPlaceService.getAllTourPlaces();
                    } else {
                        tourPlaces = tourPlaceService.getAllActiveTourPlaces();
                    }
                } else {
                    tourPlaces = tourPlaceService.getAllActiveTourPlaces();
                }
            } else {
                tourPlaces = tourPlaceService.getAllActiveTourPlaces();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("tourPlaces", tourPlaces.stream().map(this::formatTourPlaceResponse).toList());
            response.put("total", tourPlaces.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching tour places: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch tour places"));
        }
    }
    
    // Get tour place by ID (public access)
    @GetMapping("/{id}")
    public ResponseEntity<?> getTourPlaceById(@PathVariable Long id) {
        try {
            Optional<TourPlace> tourPlaceOpt = tourPlaceService.getActiveTourPlaceById(id);
            
            if (tourPlaceOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tour place not found"));
            }
            
            TourPlace tourPlace = tourPlaceOpt.get();
            Map<String, Object> response = formatTourPlaceResponse(tourPlace);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching tour place: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch tour place"));
        }
    }
    
    // Get tour places by category (public access)
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getTourPlacesByCategory(@PathVariable String category) {
        try {
            List<TourPlace> tourPlaces = tourPlaceService.getTourPlacesByCategory(category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("category", category);
            response.put("tourPlaces", tourPlaces.stream().map(this::formatTourPlaceResponse).toList());
            response.put("total", tourPlaces.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching tour places by category: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch tour places"));
        }
    }
    
    // Get tour places by location (public access)
    @GetMapping("/location/{location}")
    public ResponseEntity<?> getTourPlacesByLocation(@PathVariable String location) {
        try {
            List<TourPlace> tourPlaces = tourPlaceService.getTourPlacesByLocation(location);
            
            Map<String, Object> response = new HashMap<>();
            response.put("location", location);
            response.put("tourPlaces", tourPlaces.stream().map(this::formatTourPlaceResponse).toList());
            response.put("total", tourPlaces.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching tour places by location: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch tour places"));
        }
    }
    
    // Search tour places (public access)
    @GetMapping("/search")
    public ResponseEntity<?> searchTourPlaces(@RequestParam String q) {
        try {
            List<TourPlace> tourPlaces = tourPlaceService.searchTourPlaces(q);
            
            Map<String, Object> response = new HashMap<>();
            response.put("searchTerm", q);
            response.put("tourPlaces", tourPlaces.stream().map(this::formatTourPlaceResponse).toList());
            response.put("total", tourPlaces.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error searching tour places: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to search tour places"));
        }
    }
    
    // Update tour place (MANAGER/ADMIN only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTourPlace(@PathVariable Long id,
                                           @Valid @RequestBody TourPlaceRequest request,
                                           BindingResult bindingResult) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has MANAGER or ADMIN role
            User user = (User) auth.getPrincipal();
            boolean canManage = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER") || 
                                         authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!canManage) {
                return ResponseEntity.status(403).body(Map.of("error", "Only managers and admins can update tour places"));
            }
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Update tour place
            TourPlace updatedTourPlace = tourPlaceService.updateTourPlace(id, request);
            
            // Format response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tour place updated successfully");
            response.put("tourPlace", formatTourPlaceResponse(updatedTourPlace));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Delete tour place (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTourPlace(@PathVariable Long id) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has ADMIN role
            User user = (User) auth.getPrincipal();
            boolean isAdmin = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Only admins can delete tour places"));
            }
            
            // Delete tour place
            tourPlaceService.deleteTourPlace(id);
            
            return ResponseEntity.ok(Map.of("message", "Tour place deleted successfully"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Toggle tour place status (MANAGER/ADMIN only)
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleTourPlaceStatus(@PathVariable Long id) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has MANAGER or ADMIN role
            User user = (User) auth.getPrincipal();
            boolean canManage = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER") || 
                                         authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!canManage) {
                return ResponseEntity.status(403).body(Map.of("error", "Only managers and admins can toggle tour place status"));
            }
            
            // Toggle status
            TourPlace updatedTourPlace = tourPlaceService.toggleTourPlaceStatus(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tour place status updated successfully");
            response.put("tourPlace", formatTourPlaceResponse(updatedTourPlace));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Get filter options (categories and locations) (public access)
    @GetMapping("/filters")
    public ResponseEntity<?> getFilterOptions() {
        try {
            List<String> categories = tourPlaceService.getDistinctCategories();
            List<String> locations = tourPlaceService.getDistinctLocations();
            
            Map<String, Object> response = new HashMap<>();
            response.put("categories", categories);
            response.put("locations", locations);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error fetching filter options: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch filter options"));
        }
    }
    
    // Get tour place statistics (MANAGER/ADMIN only)
    @GetMapping("/statistics")
    public ResponseEntity<?> getTourPlaceStatistics() {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has MANAGER or ADMIN role
            User user = (User) auth.getPrincipal();
            boolean canManage = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER") || 
                                         authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!canManage) {
                return ResponseEntity.status(403).body(Map.of("error", "Only managers and admins can view statistics"));
            }
            
            Map<String, Object> statistics = tourPlaceService.getTourPlaceStatistics();
            
            return ResponseEntity.ok(Map.of("statistics", statistics));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch statistics"));
        }
    }
    
    // Helper method to format tour place response
    private Map<String, Object> formatTourPlaceResponse(TourPlace tourPlace) {
        Map<String, Object> tourPlaceData = new HashMap<>();
        tourPlaceData.put("id", tourPlace.getId());
        tourPlaceData.put("name", tourPlace.getName());
        tourPlaceData.put("description", tourPlace.getDescription());
        tourPlaceData.put("location", tourPlace.getLocation());
        tourPlaceData.put("category", tourPlace.getCategory());
        tourPlaceData.put("isActive", tourPlace.getIsActive());
        
        // Add images
        List<TourPlaceImage> images = tourPlaceService.getTourPlaceImages(tourPlace.getId());
        List<Map<String, Object>> imageList = images.stream().map(image -> {
            Map<String, Object> imageData = new HashMap<>();
            imageData.put("id", image.getId());
            imageData.put("imageUrl", image.getImageUrl());
            imageData.put("altText", image.getAltText());
            imageData.put("isPrimary", image.getIsPrimary());
            imageData.put("displayOrder", image.getDisplayOrder());
            return imageData;
        }).toList();
        
        tourPlaceData.put("images", imageList);
        
        // Add primary image URL for easy access
        TourPlaceImage primaryImage = images.stream()
                .filter(TourPlaceImage::getIsPrimary)
                .findFirst()
                .orElse(images.isEmpty() ? null : images.get(0));
        
        tourPlaceData.put("primaryImageUrl", primaryImage != null ? primaryImage.getImageUrl() : null);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        tourPlaceData.put("createdAt", tourPlace.getCreatedAt().format(formatter));
        tourPlaceData.put("updatedAt", tourPlace.getUpdatedAt().format(formatter));
        
        return tourPlaceData;
    }
}
