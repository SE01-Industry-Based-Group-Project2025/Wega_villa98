package com.example.wega_villa.repository;

import com.example.wega_villa.model.TourPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourPlaceRepository extends JpaRepository<TourPlace, Long> {
    
    // Find all active tour places
    List<TourPlace> findByIsActiveTrueOrderByNameAsc();
    
    // Find all tour places (including inactive) ordered by name
    List<TourPlace> findAllByOrderByNameAsc();
    
    // Find by category
    List<TourPlace> findByCategoryAndIsActiveTrueOrderByNameAsc(String category);
    
    // Find by location
    List<TourPlace> findByLocationContainingIgnoreCaseAndIsActiveTrueOrderByNameAsc(String location);
    
    // Find by name (case insensitive)
    List<TourPlace> findByNameContainingIgnoreCaseAndIsActiveTrueOrderByNameAsc(String name);
    
    // Find active tour place by ID
    Optional<TourPlace> findByIdAndIsActiveTrue(Long id);
    
    // Check if tour place name already exists
    boolean existsByNameIgnoreCase(String name);
    
    // Get all distinct categories
    @Query("SELECT DISTINCT tp.category FROM TourPlace tp WHERE tp.isActive = true AND tp.category IS NOT NULL ORDER BY tp.category")
    List<String> findDistinctCategories();
    
    // Get all distinct locations
    @Query("SELECT DISTINCT tp.location FROM TourPlace tp WHERE tp.isActive = true AND tp.location IS NOT NULL ORDER BY tp.location")
    List<String> findDistinctLocations();
    
    // Count active tour places
    long countByIsActiveTrue();
    
    // Count tour places by category
    long countByCategoryAndIsActiveTrue(String category);
    
    // Search tour places by name, location, or category
    @Query("SELECT tp FROM TourPlace tp WHERE tp.isActive = true AND " +
           "(LOWER(tp.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(tp.location) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(tp.category) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY tp.name ASC")
    List<TourPlace> searchTourPlaces(@Param("searchTerm") String searchTerm);
}
