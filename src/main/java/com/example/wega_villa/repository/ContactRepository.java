package com.example.wega_villa.repository;

import com.example.wega_villa.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    // Find contacts by email
    List<Contact> findByEmail(String email);
    
    // Find contacts by first name
    List<Contact> findByFirstName(String firstName);
    
    // Find contacts by last name
    List<Contact> findByLastName(String lastName);
    
    // Find contacts created between two dates
    List<Contact> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // Find contacts by partial email match
    List<Contact> findByEmailContainingIgnoreCase(String email);
    
    // Find contacts by partial name match (first or last name)
    @Query("SELECT c FROM Contact c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Contact> findByNameContainingIgnoreCase(String name);
    
    // Find all contacts ordered by creation date (newest first)
    List<Contact> findAllByOrderByCreatedAtDesc();
}
