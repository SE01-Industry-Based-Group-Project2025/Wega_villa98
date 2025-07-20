package com.example.wega_villa.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class EventBookingRequest {
    
    @NotBlank(message = "Package ID is required")
    private String packageId;
    
    @NotBlank(message = "Package name is required")
    @Size(max = 100, message = "Package name must not exceed 100 characters")
    private String packageName;
    
    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Customer name must not exceed 100 characters")
    private String customerName;
    
    @NotBlank(message = "Customer email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String customerEmail;
    
    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^[+]?[0-9\\s\\-()]{7,15}$", message = "Invalid phone number format")
    private String customerPhone;
    
    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private LocalDate eventDate;
    
    @NotBlank(message = "Guest count is required")
    @Pattern(regexp = "^(10-20|21-35|36-50|51\\+)$", message = "Invalid guest count range")
    private String guestCount;
    
    @Size(max = 1000, message = "Special requests must not exceed 1000 characters")
    private String specialRequests;
    
    // Default constructor
    public EventBookingRequest() {}
    
    // Constructor with all required fields
    public EventBookingRequest(String packageId, String packageName, String customerName,
                              String customerEmail, String customerPhone, LocalDate eventDate, 
                              String guestCount) {
        this.packageId = packageId;
        this.packageName = packageName;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.eventDate = eventDate;
        this.guestCount = guestCount;
    }
    
    // Getters and Setters
    public String getPackageId() {
        return packageId;
    }
    
    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }
    
    public String getPackageName() {
        return packageName;
    }
    
    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public String getCustomerPhone() {
        return customerPhone;
    }
    
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
    
    public LocalDate getEventDate() {
        return eventDate;
    }
    
    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }
    
    public String getGuestCount() {
        return guestCount;
    }
    
    public void setGuestCount(String guestCount) {
        this.guestCount = guestCount;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
    
    @Override
    public String toString() {
        return "EventBookingRequest{" +
                "packageId='" + packageId + '\'' +
                ", packageName='" + packageName + '\'' +
                ", customerName='" + customerName + '\'' +
                ", customerEmail='" + customerEmail + '\'' +
                ", customerPhone='" + customerPhone + '\'' +
                ", eventDate=" + eventDate +
                ", guestCount='" + guestCount + '\'' +
                ", specialRequests='" + specialRequests + '\'' +
                '}';
    }
}
