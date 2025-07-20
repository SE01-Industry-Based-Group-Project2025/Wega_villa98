package com.example.wega_villa.repository;

import com.example.wega_villa.model.TourPlaceImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourPlaceImageRepository extends JpaRepository<TourPlaceImage, Long> {
    
    // Find all images for a tour place ordered by display order
    List<TourPlaceImage> findByTourPlaceIdOrderByDisplayOrderAsc(Long tourPlaceId);
    
    // Find primary image for a tour place
    Optional<TourPlaceImage> findByTourPlaceIdAndIsPrimaryTrue(Long tourPlaceId);
    
    // Delete all images for a tour place
    void deleteByTourPlaceId(Long tourPlaceId);
    
    // Count images for a tour place
    long countByTourPlaceId(Long tourPlaceId);
}
