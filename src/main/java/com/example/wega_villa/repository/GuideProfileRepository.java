package com.example.wega_villa.repository;

import com.example.wega_villa.model.GuideProfile;
import com.example.wega_villa.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuideProfileRepository extends JpaRepository<GuideProfile, Long> {
    
    // Find guide profile by guide ID
    Optional<GuideProfile> findByGuideId(Long guideId);
    
    // Check if guide profile exists for a guide
    boolean existsByGuideId(Long guideId);
    
    // Find guides by language
    @Query("SELECT gp FROM GuideProfile gp JOIN gp.languages l WHERE l = :language")
    List<GuideProfile> findByLanguage(@Param("language") Language language);
    
    // Find guides with rating above threshold
    List<GuideProfile> findByRatingsGreaterThanEqual(Double minRating);
    
    // Find guides with experience above threshold
    List<GuideProfile> findByExperienceYearsGreaterThanEqual(Integer minExperience);
    
    // Find guides ordered by rating (highest first)
    List<GuideProfile> findAllByOrderByRatingsDesc();
    
    // Find guides ordered by total tours (most experienced first)
    List<GuideProfile> findAllByOrderByTotalToursDesc();
    
    // Get top rated guides (limit results)
    @Query("SELECT gp FROM GuideProfile gp ORDER BY gp.ratings DESC, gp.totalTours DESC")
    List<GuideProfile> findTopRatedGuides();
    
    // Search guides by bio content
    @Query("SELECT gp FROM GuideProfile gp WHERE LOWER(gp.bio) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<GuideProfile> searchByBioKeyword(@Param("keyword") String keyword);
    
    // Get guide statistics
    @Query("SELECT COUNT(gp), AVG(gp.ratings), SUM(gp.totalTours) FROM GuideProfile gp")
    Object[] getGuideStatistics();
}
