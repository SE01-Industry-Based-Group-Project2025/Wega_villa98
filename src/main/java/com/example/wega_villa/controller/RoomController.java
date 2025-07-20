package com.example.wega_villa.controller;

import com.example.wega_villa.dto.RoomRequest;
import com.example.wega_villa.model.Room;
import com.example.wega_villa.model.User;
import com.example.wega_villa.service.RoomService;
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
@RequestMapping("/api/rooms")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class RoomController {
    
    @Autowired
    private RoomService roomService;
    
    // Create a new room (MANAGER only) - POST /api/rooms
    @PostMapping
    public ResponseEntity<?> createRoom(@Valid @RequestBody RoomRequest roomRequest,
                                       BindingResult bindingResult) {
        try {
            System.out.println("=== ROOM CREATION ATTEMPT ===");
            
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has MANAGER role
            User user = (User) auth.getPrincipal();
            boolean isManager = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER") || 
                                         authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isManager) {
                return ResponseEntity.status(403).body(Map.of("error", "Only managers can create rooms"));
            }
            
            System.out.println("Manager: " + user.getEmail());
            System.out.println("Room Request: " + roomRequest);
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Create room
            Room createdRoom = roomService.createRoom(roomRequest);
            
            // Format response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Room created successfully");
            response.put("room", formatRoomResponse(createdRoom));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            System.err.println("Room creation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error during room creation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Update a room (MANAGER only) - PUT /api/rooms/:id
    @PutMapping("/{roomId}")
    public ResponseEntity<?> updateRoom(@PathVariable Long roomId,
                                       @Valid @RequestBody RoomRequest roomRequest,
                                       BindingResult bindingResult) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has MANAGER role
            User user = (User) auth.getPrincipal();
            boolean isManager = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER") || 
                                         authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isManager) {
                return ResponseEntity.status(403).body(Map.of("error", "Only managers can update rooms"));
            }
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Update room
            Room updatedRoom = roomService.updateRoom(roomId, roomRequest);
            
            // Format response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Room updated successfully");
            response.put("room", formatRoomResponse(updatedRoom));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Get all rooms (public access for viewing) - GET /api/rooms
    @GetMapping
    public ResponseEntity<?> getAllRooms() {
        try {
            List<Room> rooms = roomService.getAllRooms();
            
            Map<String, Object> response = new HashMap<>();
            response.put("rooms", rooms.stream().map(this::formatRoomResponse).toList());
            response.put("total", rooms.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch rooms"));
        }
    }
    
    // Get room by ID
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoomById(@PathVariable Long roomId) {
        try {
            Optional<Room> roomOpt = roomService.getRoomById(roomId);
            
            if (!roomOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(Map.of("room", formatRoomResponse(roomOpt.get())));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch room"));
        }
    }
    
    // Get available rooms
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableRooms() {
        try {
            List<Room> rooms = roomService.getAvailableRooms();
            
            Map<String, Object> response = new HashMap<>();
            response.put("rooms", rooms.stream().map(this::formatRoomResponse).toList());
            response.put("total", rooms.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch available rooms"));
        }
    }
    
    // Get rooms by room type ID
    @GetMapping("/type/{roomTypeId}")
    public ResponseEntity<?> getRoomsByType(@PathVariable Long roomTypeId) {
        try {
            List<Room> rooms = roomService.getRoomsByRoomType(roomTypeId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("rooms", rooms.stream().map(this::formatRoomResponse).toList());
            response.put("total", rooms.size());
            response.put("roomTypeId", roomTypeId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch rooms by type"));
        }
    }
    
    // Get available rooms by room type ID
    @GetMapping("/available/type/{roomTypeId}")
    public ResponseEntity<?> getAvailableRoomsByType(@PathVariable Long roomTypeId) {
        try {
            List<Room> rooms = roomService.getAvailableRoomsByType(roomTypeId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("rooms", rooms.stream().map(this::formatRoomResponse).toList());
            response.put("total", rooms.size());
            response.put("roomTypeId", roomTypeId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch available rooms by type"));
        }
    }
    
    // Update room availability (MANAGER only) - PATCH /api/rooms/:id/availability
    @PatchMapping("/{roomId}/availability")
    public ResponseEntity<?> updateRoomAvailability(@PathVariable Long roomId,
                                                    @RequestBody Map<String, Boolean> request) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has MANAGER role
            User user = (User) auth.getPrincipal();
            boolean isManager = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER") || 
                                         authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isManager) {
                return ResponseEntity.status(403).body(Map.of("error", "Only managers can update room availability"));
            }
            
            Boolean available = request.get("available");
            if (available == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Available status is required"));
            }
            
            Room updatedRoom = roomService.updateRoomAvailability(roomId, available);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Room availability updated successfully");
            response.put("room", formatRoomResponse(updatedRoom));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Delete a room (ADMIN only) - DELETE /api/rooms/:id
    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has ADMIN role (only admin can delete rooms)
            User user = (User) auth.getPrincipal();
            boolean isAdmin = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Only administrators can delete rooms"));
            }
            
            roomService.deleteRoom(roomId);
            
            return ResponseEntity.ok(Map.of("message", "Room deleted successfully"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Get room statistics (MANAGER only)
    @GetMapping("/statistics")
    public ResponseEntity<?> getRoomStatistics() {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has MANAGER role
            User user = (User) auth.getPrincipal();
            boolean isManager = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_MANAGER") || 
                                         authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isManager) {
                return ResponseEntity.status(403).body(Map.of("error", "Only managers can view room statistics"));
            }
            
            Map<String, Object> statistics = roomService.getRoomStatistics();
            
            return ResponseEntity.ok(Map.of("statistics", statistics));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch room statistics"));
        }
    }
    
    // Helper method to format room response
    private Map<String, Object> formatRoomResponse(Room room) {
        Map<String, Object> roomData = new HashMap<>();
        roomData.put("id", room.getId());
        roomData.put("type", room.getRoomType() != null ? room.getRoomType().getName() : null);
        roomData.put("roomTypeId", room.getRoomType() != null ? room.getRoomType().getId() : null);
        roomData.put("room_no", room.getRoomNo());
        roomData.put("available", room.getAvailable());
        
        // Also include full roomType object for detailed info
        if (room.getRoomType() != null) {
            roomData.put("roomType", Map.of(
                "id", room.getRoomType().getId(),
                "name", room.getRoomType().getName(),
                "description", room.getRoomType().getDescription() != null ? room.getRoomType().getDescription() : ""
            ));
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        roomData.put("createdAt", room.getCreatedAt().format(formatter));
        roomData.put("updatedAt", room.getUpdatedAt().format(formatter));
        
        return roomData;
    }
}
