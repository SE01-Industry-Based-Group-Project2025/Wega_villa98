// API utility for handling HTTP requests with authentication and error handling

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Enhanced API fetch wrapper with automatic JWT injection and error handling
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Request options
 * @returns {Promise<{ok: boolean, status: number, json?: any, error?: string}>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get JWT token from localStorage
  const token = localStorage.getItem('token');
  const sessionId = localStorage.getItem('sessionId');
  
  // Debug token information
  if (token) {
    console.log('Token found - Length:', token.length);
    console.log('Token starts with:', token.substring(0, 20) + '...');
    
    // Check if token looks like a JWT (has 3 parts separated by dots)
    const tokenParts = token.split('.');
    console.log('Token parts count:', tokenParts.length);
    if (tokenParts.length === 3) {
      console.log('Token appears to be a valid JWT format');
    } else {
      console.warn('Token does not appear to be in JWT format');
    }
  } else {
    console.warn('No token found in localStorage');
  }

  // Debug session information
  if (sessionId) {
    console.log('Session ID found:', sessionId.substring(0, 8) + '...');
  }
  
  // Default headers with authentication and session management
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(sessionId && { 'X-Session-Id': sessionId })
  };

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers
  };

  // Request configuration
  const config = {
    ...options,
    headers,
    // Ensure credentials are included for CORS
    credentials: 'include'
  };

  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  console.log('Headers:', headers);
  if (config.body) {
    console.log('Body:', config.body);
  }

  try {
    const response = await fetch(url, config);
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    // Get response text first to handle empty responses
    const responseText = await response.text();
    console.log('Response Text:', responseText);

    let json = null;
    let error = null;

    // Try to parse JSON if response has content
    if (responseText) {
      try {
        json = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        error = 'Invalid JSON response from server';
        // For non-JSON responses, use the text as error message
        if (!response.ok) {
          error = responseText || `Server error: ${response.status}`;
        }
      }
    }

    // Handle error responses
    if (!response.ok) {
      const errorMessage = json?.error || json?.message || error || `HTTP ${response.status}: ${response.statusText}`;
      
      // Log specific error types
      if (response.status === 0) {
        console.error('Network Error: Server unreachable or CORS blocked');
        error = 'Server is unreachable. Please check if the backend is running and CORS is configured properly.';
      } else if (response.status === 401) {
        console.error('Authentication Error: Invalid or expired token');
        
        // Check if this is a session expiration
        if (json?.code === 'SESSION_EXPIRED') {
          console.error('Session Expired: User session has timed out');
          error = 'Your session has expired. Please log in again.';
          
          // Clear all authentication data
          localStorage.clear();
          
          // Redirect to login page
          window.location.href = '/auth';
        } else {
          error = 'Authentication failed. Please log in again.';
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('username');
          localStorage.removeItem('sessionId');
          localStorage.removeItem('sessionManaged');
        }
      } else if (response.status === 403) {
        console.error('Authorization Error: Insufficient privileges');
        error = 'You do not have permission to perform this action.';
      } else if (response.status === 404) {
        console.error('Not Found Error: Resource not found');
        error = 'The requested resource was not found.';
      } else if (response.status >= 500) {
        console.error('Server Error:', errorMessage);
        error = 'Internal server error. Please try again later.';
      } else {
        console.error(`HTTP ${response.status} Error:`, errorMessage);
        error = errorMessage;
      }

      return {
        ok: false,
        status: response.status,
        json,
        error
      };
    }

    console.log('Request successful');
    return {
      ok: true,
      status: response.status,
      json,
      error: null
    };

  } catch (fetchError) {
    console.error('Network/Fetch Error:', fetchError);
    
    let errorMessage = 'Network error occurred';
    
    // Detect specific error types
    if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
      if (fetchError.message.includes('CORS')) {
        errorMessage = 'CORS error: The server is not allowing requests from this origin. Please check CORS configuration.';
      } else if (fetchError.message.includes('network')) {
        errorMessage = 'Network error: Unable to connect to the server. Please check if the backend is running.';
      } else {
        errorMessage = 'Connection failed: Server is unreachable or not responding.';
      }
    } else if (fetchError.name === 'AbortError') {
      errorMessage = 'Request was cancelled or timed out.';
    } else {
      errorMessage = `Network error: ${fetchError.message}`;
    }

    return {
      ok: false,
      status: 0,
      json: null,
      error: errorMessage
    };
  }
};

/**
 * API helper methods for common HTTP operations
 */
export const api = {
  get: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  put: (endpoint, data, options = {}) => apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: 'DELETE' }),
  
  patch: (endpoint, data, options = {}) => apiFetch(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data)
  })
};

/**
 * Show user-friendly error message for network/API errors
 * @param {string} error - Error message
 * @param {string} action - Action that was being performed (e.g., 'create manager')
 */
export const showApiError = (error, action = 'perform this action') => {
  let userMessage = `Failed to ${action}.`;
  
  if (error.includes('CORS')) {
    userMessage += ' There is a CORS configuration issue. Please contact the administrator.';
  } else if (error.includes('unreachable') || error.includes('Network error')) {
    userMessage += ' The server appears to be offline. Please try again later.';
  } else if (error.includes('Authentication failed')) {
    userMessage += ' Please log in again.';
  } else if (error.includes('permission')) {
    userMessage += ' You do not have the required permissions.';
  } else if (error.includes('not found') || error.includes('Not Found')) {
    userMessage += ' The requested resource was not found. This might be due to an ID mismatch.';
  } else {
    userMessage += ` ${error}`;
  }
  
  // Create and show custom notification
  showCustomNotification(userMessage, 'error');
  console.error(`API Error during ${action}:`, error);
};

/**
 * Show custom notification instead of browser alert
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (error, success, warning)
 */
const showCustomNotification = (message, type = 'info') => {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.custom-notification');
  existingNotifications.forEach(notif => notif.remove());

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `custom-notification fixed top-4 right-4 z-[9999] max-w-md p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 translate-x-full`;
  
  // Set type-specific styles
  const typeStyles = {
    error: 'bg-red-50 border-red-500 text-red-800',
    success: 'bg-green-50 border-green-500 text-green-800', 
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800'
  };
  
  notification.className += ` ${typeStyles[type] || typeStyles.info}`;
  
  // Create notification content
  notification.innerHTML = `
    <div class="flex items-start">
      <div class="flex-1">
        <p class="text-sm font-medium">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
        <p class="text-sm mt-1">${message}</p>
      </div>
      <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 10);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
};

/**
 * Debug utility to log ID-related information
 * @param {string} context - Context of the operation
 * @param {any} id - The ID value to debug
 * @param {object} data - Additional data to log
 */
const debugId = (context, id, data = {}) => {
  console.group(`ID Debug: ${context}`);
  console.log('ID Value:', id);
  console.log('ID Type:', typeof id);
  console.log('ID String:', String(id));
  console.log('ID Number:', Number(id));
  console.log('Is Valid:', id !== null && id !== undefined && id !== '');
  if (Object.keys(data).length > 0) {
    console.log('Additional Data:', data);
  }
  console.groupEnd();
};

export default api;

// Export additional utilities
export { showCustomNotification, debugId };

/**
 * Booking API Functions
 */
export const bookingAPI = {
  // Check authentication status - fallback to token check if endpoint doesn't exist
  authCheck: async () => {
    try {
      return await api.get('/api/auth/verify');
    } catch (error) {
      console.warn('Auth verify endpoint not available, using token check fallback');
      // If endpoint doesn't exist, check token presence as fallback
      const token = localStorage.getItem('token');
      return {
        ok: !!token,
        json: { authenticated: !!token },
        error: token ? null : 'No token found'
      };
    }
  },
  
  // Get current user profile - fallback to localStorage if endpoint doesn't exist
  getUserProfile: async () => {
    try {
      return await api.get('/api/auth/profile');
    } catch (error) {
      console.warn('Profile endpoint not available, using localStorage fallback');
      // Fallback to localStorage data
      const userFullName = localStorage.getItem('userFullName');
      const username = localStorage.getItem('username');
      
      if (userFullName || username) {
        return {
          ok: true,
          json: {
            name: userFullName,
            full_name: userFullName,
            email: username, // username is stored as email
            username: username
          },
          error: null
        };
      }
      
      return {
        ok: false,
        json: null,
        error: 'No user data available'
      };
    }
  },
  
  // Create a new event booking
  createBooking: async (bookingData) => {
    console.log('Creating booking with data:', bookingData);
    console.log('Token available:', !!localStorage.getItem('token'));
    console.log('API Base URL:', API_BASE_URL);
    
    try {
      const response = await api.post('/api/bookings', bookingData);
      console.log('Booking API response:', response);
      
      if (response.ok) {
        console.log('Booking successfully saved to database');
        return response;
      } else {
        console.error('Database save failed:', response.error);
        throw new Error(response.error || 'Failed to save booking');
      }
    } catch (error) {
      console.error('Booking API failed:', error);
      
      // Check if it's a network error (backend not running)
      if (error.message?.includes('Server is unreachable') || 
          error.message?.includes('Network error') ||
          error.message?.includes('Connection failed')) {
        
        console.error('BACKEND NOT RUNNING - Database save failed!');
        console.log('Booking data that should be saved:', JSON.stringify(bookingData, null, 2));
        
        // Show error notification
        setTimeout(() => {
          showCustomNotification(
            'Backend server is not running! Booking not saved to database. Please start your backend server.',
            'error'
          );
        }, 500);
        
        // Return error instead of fake success
        return {
          ok: false,
          json: null,
          error: 'Backend server not running - booking not saved to database'
        };
      }
      
      // For other errors, re-throw
      throw error;
    }
  },
  
  // Get user's bookings
  getUserBookings: () => api.get('/api/bookings/my-bookings'),
  
  // Get specific booking by ID
  getBooking: (bookingId) => api.get(`/api/bookings/${bookingId}`),
  
  // Cancel a pending booking
  cancelBooking: (bookingId) => api.put(`/api/bookings/${bookingId}/cancel`),
  
  // Get user booking statistics
  getUserStats: () => api.get('/api/bookings/my-stats')
};

/**
 * Review API Functions
 * Note: Backend currently restricts users to one review each.
 * To allow multiple reviews, backend needs to be updated.
 */
export const reviewAPI = {
  // Get all reviews
  getAllReviews: () => api.get('/api/reviews/all'),
  
  // Create a new review (currently restricted to one per user by backend)
  createReview: (reviewData) => api.post('/api/reviews/create', reviewData),
  
  // Get reviews by user ID (my reviews)
  getUserReviews: () => api.get('/api/reviews/my-reviews'),
  
  // Get reviews by rating
  getReviewsByRating: (rating) => api.get(`/api/reviews/rating/${rating}`),
  
  // Update a review
  updateReview: (reviewId, reviewData) => api.put(`/api/reviews/update/${reviewId}`, reviewData),
  
  // Delete a review
  deleteReview: (reviewId) => api.delete(`/api/reviews/delete/${reviewId}`),
  
  // Get review statistics
  getReviewStatistics: () => api.get('/api/reviews/statistics'),
  
  // Check if user can review
  checkCanReview: () => api.get('/api/reviews/can-review')
};

/**
 * User Dashboard API Functions
 */
export const userAPI = {
  // Get user's room bookings
  getRoomBookings: () => api.get('/api/user/room-bookings'),
  
  // Get user's event bookings with full details
  getEventBookings: () => api.get('/api/user/event-bookings'),
  
  // Get user's travel history
  getTravelHistory: () => api.get('/api/user/travel-history'),
  
  // Update room booking
  updateRoomBooking: (bookingId, updateData) => api.put(`/api/user/room-bookings/${bookingId}`, updateData),
  
  // Update event booking
  updateEventBooking: (bookingId, updateData) => api.put(`/api/user/event-bookings/${bookingId}`, updateData),
  
  // Cancel room booking
  cancelRoomBooking: (bookingId) => api.delete(`/api/user/room-bookings/${bookingId}`),
  
  // Cancel event booking
  cancelEventBooking: (bookingId) => api.delete(`/api/user/event-bookings/${bookingId}`),
  
  // Get dashboard statistics
  getDashboardStats: () => api.get('/api/user/dashboard-stats'),
  
  // Get recent activity
  getRecentActivity: () => api.get('/api/user/recent-activity'),
  
  // Get upcoming events
  getUpcomingEvents: () => api.get('/api/user/upcoming-events')
};

// Room Management API
export const roomAPI = {
  // Get all rooms
  getAllRooms: () => api.get('/api/rooms'),
  
  // Get room types
  getRoomTypes: () => api.get('/api/rooms/types'),
  
  // Create new room
  createRoom: (roomData) => api.post('/api/rooms', roomData),
  
  // Update room
  updateRoom: (roomId, roomData) => api.put(`/api/rooms/${roomId}`, roomData),
  
  // Delete room (admin only)
  deleteRoom: (roomId) => api.delete(`/api/rooms/${roomId}`),
  
  // Create new room type with description
  createRoomType: (roomTypeData) => api.post('/api/rooms/types', roomTypeData),
  
  // Create simple room type (name only) - fallback for existing functionality
  createSimpleRoomType: (typeName) => api.post('/api/rooms/types/simple', { name: typeName }),
  
  // Update room type
  updateRoomType: (roomTypeId, roomTypeData) => api.put(`/api/rooms/types/${roomTypeId}`, roomTypeData),
  
  // Delete room type (admin only)
  deleteRoomType: (roomTypeId) => api.delete(`/api/rooms/types/${roomTypeId}`),
  
  // Update room availability
  updateRoomAvailability: (roomId, available) => api.patch(`/api/rooms/${roomId}/availability`, { available })
};
