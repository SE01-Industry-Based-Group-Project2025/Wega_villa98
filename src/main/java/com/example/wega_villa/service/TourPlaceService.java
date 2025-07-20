package com.example.wega_villa.service;

import com.example.wega_villa.dto.TourPlaceRequest;
import com.example.wega_villa.model.TourPlace;
import com.example.wega_villa.model.TourPlaceImage;
import com.example.wega_villa.repository.TourPlaceRepository;
import com.example.wega_villa.repository.TourPlaceImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TourPlaceService {
    
    @Autowired
    private TourPlaceRepository tourPlaceRepository;
    
    @Autowired
    private TourPlaceImageRepository tourPlaceImageRepository;
    
    // Create a new tour place
    @Transactional
    public TourPlace createTourPlace(TourPlaceRequest request) {
        // Check if name already exists
        if (tourPlaceRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Tour place with name '" + request.getName() + "' already exists");
        }
        
        // Create tour place
        TourPlace tourPlace = new TourPlace(
            request.getName().trim(),
            request.getDescription() != null ? request.getDescription().trim() : "",
            request.getLocation() != null ? request.getLocation().trim() : "",
            request.getCategory() != null ? request.getCategory().trim() : ""
        );
        
        if (request.getIsActive() != null) {
            tourPlace.setIsActive(request.getIsActive());
        }
        
        TourPlace savedTourPlace = tourPlaceRepository.save(tourPlace);
        
        // Add images if provided
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            addImagesToTourPlace(savedTourPlace, request.getImageUrls(), request.getImageAltTexts());
        }
        
        return savedTourPlace;
    }
    
    // Get all active tour places
    public List<TourPlace> getAllActiveTourPlaces() {
        return tourPlaceRepository.findByIsActiveTrueOrderByNameAsc();
    }
    
    // Get all tour places (including inactive)
    public List<TourPlace> getAllTourPlaces() {
        return tourPlaceRepository.findAllByOrderByNameAsc();
    }
    
    // Get tour place by ID
    public Optional<TourPlace> getTourPlaceById(Long id) {
        return tourPlaceRepository.findById(id);
    }
    
    // Get active tour place by ID
    public Optional<TourPlace> getActiveTourPlaceById(Long id) {
        return tourPlaceRepository.findByIdAndIsActiveTrue(id);
    }
    
    // Get tour places by category
    public List<TourPlace> getTourPlacesByCategory(String category) {
        return tourPlaceRepository.findByCategoryAndIsActiveTrueOrderByNameAsc(category);
    }
    
    // Get tour places by location
    public List<TourPlace> getTourPlacesByLocation(String location) {
        return tourPlaceRepository.findByLocationContainingIgnoreCaseAndIsActiveTrueOrderByNameAsc(location);
    }
    
    // Search tour places
    public List<TourPlace> searchTourPlaces(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllActiveTourPlaces();
        }
        return tourPlaceRepository.searchTourPlaces(searchTerm.trim());
    }
    
    // Update tour place
    @Transactional
    public TourPlace updateTourPlace(Long id, TourPlaceRequest request) {
        Optional<TourPlace> existingOpt = tourPlaceRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Tour place not found with ID: " + id);
        }
        
        TourPlace existing = existingOpt.get();
        
        // Check if name is being changed and if it already exists
        if (!existing.getName().equalsIgnoreCase(request.getName()) && 
            tourPlaceRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Tour place with name '" + request.getName() + "' already exists");
        }
        
        // Update fields
        existing.setName(request.getName().trim());
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        existing.setLocation(request.getLocation() != null ? request.getLocation().trim() : "");
        existing.setCategory(request.getCategory() != null ? request.getCategory().trim() : "");
        
        if (request.getIsActive() != null) {
            existing.setIsActive(request.getIsActive());
        }
        
        TourPlace updated = tourPlaceRepository.save(existing);
        
        // Update images if provided
        if (request.getImageUrls() != null) {
            // Remove existing images
            tourPlaceImageRepository.deleteByTourPlaceId(id);
            
            // Add new images
            if (!request.getImageUrls().isEmpty()) {
                addImagesToTourPlace(updated, request.getImageUrls(), request.getImageAltTexts());
            }
        }
        
        return updated;
    }
    
    // Delete tour place
    @Transactional
    public void deleteTourPlace(Long id) {
        if (!tourPlaceRepository.existsById(id)) {
            throw new RuntimeException("Tour place not found with ID: " + id);
        }
        
        // Delete associated images first
        tourPlaceImageRepository.deleteByTourPlaceId(id);
        
        // Delete tour place
        tourPlaceRepository.deleteById(id);
    }
    
    // Activate/Deactivate tour place
    public TourPlace toggleTourPlaceStatus(Long id) {
        Optional<TourPlace> existingOpt = tourPlaceRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Tour place not found with ID: " + id);
        }
        
        TourPlace existing = existingOpt.get();
        existing.setIsActive(!existing.getIsActive());
        
        return tourPlaceRepository.save(existing);
    }
    
    // Get distinct categories
    public List<String> getDistinctCategories() {
        return tourPlaceRepository.findDistinctCategories();
    }
    
    // Get distinct locations
    public List<String> getDistinctLocations() {
        return tourPlaceRepository.findDistinctLocations();
    }
    
    // Get tour place statistics
    public Map<String, Object> getTourPlaceStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalPlaces = tourPlaceRepository.countByIsActiveTrue();
        List<String> categories = getDistinctCategories();
        List<String> locations = getDistinctLocations();
        
        stats.put("totalActivePlaces", totalPlaces);
        stats.put("totalCategories", categories.size());
        stats.put("totalLocations", locations.size());
        stats.put("categories", categories);
        stats.put("locations", locations);
        
        // Count by category
        Map<String, Long> categoryStats = new HashMap<>();
        for (String category : categories) {
            long count = tourPlaceRepository.countByCategoryAndIsActiveTrue(category);
            categoryStats.put(category, count);
        }
        stats.put("categoryStats", categoryStats);
        
        return stats;
    }
    
    // Get images for a tour place
    public List<TourPlaceImage> getTourPlaceImages(Long tourPlaceId) {
        return tourPlaceImageRepository.findByTourPlaceIdOrderByDisplayOrderAsc(tourPlaceId);
    }
    
    // Helper method to add images to a tour place
    private void addImagesToTourPlace(TourPlace tourPlace, List<String> imageUrls, List<String> imageAltTexts) {
        List<TourPlaceImage> images = new ArrayList<>();
        
        for (int i = 0; i < imageUrls.size(); i++) {
            String imageUrl = imageUrls.get(i);
            String altText = (imageAltTexts != null && i < imageAltTexts.size()) 
                           ? imageAltTexts.get(i) 
                           : tourPlace.getName() + " - Image " + (i + 1);
            
            TourPlaceImage image = new TourPlaceImage(
                tourPlace, 
                imageUrl.trim(), 
                altText.trim(),
                i == 0, // First image is primary
                i // Display order
            );
            
            images.add(image);
        }
        
        tourPlaceImageRepository.saveAll(images);
    }
}
