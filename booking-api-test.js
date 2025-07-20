// Test script for Event Booking API
// This can be used in Postman or as a reference for frontend integration

// Step 1: Login to get JWT token
const loginRequest = {
  url: 'http://localhost:8080/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'your-email@example.com',
    password: 'your-password'
  })
};

// Step 2: Create booking with JWT token
const createBookingRequest = {
  url: 'http://localhost:8080/api/bookings/create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN_FROM_LOGIN'
  },
  body: JSON.stringify({
    packageId: 'PACKAGE_001',
    packageName: 'Premium Wedding Package',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1-555-0123',
    eventDate: '2024-06-15',
    guestCount: '21-35',
    specialRequests: 'Need vegetarian options and special lighting',
    totalPrice: 25000.00
  })
};

// Step 3: Get user's bookings
const getUserBookingsRequest = {
  url: 'http://localhost:8080/api/bookings/my-bookings',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN_FROM_LOGIN'
  }
};

// Example using fetch in JavaScript (for frontend)
async function testBookingAPI() {
  try {
    // Login first
    const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token; // Adjust based on your login response structure
    
    // Create booking
    const bookingResponse = await fetch('http://localhost:8080/api/bookings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        packageId: 'PACKAGE_001',
        packageName: 'Premium Wedding Package',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '+1-555-0123',
        eventDate: '2024-06-15',
        guestCount: '21-35',
        specialRequests: 'Need vegetarian options and special lighting',
        totalPrice: 25000.00
      })
    });
    
    if (!bookingResponse.ok) {
      const error = await bookingResponse.json();
      console.error('Booking failed:', error);
      return;
    }
    
    const booking = await bookingResponse.json();
    console.log('Booking created successfully:', booking);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Example validation errors you might receive
const validationErrorExample = {
  "errors": {
    "customerName": "Customer name is required",
    "customerEmail": "Email should be valid",
    "eventDate": "Event date must be in the future",
    "guestCount": "Invalid guest count range",
    "totalPrice": "Total price must be greater than 0"
  }
};

// Example successful response
const successResponseExample = {
  "id": 1,
  "userId": 123,
  "packageId": "PACKAGE_001",
  "packageName": "Premium Wedding Package",
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com",
  "customerPhone": "+1-555-0123",
  "eventDate": "2024-06-15",
  "guestCount": "21-35",
  "specialRequests": "Need vegetarian options and special lighting",
  "bookingStatus": "PENDING",
  "totalPrice": 25000.00,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
};
