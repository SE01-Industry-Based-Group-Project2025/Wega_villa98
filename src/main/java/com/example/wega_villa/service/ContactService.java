package com.example.wega_villa.service;

import com.example.wega_villa.model.Contact;
import com.example.wega_villa.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private EmailService emailService;
    
    // Save a new contact
    public Contact saveContact(Contact contact) {
        try {
            System.out.println("Saving contact: " + contact.toString());
            Contact savedContact = contactRepository.save(contact);
            System.out.println("Contact saved successfully with ID: " + savedContact.getId());
            
            // Send email notifications
            try {
                System.out.println("Sending email notifications for contact ID: " + savedContact.getId());
                
                // Send notification to admins and managers
                emailService.sendContactNotification(savedContact);
                
                // Send confirmation to the contact submitter
                emailService.sendContactConfirmation(savedContact);
                
                System.out.println("Email notifications sent successfully");
            } catch (Exception emailError) {
                System.out.println("Warning: Failed to send email notifications: " + emailError.getMessage());
                // Don't fail the contact save if email fails
            }
            
            return savedContact;
        } catch (Exception e) {
            System.out.println("Error saving contact: " + e.getMessage());
            throw new RuntimeException("Failed to save contact: " + e.getMessage());
        }
    }
    
    // Get all contacts
    public List<Contact> getAllContacts() {
        try {
            List<Contact> contacts = contactRepository.findAllByOrderByCreatedAtDesc();
            System.out.println("Retrieved " + contacts.size() + " contacts");
            return contacts;
        } catch (Exception e) {
            System.out.println("Error retrieving contacts: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve contacts: " + e.getMessage());
        }
    }
    
    // Get contact by ID
    public Optional<Contact> getContactById(Long id) {
        try {
            Optional<Contact> contact = contactRepository.findById(id);
            if (contact.isPresent()) {
                System.out.println("Found contact with ID: " + id);
            } else {
                System.out.println("No contact found with ID: " + id);
            }
            return contact;
        } catch (Exception e) {
            System.out.println("Error retrieving contact by ID: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve contact: " + e.getMessage());
        }
    }
    
    // Get contacts by email
    public List<Contact> getContactsByEmail(String email) {
        try {
            List<Contact> contacts = contactRepository.findByEmail(email);
            System.out.println("Found " + contacts.size() + " contacts with email: " + email);
            return contacts;
        } catch (Exception e) {
            System.out.println("Error retrieving contacts by email: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve contacts by email: " + e.getMessage());
        }
    }
    
    // Search contacts by name
    public List<Contact> searchContactsByName(String name) {
        try {
            List<Contact> contacts = contactRepository.findByNameContainingIgnoreCase(name);
            System.out.println("Found " + contacts.size() + " contacts matching name: " + name);
            return contacts;
        } catch (Exception e) {
            System.out.println("Error searching contacts by name: " + e.getMessage());
            throw new RuntimeException("Failed to search contacts: " + e.getMessage());
        }
    }
    
    // Get contacts within date range
    public List<Contact> getContactsByDateRange(LocalDateTime start, LocalDateTime end) {
        try {
            List<Contact> contacts = contactRepository.findByCreatedAtBetween(start, end);
            System.out.println("Found " + contacts.size() + " contacts between " + start + " and " + end);
            return contacts;
        } catch (Exception e) {
            System.out.println("Error retrieving contacts by date range: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve contacts by date range: " + e.getMessage());
        }
    }
    
    // Delete contact by ID
    public boolean deleteContact(Long id) {
        try {
            if (contactRepository.existsById(id)) {
                contactRepository.deleteById(id);
                System.out.println("Contact deleted successfully with ID: " + id);
                return true;
            } else {
                System.out.println("No contact found with ID: " + id);
                return false;
            }
        } catch (Exception e) {
            System.out.println("Error deleting contact: " + e.getMessage());
            throw new RuntimeException("Failed to delete contact: " + e.getMessage());
        }
    }
    
    // Update contact
    public Contact updateContact(Long id, Contact updatedContact) {
        try {
            Optional<Contact> existingContactOpt = contactRepository.findById(id);
            if (existingContactOpt.isPresent()) {
                Contact existingContact = existingContactOpt.get();
                
                // Update fields
                existingContact.setFirstName(updatedContact.getFirstName());
                existingContact.setLastName(updatedContact.getLastName());
                existingContact.setEmail(updatedContact.getEmail());
                existingContact.setMessage(updatedContact.getMessage());
                
                Contact savedContact = contactRepository.save(existingContact);
                System.out.println("Contact updated successfully with ID: " + id);
                return savedContact;
            } else {
                System.out.println("No contact found with ID: " + id);
                throw new RuntimeException("Contact not found with ID: " + id);
            }
        } catch (Exception e) {
            System.out.println("Error updating contact: " + e.getMessage());
            throw new RuntimeException("Failed to update contact: " + e.getMessage());
        }
    }
}
