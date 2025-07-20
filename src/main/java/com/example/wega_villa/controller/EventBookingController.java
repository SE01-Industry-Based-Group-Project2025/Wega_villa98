package com.example.wega_villa.controller;

import com.example.wega_villa.dto.EventBookingRequest;
import com.example.wega_villa.model.EventBooking;
import com.example.wega_villa.model.User;
import com.example.wega_villa.service.EventBookingService;
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
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class EventBookingController {
    
    @Autowired
    private EventBookingService eventBookingService;
    
    // Create a new booking (authenticated users only) - Alternative endpoint for frontend compatibility
    @PostMapping
    public ResponseEntity<?> createBookingRoot(@Valid @RequestBody EventBookingRequest bookingRequest, 
                                             BindingResult bindingResult) {
        return createBooking(bookingRequest, bindingResult);
    }
    
    // Create a new booking (authenticated users only)
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@Valid @RequestBody EventBookingRequest bookingRequest, 
                                         BindingResult bindingResult) {
        try {
            System.out.println("=== EVENT BOOKING CREATION ATTEMPT ===");
            
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Authentication object: " + auth);
            System.out.println("Is authenticated: " + (auth != null ? auth.isAuthenticated() : "null"));
            System.out.println("Principal: " + (auth != null ? auth.getPrincipal() : "null"));
            System.out.println("Principal class: " + (auth != null && auth.getPrincipal() != null ? auth.getPrincipal().getClass().getName() : "null"));
            System.out.println("Authorities: " + (auth != null ? auth.getAuthorities() : "null"));
            
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                System.out.println("Authentication failed - returning 401");
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in to create a booking"));
            }
            
            // Handle different types of principal
            User user = null;
            Long userId = null;
            
            if (auth.getPrincipal() instanceof User) {
                user = (User) auth.getPrincipal();
                userId = user.getId();
                System.out.println("User from principal: " + user.getEmail() + " (ID: " + userId + ")");
            } else if (auth.getPrincipal() instanceof String) {
                String email = (String) auth.getPrincipal();
                System.out.println("Email from principal: " + email);
                // Find user by email
                Optional<com.example.wega_villa.model.User> userOpt = eventBookingService.getUserByEmail(email);
                if (userOpt.isEmpty()) {
                    return ResponseEntity.status(401).body(Map.of("error", "User not found"));
                }
                user = userOpt.get();
                userId = user.getId();
            } else {
                System.out.println("Unknown principal type: " + auth.getPrincipal().getClass().getName());
                return ResponseEntity.status(401).body(Map.of("error", "Invalid authentication"));
            }
            
            System.out.println("Final User ID: " + userId);
            System.out.println("Booking Request: " + bookingRequest);
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                System.out.println("Validation errors: " + errors);
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Create booking
            EventBooking savedBooking = eventBookingService.createBooking(userId, bookingRequest);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedBooking.getId());
            response.put("userId", savedBooking.getUserId());
            response.put("packageId", savedBooking.getPackageId());
            response.put("packageName", savedBooking.getPackageName());
            response.put("customerName", savedBooking.getCustomerName());
            response.put("customerEmail", savedBooking.getCustomerEmail());
            response.put("customerPhone", savedBooking.getCustomerPhone());
            response.put("eventDate", savedBooking.getEventDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            response.put("guestCount", savedBooking.getGuestCount());
            response.put("specialRequests", savedBooking.getSpecialRequests());
            response.put("bookingStatus", savedBooking.getBookingStatus().name());
            response.put("createdAt", savedBooking.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("status", "success");
            response.put("message", "Booking created successfully!");
            
            System.out.println("Booking created successfully with ID: " + savedBooking.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error creating booking: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to create booking: " + e.getMessage()));
        }
    }
    
    // Get user's bookings
    @GetMapping("/my-bookings")
    public ResponseEntity<?> getUserBookings() {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long userId = user.getId();
            
            List<EventBooking> bookings = eventBookingService.getUserBookings(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("bookings", bookings);
            response.put("totalBookings", bookings.size());
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error getting user bookings: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get bookings"));
        }
    }
    
    // Get specific booking by ID (user can only see their own)
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable Long bookingId) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long userId = user.getId();
            
            Optional<EventBooking> bookingOpt = eventBookingService.getUserBookingById(bookingId, userId);
            
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(Map.of("booking", bookingOpt.get(), "status", "success"));
            
        } catch (Exception e) {
            System.err.println("Error getting booking: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get booking"));
        }
    }
    
    // Cancel booking (user can only cancel their own pending bookings)
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long userId = user.getId();
            
            EventBooking cancelledBooking = eventBookingService.cancelBooking(bookingId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("booking", cancelledBooking);
            response.put("status", "success");
            response.put("message", "Booking cancelled successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error cancelling booking: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to cancel booking"));
        }
    }
    
    // Get user booking statistics
    @GetMapping("/my-stats")
    public ResponseEntity<?> getUserBookingStats() {
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "User must be logged in"));
            }
            
            User user = (User) auth.getPrincipal();
            Long userId = user.getId();
            
            Map<String, Object> stats = eventBookingService.getUserBookingStatistics(userId);
            stats.put("status", "success");
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            System.err.println("Error getting user booking stats: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get statistics"));
        }
    }
    
    // Check authentication status
    @GetMapping("/auth-check")
    public ResponseEntity<?> checkAuthentication() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.ok(Map.of(
                    "authenticated", false,
                    "message", "User not authenticated"
                ));
            }
            
            User user = (User) auth.getPrincipal();
            
            return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "userId", user.getId(),
                "userEmail", user.getEmail(),
                "userName", user.getName(),
                "message", "User authenticated successfully"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Authentication check failed"));
        }
    }
}
