package com.example.wega_villa.service;

import com.example.wega_villa.dto.RoomTypeRequest;
import com.example.wega_villa.model.RoomType;
import com.example.wega_villa.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomTypeService {
    
    @Autowired
    private RoomTypeRepository roomTypeRepository;
    
    // Create a new room type
    public RoomType createRoomType(RoomTypeRequest roomTypeRequest) {
        // Check if room type name already exists (case insensitive)
        if (roomTypeRepository.existsByNameIgnoreCase(roomTypeRequest.getName())) {
            throw new RuntimeException("Room type '" + roomTypeRequest.getName() + "' already exists");
        }
        
        RoomType roomType = new RoomType(
            roomTypeRequest.getName(),
            roomTypeRequest.getDescription()
        );
        
        return roomTypeRepository.save(roomType);
    }
    
    // Update an existing room type
    public RoomType updateRoomType(Long roomTypeId, RoomTypeRequest roomTypeRequest) {
        Optional<RoomType> existingRoomTypeOpt = roomTypeRepository.findById(roomTypeId);
        if (!existingRoomTypeOpt.isPresent()) {
            throw new RuntimeException("Room type not found with ID: " + roomTypeId);
        }
        
        RoomType existingRoomType = existingRoomTypeOpt.get();
        
        // Check if room type name is being changed and if it already exists
        if (!existingRoomType.getName().equalsIgnoreCase(roomTypeRequest.getName()) && 
            roomTypeRepository.existsByNameIgnoreCase(roomTypeRequest.getName())) {
            throw new RuntimeException("Room type '" + roomTypeRequest.getName() + "' already exists");
        }
        
        existingRoomType.setName(roomTypeRequest.getName());
        existingRoomType.setDescription(roomTypeRequest.getDescription());
        
        return roomTypeRepository.save(existingRoomType);
    }
    
    // Get all room types
    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }
    
    // Get room type by ID
    public Optional<RoomType> getRoomTypeById(Long roomTypeId) {
        return roomTypeRepository.findById(roomTypeId);
    }
    
    // Get room type by name
    public Optional<RoomType> getRoomTypeByName(String name) {
        return roomTypeRepository.findByNameIgnoreCase(name);
    }
    
    // Delete a room type (only if no rooms are using it)
    public void deleteRoomType(Long roomTypeId) {
        if (!roomTypeRepository.existsById(roomTypeId)) {
            throw new RuntimeException("Room type not found with ID: " + roomTypeId);
        }
        
        // Note: In a real application, you'd check if any rooms are using this type
        // and prevent deletion if they are, or handle the cascade deletion appropriately
        roomTypeRepository.deleteById(roomTypeId);
    }
    
    // Find or create room type by name (useful for dynamic creation)
    public RoomType findOrCreateRoomType(String name, String description) {
        Optional<RoomType> existingType = roomTypeRepository.findByNameIgnoreCase(name);
        
        if (existingType.isPresent()) {
            return existingType.get();
        }
        
        // Create new room type with proper description
        String roomTypeDescription = description != null ? description : "Auto-created room type: " + name;
        RoomType newRoomType = new RoomType(name, roomTypeDescription);
        return roomTypeRepository.save(newRoomType);
    }
}
