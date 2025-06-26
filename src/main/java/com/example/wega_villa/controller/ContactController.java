package com.example.wega_villa.controller;

import com.example.wega_villa.dto.ContactRequest;
import com.example.wega_villa.model.Contact;
import com.example.wega_villa.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"})
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    // Submit a new contact form
    @PostMapping("/submit")
    public ResponseEntity<?> submitContact(@Valid @RequestBody ContactRequest contactRequest, BindingResult bindingResult) {
        try {
            System.out.println("=== CONTACT FORM SUBMISSION ===");
            System.out.println("Received contact data: " + contactRequest);
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                System.out.println("Validation errors: " + errors);
                return ResponseEntity.badRequest().body(Map.of("errors", errors));
            }
            
            // Create and save contact
            Contact contact = new Contact(
                contactRequest.getFirstName().trim(), 
                contactRequest.getLastName().trim(), 
                contactRequest.getEmail().trim(), 
                contactRequest.getMessage().trim()
            );
            Contact savedContact = contactService.saveContact(contact);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedContact.getId());
            response.put("firstName", savedContact.getFirstName());
            response.put("lastName", savedContact.getLastName());
            response.put("email", savedContact.getEmail());
            response.put("message", savedContact.getMessage());
            response.put("submittedAt", savedContact.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("status", "success");
            response.put("message_response", "Thank you for contacting us! We will get back to you soon.");
            
            System.out.println("Contact saved successfully with ID: " + savedContact.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Exception occurred while submitting contact: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to submit contact form: " + e.getMessage()));
        }
    }
    
    // Get all contacts (Admin functionality)
    @GetMapping("/all")
    public ResponseEntity<?> getAllContacts() {
        try {
            System.out.println("=== GET ALL CONTACTS REQUEST ===");
            List<Contact> contacts = contactService.getAllContacts();
            
            List<Map<String, Object>> contactList = contacts.stream()
                .map(contact -> {
                    Map<String, Object> contactMap = new HashMap<>();
                    contactMap.put("id", contact.getId());
                    contactMap.put("firstName", contact.getFirstName());
                    contactMap.put("lastName", contact.getLastName());
                    contactMap.put("fullName", contact.getFirstName() + " " + contact.getLastName());
                    contactMap.put("email", contact.getEmail());
                    contactMap.put("message", contact.getMessage());
                    contactMap.put("submittedAt", contact.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    contactMap.put("submittedDate", contact.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                    
                    return contactMap;
                })
                .toList();
            
            System.out.println("Returning " + contactList.size() + " contacts");
            return ResponseEntity.ok(contactList);
            
        } catch (Exception e) {
            System.out.println("Exception occurred while fetching contacts: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch contacts: " + e.getMessage()));
        }
    }
    
    // Get contact by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getContactById(@PathVariable Long id) {
        try {
            System.out.println("=== GET CONTACT BY ID REQUEST ===");
            System.out.println("Contact ID: " + id);
            
            Optional<Contact> contactOpt = contactService.getContactById(id);
            if (contactOpt.isEmpty()) {
                System.out.println("Contact not found with ID: " + id);
                return ResponseEntity.badRequest().body(Map.of("error", "Contact not found"));
            }
            
            Contact contact = contactOpt.get();
            Map<String, Object> contactData = new HashMap<>();
            contactData.put("id", contact.getId());
            contactData.put("firstName", contact.getFirstName());
            contactData.put("lastName", contact.getLastName());
            contactData.put("fullName", contact.getFirstName() + " " + contact.getLastName());
            contactData.put("email", contact.getEmail());
            contactData.put("message", contact.getMessage());
            contactData.put("submittedAt", contact.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            
            System.out.println("Found contact: " + contact.getFirstName() + " " + contact.getLastName());
            return ResponseEntity.ok(contactData);
            
        } catch (Exception e) {
            System.out.println("Exception occurred while fetching contact: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch contact: " + e.getMessage()));
        }
    }
    
    // Search contacts by name or email
    @GetMapping("/search")
    public ResponseEntity<?> searchContacts(@RequestParam(required = false) String name, 
                                          @RequestParam(required = false) String email) {
        try {
            System.out.println("=== SEARCH CONTACTS REQUEST ===");
            System.out.println("Search params - Name: " + name + ", Email: " + email);
            
            List<Contact> contacts = new ArrayList<>();
            
            if (name != null && !name.trim().isEmpty()) {
                contacts = contactService.searchContactsByName(name.trim());
            } else if (email != null && !email.trim().isEmpty()) {
                contacts = contactService.getContactsByEmail(email.trim());
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Please provide name or email parameter"));
            }
            
            List<Map<String, Object>> contactList = contacts.stream()
                .map(contact -> {
                    Map<String, Object> contactMap = new HashMap<>();
                    contactMap.put("id", contact.getId());
                    contactMap.put("firstName", contact.getFirstName());
                    contactMap.put("lastName", contact.getLastName());
                    contactMap.put("fullName", contact.getFirstName() + " " + contact.getLastName());
                    contactMap.put("email", contact.getEmail());
                    contactMap.put("message", contact.getMessage());
                    contactMap.put("submittedAt", contact.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    
                    return contactMap;
                })
                .toList();
            
            System.out.println("Found " + contactList.size() + " matching contacts");
            return ResponseEntity.ok(contactList);
            
        } catch (Exception e) {
            System.out.println("Exception occurred while searching contacts: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to search contacts: " + e.getMessage()));
        }
    }
    
    // Delete contact (Admin functionality)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {
        try {
            System.out.println("=== DELETE CONTACT REQUEST ===");
            System.out.println("Contact ID to delete: " + id);
            
            boolean deleted = contactService.deleteContact(id);
            if (deleted) {
                System.out.println("Contact deleted successfully");
                return ResponseEntity.ok(Map.of("message", "Contact deleted successfully"));
            } else {
                System.out.println("Contact not found for deletion");
                return ResponseEntity.badRequest().body(Map.of("error", "Contact not found"));
            }
            
        } catch (Exception e) {
            System.out.println("Exception occurred while deleting contact: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete contact: " + e.getMessage()));
        }
    }
    
    // Update contact (Admin functionality)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateContact(@PathVariable Long id, @RequestBody Map<String, String> contactData) {
        try {
            System.out.println("=== UPDATE CONTACT REQUEST ===");
            System.out.println("Contact ID: " + id);
            System.out.println("Update data: " + contactData);
            
            String firstName = contactData.get("firstName");
            String lastName = contactData.get("lastName");
            String email = contactData.get("email");
            String message = contactData.get("message");
            
            // Validation
            if (firstName == null || firstName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "First name is required"));
            }
            if (lastName == null || lastName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Last name is required"));
            }
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
            }
            
            Contact updatedContact = new Contact(firstName.trim(), lastName.trim(), email.trim(), message.trim());
            Contact savedContact = contactService.updateContact(id, updatedContact);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedContact.getId());
            response.put("firstName", savedContact.getFirstName());
            response.put("lastName", savedContact.getLastName());
            response.put("email", savedContact.getEmail());
            response.put("message", savedContact.getMessage());
            response.put("updatedAt", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("message_response", "Contact updated successfully");
            
            System.out.println("Contact updated successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Exception occurred while updating contact: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update contact: " + e.getMessage()));
        }
    }
}
