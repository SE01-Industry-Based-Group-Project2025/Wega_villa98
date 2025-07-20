package com.example.wega_villa.controller;

import com.example.wega_villa.dto.RoomTypeRequest;
import com.example.wega_villa.model.RoomType;
import com.example.wega_villa.model.User;
import com.example.wega_villa.service.RoomTypeService;
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
@RequestMapping("/api/rooms/types")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class RoomTypeController {
    
    @Autowired
    private RoomTypeService roomTypeService;
    
    // Create a new room type (MANAGER only) - POST /api/rooms/types
    @PostMapping
    public ResponseEntity<?> createRoomType(@Valid @RequestBody RoomTypeRequest roomTypeRequest,
                                           BindingResult bindingResult) {
        try {
            System.out.println("=== ROOM TYPE CREATION ATTEMPT ===");
            
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
                return ResponseEntity.status(403).body(Map.of("error", "Only managers can create room types"));
            }
            
            System.out.println("Manager: " + user.getEmail());
            System.out.println("Room Type Request: " + roomTypeRequest);
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Create room type
            RoomType createdRoomType = roomTypeService.createRoomType(roomTypeRequest);
            
            // Format response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Room type created successfully");
            response.put("roomType", formatRoomTypeResponse(createdRoomType));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            System.err.println("Room type creation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error during room type creation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Create a new room type with just name (MANAGER only) - POST /api/rooms/types/simple
    @PostMapping("/simple")
    public ResponseEntity<?> createSimpleRoomType(@RequestBody Map<String, String> request) {
        try {
            System.out.println("=== SIMPLE ROOM TYPE CREATION ATTEMPT ===");
            
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
                return ResponseEntity.status(403).body(Map.of("error", "Only managers can create room types"));
            }
            
            String name = request.get("name");
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Room type name is required"));
            }
            
            System.out.println("Manager: " + user.getEmail());
            System.out.println("Room Type Name: " + name);
            
            // Create room type with just name
            RoomTypeRequest roomTypeRequest = new RoomTypeRequest(name.trim(), "");
            RoomType createdRoomType = roomTypeService.createRoomType(roomTypeRequest);
            
            // Format response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Room type created successfully");
            response.put("roomType", formatRoomTypeResponse(createdRoomType));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            System.err.println("Room type creation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error during room type creation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Update a room type (MANAGER only) - PUT /api/rooms/types/:id
    @PutMapping("/{roomTypeId}")
    public ResponseEntity<?> updateRoomType(@PathVariable Long roomTypeId,
                                           @Valid @RequestBody RoomTypeRequest roomTypeRequest,
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
                return ResponseEntity.status(403).body(Map.of("error", "Only managers can update room types"));
            }
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Update room type
            RoomType updatedRoomType = roomTypeService.updateRoomType(roomTypeId, roomTypeRequest);
            
            // Format response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Room type updated successfully");
            response.put("roomType", formatRoomTypeResponse(updatedRoomType));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Get all room types (public access for dropdown) - GET /api/rooms/types
    @GetMapping
    public ResponseEntity<?> getAllRoomTypes() {
        try {
            List<RoomType> roomTypes = roomTypeService.getAllRoomTypes();
            
            Map<String, Object> response = new HashMap<>();
            response.put("roomTypes", roomTypes.stream().map(this::formatRoomTypeResponse).toList());
            response.put("total", roomTypes.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch room types"));
        }
    }
    
    // Get room type by ID
    @GetMapping("/{roomTypeId}")
    public ResponseEntity<?> getRoomTypeById(@PathVariable Long roomTypeId) {
        try {
            Optional<RoomType> roomTypeOpt = roomTypeService.getRoomTypeById(roomTypeId);
            
            if (!roomTypeOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(Map.of("roomType", formatRoomTypeResponse(roomTypeOpt.get())));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch room type"));
        }
    }
    
    // Delete a room type (ADMIN only) - DELETE /api/rooms/types/:id
    @DeleteMapping("/{roomTypeId}")
    public ResponseEntity<?> deleteRoomType(@PathVariable Long roomTypeId) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            // Check if user has ADMIN role (only admin can delete room types)
            User user = (User) auth.getPrincipal();
            boolean isAdmin = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Only administrators can delete room types"));
            }
            
            roomTypeService.deleteRoomType(roomTypeId);
            
            return ResponseEntity.ok(Map.of("message", "Room type deleted successfully"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }
    
    // Helper method to format room type response
    private Map<String, Object> formatRoomTypeResponse(RoomType roomType) {
        Map<String, Object> roomTypeData = new HashMap<>();
        roomTypeData.put("id", roomType.getId());
        roomTypeData.put("name", roomType.getName());
        roomTypeData.put("description", roomType.getDescription());
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        roomTypeData.put("createdAt", roomType.getCreatedAt().format(formatter));
        roomTypeData.put("updatedAt", roomType.getUpdatedAt().format(formatter));
        
        return roomTypeData;
    }
}
