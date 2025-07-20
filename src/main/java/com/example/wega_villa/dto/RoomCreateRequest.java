package com.example.wega_villa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RoomCreateRequest {
    
    @NotNull(message = "Room type ID is required")
    private Long roomTypeId;
    
    @NotBlank(message = "Room number is required")
    @Size(max = 10, message = "Room number must not exceed 10 characters")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Room number can only contain letters, numbers, and hyphens")
    private String room_no;
    
    @NotNull(message = "Available status is required")
    private Boolean available;
    
    // Default constructor
    public RoomCreateRequest() {}
    
    // Constructor with all fields
    public RoomCreateRequest(Long roomTypeId, String room_no, Boolean available) {
        this.roomTypeId = roomTypeId;
        this.room_no = room_no;
        this.available = available;
    }
    
    // Getters and Setters
    public Long getRoomTypeId() {
        return roomTypeId;
    }
    
    public void setRoomTypeId(Long roomTypeId) {
        this.roomTypeId = roomTypeId;
    }
    
    public String getRoom_no() {
        return room_no;
    }
    
    public void setRoom_no(String room_no) {
        this.room_no = room_no;
    }
    
    public Boolean getAvailable() {
        return available;
    }
    
    public void setAvailable(Boolean available) {
        this.available = available;
    }
    
    @Override
    public String toString() {
        return "RoomCreateRequest{" +
                "roomTypeId=" + roomTypeId +
                ", room_no='" + room_no + '\'' +
                ", available=" + available +
                '}';
    }
}
