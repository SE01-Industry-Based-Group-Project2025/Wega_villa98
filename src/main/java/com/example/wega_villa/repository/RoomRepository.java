package com.example.wega_villa.repository;

import com.example.wega_villa.model.Room;
import com.example.wega_villa.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    // Find room by room number
    Optional<Room> findByRoomNo(String roomNo);
    
    // Check if room number already exists
    boolean existsByRoomNo(String roomNo);
    
    // Find all rooms by room type
    List<Room> findByRoomType(RoomType roomType);
    
    // Find all rooms by room type ID
    List<Room> findByRoomTypeId(Long roomTypeId);
    
    // Find all available rooms
    List<Room> findByAvailable(Boolean available);
    
    // Find available rooms by room type
    List<Room> findByRoomTypeAndAvailable(RoomType roomType, Boolean available);
    
    // Find available rooms by room type ID
    List<Room> findByRoomTypeIdAndAvailable(Long roomTypeId, Boolean available);
    
    // Count total rooms
    @Query("SELECT COUNT(r) FROM Room r")
    Long countTotalRooms();
    
    // Count available rooms
    @Query("SELECT COUNT(r) FROM Room r WHERE r.available = true")
    Long countAvailableRooms();
    
    // Count rooms by room type
    @Query("SELECT COUNT(r) FROM Room r WHERE r.roomType.id = :roomTypeId")
    Long countRoomsByRoomType(@Param("roomTypeId") Long roomTypeId);
    
    // Get room statistics
    @Query("SELECT rt.name, COUNT(r) as total, " +
           "SUM(CASE WHEN r.available = true THEN 1 ELSE 0 END) as available " +
           "FROM Room r JOIN r.roomType rt GROUP BY rt.id, rt.name")
    List<Object[]> getRoomStatistics();
}
