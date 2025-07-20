package com.example.wega_villa.service;

import com.example.wega_villa.dto.RoomCreateRequest;
import com.example.wega_villa.dto.RoomRequest;
import com.example.wega_villa.model.Room;
import com.example.wega_villa.model.RoomType;
import com.example.wega_villa.repository.RoomRepository;
import com.example.wega_villa.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RoomService {
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private RoomTypeRepository roomTypeRepository;
    
    // Create a new room
    public Room createRoom(RoomRequest roomRequest) {
        // Check if room number already exists
        if (roomRepository.existsByRoomNo(roomRequest.getRoom_no())) {
            throw new RuntimeException("Room number '" + roomRequest.getRoom_no() + "' already exists");
        }
        
        // Get room type by ID (no more dynamic creation, use existing room types)
        RoomType roomType;
        if (roomRequest.getRoomTypeId() != null) {
            // Use provided room type ID
            Optional<RoomType> roomTypeOpt = roomTypeRepository.findById(roomRequest.getRoomTypeId());
            if (!roomTypeOpt.isPresent()) {
                throw new RuntimeException("Room type not found with ID: " + roomRequest.getRoomTypeId());
            }
            roomType = roomTypeOpt.get();
        } else {
            throw new RuntimeException("Room type ID is required");
        }
        
        Room room = new Room(
            roomType,
            roomRequest.getRoom_no(),
            roomRequest.getAvailable()
        );
        
        return roomRepository.save(room);
    }
    
    // Update an existing room
    public Room updateRoom(Long roomId, RoomRequest roomRequest) {
        Optional<Room> existingRoomOpt = roomRepository.findById(roomId);
        if (!existingRoomOpt.isPresent()) {
            throw new RuntimeException("Room not found with ID: " + roomId);
        }
        
        Room existingRoom = existingRoomOpt.get();
        
        // Check if room number is being changed and if it already exists
        if (!existingRoom.getRoomNo().equals(roomRequest.getRoom_no()) && 
            roomRepository.existsByRoomNo(roomRequest.getRoom_no())) {
            throw new RuntimeException("Room number '" + roomRequest.getRoom_no() + "' already exists");
        }
        
        // Get room type by ID (same logic as createRoom)
        RoomType roomType;
        if (roomRequest.getRoomTypeId() != null) {
            Optional<RoomType> roomTypeOpt = roomTypeRepository.findById(roomRequest.getRoomTypeId());
            if (!roomTypeOpt.isPresent()) {
                throw new RuntimeException("Room type not found with ID: " + roomRequest.getRoomTypeId());
            }
            roomType = roomTypeOpt.get();
        } else {
            throw new RuntimeException("Room type ID is required");
        }
        
        existingRoom.setRoomType(roomType);
        existingRoom.setRoomNo(roomRequest.getRoom_no());
        existingRoom.setAvailable(roomRequest.getAvailable());
        
        return roomRepository.save(existingRoom);
    }
    
    // Create a new room with RoomCreateRequest (uses roomTypeId only)
    public Room createRoomWithType(RoomCreateRequest roomCreateRequest) {
        // Check if room number already exists
        if (roomRepository.existsByRoomNo(roomCreateRequest.getRoom_no())) {
            throw new RuntimeException("Room number '" + roomCreateRequest.getRoom_no() + "' already exists");
        }
        
        // Get room type by ID
        RoomType roomType;
        if (roomCreateRequest.getRoomTypeId() != null) {
            Optional<RoomType> roomTypeOpt = roomTypeRepository.findById(roomCreateRequest.getRoomTypeId());
            if (!roomTypeOpt.isPresent()) {
                throw new RuntimeException("Room type not found with ID: " + roomCreateRequest.getRoomTypeId());
            }
            roomType = roomTypeOpt.get();
        } else {
            throw new RuntimeException("Room type ID is required");
        }
        
        Room room = new Room(
            roomType,
            roomCreateRequest.getRoom_no(),
            roomCreateRequest.getAvailable()
        );
        
        return roomRepository.save(room);
    }
    
    // Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    
    // Get room by ID
    public Optional<Room> getRoomById(Long roomId) {
        return roomRepository.findById(roomId);
    }
    
    // Get room by room number
    public Optional<Room> getRoomByRoomNo(String roomNo) {
        return roomRepository.findByRoomNo(roomNo);
    }
    
    // Get rooms by room type ID
    public List<Room> getRoomsByRoomType(Long roomTypeId) {
        return roomRepository.findByRoomTypeId(roomTypeId);
    }
    
    // Get available rooms
    public List<Room> getAvailableRooms() {
        return roomRepository.findByAvailable(true);
    }
    
    // Get available rooms by room type ID
    public List<Room> getAvailableRoomsByType(Long roomTypeId) {
        return roomRepository.findByRoomTypeIdAndAvailable(roomTypeId, true);
    }
    
    // Update room availability
    public Room updateRoomAvailability(Long roomId, Boolean available) {
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (!roomOpt.isPresent()) {
            throw new RuntimeException("Room not found with ID: " + roomId);
        }
        
        Room room = roomOpt.get();
        room.setAvailable(available);
        return roomRepository.save(room);
    }
    
    // Delete a room
    public void deleteRoom(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new RuntimeException("Room not found with ID: " + roomId);
        }
        roomRepository.deleteById(roomId);
    }
    
    // Get room statistics
    public Map<String, Object> getRoomStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalRooms", roomRepository.countTotalRooms());
        stats.put("availableRooms", roomRepository.countAvailableRooms());
        
        // Get statistics by room type
        List<Object[]> typeStats = roomRepository.getRoomStatistics();
        Map<String, Map<String, Long>> typeStatsMap = new HashMap<>();
        
        for (Object[] stat : typeStats) {
            String type = (String) stat[0];
            Long total = ((Number) stat[1]).longValue();
            Long available = ((Number) stat[2]).longValue();
            
            Map<String, Long> typeStat = new HashMap<>();
            typeStat.put("total", total);
            typeStat.put("available", available);
            typeStat.put("occupied", total - available);
            
            typeStatsMap.put(type, typeStat);
        }
        
        stats.put("byType", typeStatsMap);
        
        return stats;
    }
}
