// api.js - Updated API utility with session management
// This should replace or enhance your existing api.js file

class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.sessionId = null;
        this.isSessionManaged = false;
        this.heartbeatInterval = null;
        
        // Initialize from localStorage
        this.initializeFromStorage();
        
        // Setup global error handler
        this.setupErrorHandlers();
    }
    
    initializeFromStorage() {
        try {
            const authData = localStorage.getItem('authData');
            if (authData) {
                const data = JSON.parse(authData);
                this.sessionId = data.sessionId;
                this.isSessionManaged = data.sessionManaged || false;
                
                if (this.isSessionManaged && this.sessionId) {
                    this.startHeartbeat();
                }
            }
        } catch (error) {
            console.error('Error initializing API client from storage:', error);
        }
    }
    
    setupErrorHandlers() {
        // Handle browser close/tab close
        window.addEventListener('beforeunload', () => {
            if (this.sessionId) {
                this.sendLogoutSync();
            }
        });
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.sessionId) {
                this.sendHeartbeat();
            }
        });
        
        // Handle storage events (multi-tab logout)
        window.addEventListener('storage', (event) => {
            if (event.key === 'sessionLogout') {
                this.handleSessionExpired();
            }
        });
    }
    
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...(this.sessionId && { 'X-Session-Id': this.sessionId }),
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            
            // Handle session expiration
            if (response.status === 401) {
                try {
                    const errorData = await response.json();
                    if (errorData.code === 'SESSION_EXPIRED') {
                        console.warn('Session expired detected');
                        this.handleSessionExpired();
                        throw new Error('Session expired. Please log in again.');
                    }
                } catch (jsonError) {
                    // If response is not JSON, still handle 401
                    if (this.sessionId) {
                        this.handleSessionExpired();
                        throw new Error('Authentication failed. Please log in again.');
                    }
                }
            }
            
            return response;
        } catch (error) {
            console.error('API Request error:', error);
            throw error;
        }
    }
    
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    
    // Session management methods
    startSession(authData) {
        console.log('🔐 Starting session management', authData);
        
        this.sessionId = authData.sessionId;
        this.isSessionManaged = authData.sessionManaged || false;
        
        // Store complete auth data
        localStorage.setItem('authData', JSON.stringify(authData));
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify({
            name: authData.name,
            email: authData.email,
            roles: authData.roles
        }));
        
        if (this.isSessionManaged && this.sessionId) {
            this.startHeartbeat();
        }
    }
    
    startHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        
        // Send heartbeat every 5 minutes
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, 5 * 60 * 1000);
        
        // Send initial heartbeat
        this.sendHeartbeat();
    }
    
    async sendHeartbeat() {
        if (!this.sessionId) return;
        
        try {
            const response = await this.post('/auth/heartbeat', {});
            
            if (response.ok) {
                console.log('💓 Heartbeat sent successfully');
            } else if (response.status === 401) {
                console.warn('🚨 Session expired during heartbeat');
                this.handleSessionExpired();
            }
        } catch (error) {
            console.error('💔 Heartbeat error:', error);
        }
    }
    
    async logout() {
        try {
            if (this.sessionId) {
                await this.post('/auth/logout', {});
                
                // Notify other tabs
                localStorage.setItem('sessionLogout', Date.now().toString());
            }
        } catch (error) {
            console.error('Logout request error:', error);
        } finally {
            this.cleanup();
        }
    }
    
    sendLogoutSync() {
        if (!this.sessionId) return;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            // Use sendBeacon for reliable delivery during page unload
            const data = JSON.stringify({ sessionId: this.sessionId });
            navigator.sendBeacon(
                `${this.baseURL}/auth/logout`,
                new Blob([data], { type: 'application/json' })
            );
        } catch (error) {
            console.error('Sync logout error:', error);
        }
    }
    
    handleSessionExpired() {
        console.log('⏰ Session expired - cleaning up');
        
        // Notify other tabs
        localStorage.setItem('sessionLogout', Date.now().toString());
        
        this.cleanup();
        
        // Redirect to login with message
        alert('Your session has expired for security reasons. Please log in again.');
        window.location.href = '/login';
    }
    
    cleanup() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        this.sessionId = null;
        this.isSessionManaged = false;
        
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('authData');
        localStorage.removeItem('sessionLogout');
    }
    
    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            isSessionManaged: this.isSessionManaged,
            hasHeartbeat: !!this.heartbeatInterval
        };
    }
}

// Create global instance
const apiClient = new ApiClient();

// Export API methods for backward compatibility
export const api = {
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        const data = await response.json();
        
        if (data.success) {
            apiClient.startSession(data);
        }
        
        return { response, data };
    },
    
    logout: () => apiClient.logout(),
    
    createRoomType: async (roomTypeData) => {
        const response = await apiClient.post('/rooms/types', roomTypeData);
        return response.json();
    },
    
    createRoom: async (roomData) => {
        const response = await apiClient.post('/rooms', roomData);
        return response.json();
    },
    
    getRooms: async () => {
        const response = await apiClient.get('/rooms');
        return response.json();
    },
    
    getRoomTypes: async () => {
        const response = await apiClient.get('/rooms/types');
        return response.json();
    },
    
    // Add more API methods as needed
};

export default apiClient;

// Make available globally
window.apiClient = apiClient;
