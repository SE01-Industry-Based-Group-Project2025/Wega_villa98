package com.example.wega_villa.service;

import com.example.wega_villa.dto.EventBookingRequest;
import com.example.wega_villa.model.BookingStatus;
import com.example.wega_villa.model.EventBooking;
import com.example.wega_villa.model.User;
import com.example.wega_villa.repository.EventBookingRepository;
import com.example.wega_villa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class EventBookingService {
    
    @Autowired
    private EventBookingRepository eventBookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get user by email (helper method)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Create a new event booking
    public EventBooking createBooking(Long userId, EventBookingRequest bookingRequest) {
        // Verify user exists
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        // Create new booking
        EventBooking booking = new EventBooking(
            userId,
            bookingRequest.getPackageId(),
            bookingRequest.getPackageName(),
            bookingRequest.getCustomerName(),
            bookingRequest.getCustomerEmail(),
            bookingRequest.getCustomerPhone(),
            bookingRequest.getEventDate(),
            bookingRequest.getGuestCount(),
            bookingRequest.getSpecialRequests()
        );
        
        // Save booking
        EventBooking savedBooking = eventBookingRepository.save(booking);
        
        System.out.println("Event booking created successfully: " + savedBooking);
        return savedBooking;
    }
    
    // Get all bookings for a user
    public List<EventBooking> getUserBookings(Long userId) {
        return eventBookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    // Get all bookings (admin only)
    public List<EventBooking> getAllBookings() {
        return eventBookingRepository.findAll();
    }
    
    // Get booking by ID
    public Optional<EventBooking> getBookingById(Long bookingId) {
        return eventBookingRepository.findById(bookingId);
    }
    
    // Get user's booking by ID (only if user owns the booking)
    public Optional<EventBooking> getUserBookingById(Long bookingId, Long userId) {
        Optional<EventBooking> bookingOpt = eventBookingRepository.findById(bookingId);
        if (bookingOpt.isPresent() && bookingOpt.get().getUserId().equals(userId)) {
            return bookingOpt;
        }
        return Optional.empty();
    }
    
    // Update booking status (admin only)
    public EventBooking updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        Optional<EventBooking> bookingOpt = eventBookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found with ID: " + bookingId);
        }
        
        EventBooking booking = bookingOpt.get();
        booking.setBookingStatus(newStatus);
        booking.setUpdatedAt(LocalDateTime.now());
        
        EventBooking updatedBooking = eventBookingRepository.save(booking);
        System.out.println("Booking status updated: " + updatedBooking);
        
        return updatedBooking;
    }
    
    // Cancel booking (user can only cancel their own pending bookings)
    public EventBooking cancelBooking(Long bookingId, Long userId) {
        Optional<EventBooking> bookingOpt = eventBookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found with ID: " + bookingId);
        }
        
        EventBooking booking = bookingOpt.get();
        
        // Verify user owns this booking
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only cancel your own bookings");
        }
        
        // Check if booking can be cancelled
        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Can only cancel pending bookings");
        }
        
        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        
        EventBooking cancelledBooking = eventBookingRepository.save(booking);
        System.out.println("Booking cancelled: " + cancelledBooking);
        
        return cancelledBooking;
    }
    
    // Get bookings by status
    public List<EventBooking> getBookingsByStatus(BookingStatus status) {
        return eventBookingRepository.findByBookingStatus(status);
    }
    
    // Get upcoming bookings
    public List<EventBooking> getUpcomingBookings() {
        return eventBookingRepository.findUpcomingBookings(LocalDate.now());
    }
    
    // Get past bookings
    public List<EventBooking> getPastBookings() {
        return eventBookingRepository.findPastBookings(LocalDate.now());
    }
    
    // Get booking statistics
    public Map<String, Object> getBookingStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalBookings", eventBookingRepository.count());
        stats.put("pendingBookings", eventBookingRepository.countByBookingStatus(BookingStatus.PENDING));
        stats.put("confirmedBookings", eventBookingRepository.countByBookingStatus(BookingStatus.CONFIRMED));
        stats.put("cancelledBookings", eventBookingRepository.countByBookingStatus(BookingStatus.CANCELLED));
        stats.put("completedBookings", eventBookingRepository.countByBookingStatus(BookingStatus.COMPLETED));
        
        // Get detailed statistics
        List<Object[]> detailedStats = eventBookingRepository.getBookingStatistics();
        Map<String, Long> statusCounts = new HashMap<>();
        for (Object[] stat : detailedStats) {
            BookingStatus status = (BookingStatus) stat[0];
            Long count = (Long) stat[1];
            statusCounts.put(status.name().toLowerCase(), count);
        }
        stats.put("statusBreakdown", statusCounts);
        
        return stats;
    }
    
    // Check if user has pending bookings
    public boolean hasUserPendingBookings(Long userId) {
        return eventBookingRepository.hasUserPendingBookings(userId);
    }
    
    // Get user booking statistics
    public Map<String, Object> getUserBookingStatistics(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalBookings", eventBookingRepository.countByUserId(userId));
        stats.put("pendingBookings", eventBookingRepository.findByUserIdAndBookingStatus(userId, BookingStatus.PENDING).size());
        stats.put("confirmedBookings", eventBookingRepository.findByUserIdAndBookingStatus(userId, BookingStatus.CONFIRMED).size());
        stats.put("cancelledBookings", eventBookingRepository.findByUserIdAndBookingStatus(userId, BookingStatus.CANCELLED).size());
        stats.put("completedBookings", eventBookingRepository.findByUserIdAndBookingStatus(userId, BookingStatus.COMPLETED).size());
        
        return stats;
    }
}
