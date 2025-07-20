package com.example.wega_villa.repository;

import com.example.wega_villa.model.BookingStatus;
import com.example.wega_villa.model.EventBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventBookingRepository extends JpaRepository<EventBooking, Long> {
    
    // Find bookings by user ID
    List<EventBooking> findByUserId(Long userId);
    
    // Find bookings by user ID and status
    List<EventBooking> findByUserIdAndBookingStatus(Long userId, BookingStatus status);
    
    // Find bookings by status
    List<EventBooking> findByBookingStatus(BookingStatus status);
    
    // Find bookings by event date
    List<EventBooking> findByEventDate(LocalDate eventDate);
    
    // Find bookings by event date range
    List<EventBooking> findByEventDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find bookings by package ID
    List<EventBooking> findByPackageId(String packageId);
    
    // Count bookings by status
    long countByBookingStatus(BookingStatus status);
    
    // Count bookings by user
    long countByUserId(Long userId);
    
    // Check if user has any pending bookings
    @Query("SELECT COUNT(eb) > 0 FROM EventBooking eb WHERE eb.userId = :userId AND eb.bookingStatus = 'PENDING'")
    boolean hasUserPendingBookings(@Param("userId") Long userId);
    
    // Find upcoming bookings (event date >= today)
    @Query("SELECT eb FROM EventBooking eb WHERE eb.eventDate >= :today ORDER BY eb.eventDate ASC")
    List<EventBooking> findUpcomingBookings(@Param("today") LocalDate today);
    
    // Find past bookings (event date < today)
    @Query("SELECT eb FROM EventBooking eb WHERE eb.eventDate < :today ORDER BY eb.eventDate DESC")
    List<EventBooking> findPastBookings(@Param("today") LocalDate today);
    
    // Get booking statistics
    @Query("SELECT eb.bookingStatus, COUNT(eb) FROM EventBooking eb GROUP BY eb.bookingStatus")
    List<Object[]> getBookingStatistics();
    
    // Find bookings by month and year
    @Query("SELECT eb FROM EventBooking eb WHERE YEAR(eb.eventDate) = :year AND MONTH(eb.eventDate) = :month")
    List<EventBooking> findBookingsByMonthAndYear(@Param("year") int year, @Param("month") int month);
    
    // Find user bookings ordered by creation date
    @Query("SELECT eb FROM EventBooking eb WHERE eb.userId = :userId ORDER BY eb.createdAt DESC")
    List<EventBooking> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}
