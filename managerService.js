// Manager API Service for React Frontend
// Place this in your React project (e.g., src/services/managerService.js)

const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Common headers for API requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const managerService = {
  // Create a new manager
  createManager: async (managerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/managers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(managerData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create manager');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating manager:', error);
      throw error;
    }
  },

  // Get all managers
  getAllManagers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/managers`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch managers');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  },

  // Update a manager
  updateManager: async (managerId, managerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/managers/${managerId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(managerData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update manager');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating manager:', error);
      throw error;
    }
  },

  // Delete a manager
  deleteManager: async (managerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/managers/${managerId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete manager');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting manager:', error);
      throw error;
    }
  },

  // Get all users (optional, for admin dashboard)
  getAllUsers: async (role = '') => {
    try {
      const url = role ? `${API_BASE_URL}/admin/users?role=${role}` : `${API_BASE_URL}/admin/users`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
};

export default managerService;
