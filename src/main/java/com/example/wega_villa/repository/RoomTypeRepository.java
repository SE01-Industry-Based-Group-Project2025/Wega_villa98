package com.example.wega_villa.repository;

import com.example.wega_villa.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    
    // Find room type by name
    Optional<RoomType> findByName(String name);
    
    // Check if room type name already exists
    boolean existsByName(String name);
    
    // Find room type by name (case insensitive)
    Optional<RoomType> findByNameIgnoreCase(String name);
    
    // Check if room type name already exists (case insensitive)
    boolean existsByNameIgnoreCase(String name);
}
