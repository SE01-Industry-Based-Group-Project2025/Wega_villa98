// SessionManager.js - Frontend session management for admin/manager users

class SessionManager {
    constructor() {
        this.sessionId = null;
        this.heartbeatInterval = null;
        this.visibilityChangeHandler = null;
        this.beforeUnloadHandler = null;
        this.isSessionManaged = false;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Get session info from localStorage
        const authData = localStorage.getItem('authData');
        if (authData) {
            try {
                const data = JSON.parse(authData);
                this.sessionId = data.sessionId;
                this.isSessionManaged = data.sessionManaged || false;
                
                if (this.isSessionManaged && this.sessionId) {
                    this.startSessionManagement();
                }
            } catch (e) {
                console.error('Error parsing auth data:', e);
            }
        }
    }
    
    /**
     * Start session management after login
     */
    startSession(authData) {
        console.log('🔐 Starting session management', authData);
        
        this.sessionId = authData.sessionId;
        this.isSessionManaged = authData.sessionManaged || false;
        
        // Store auth data including session info
        localStorage.setItem('authData', JSON.stringify({
            ...authData,
            sessionId: this.sessionId,
            sessionManaged: this.isSessionManaged
        }));
        
        if (this.isSessionManaged && this.sessionId) {
            this.startSessionManagement();
        }
    }
    
    /**
     * Start all session management features
     */
    startSessionManagement() {
        console.log('📡 Starting session management for session:', this.sessionId);
        
        // Start heartbeat
        this.startHeartbeat();
        
        // Setup visibility change detection
        this.setupVisibilityChange();
        
        // Setup browser close detection
        this.setupBeforeUnload();
        
        // Setup storage event listener for multiple tabs
        this.setupStorageListener();
    }
    
    /**
     * Start sending heartbeat signals
     */
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
    
    /**
     * Send heartbeat to server
     */
    async sendHeartbeat() {
        if (!this.sessionId) return;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('No token found for heartbeat');
                return;
            }
            
            const response = await fetch('http://localhost:8080/api/auth/heartbeat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Session-Id': this.sessionId
                }
            });
            
            if (response.ok) {
                console.log('💓 Heartbeat sent successfully');
            } else if (response.status === 401) {
                console.warn('🚨 Session expired - logging out');
                this.handleSessionExpired();
            } else {
                console.error('❌ Heartbeat failed:', response.status);
            }
        } catch (error) {
            console.error('💔 Heartbeat error:', error);
        }
    }
    
    /**
     * Setup visibility change detection (tab switching)
     */
    setupVisibilityChange() {
        this.visibilityChangeHandler = () => {
            if (document.visibilityState === 'visible') {
                // Tab became visible - send heartbeat
                console.log('👁️ Tab visible - sending heartbeat');
                this.sendHeartbeat();
            } else {
                // Tab hidden - could indicate switching away
                console.log('🙈 Tab hidden');
            }
        };
        
        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }
    
    /**
     * Setup browser close/tab close detection
     */
    setupBeforeUnload() {
        this.beforeUnloadHandler = (event) => {
            console.log('🚪 Browser/tab closing - logging out');
            
            // Send logout signal immediately
            this.sendLogoutSync();
            
            // Optional: Show confirmation dialog (some browsers ignore this)
            const message = 'Are you sure you want to leave? You will be logged out for security.';
            event.returnValue = message;
            return message;
        };
        
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
    }
    
    /**
     * Setup storage listener for multi-tab session management
     */
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'sessionLogout') {
                console.log('🔄 Logout signal received from another tab');
                this.cleanup();
                window.location.href = '/login'; // Redirect to login
            }
        });
    }
    
    /**
     * Send logout signal synchronously (for browser close)
     */
    sendLogoutSync() {
        if (!this.sessionId) return;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            // Use sendBeacon for reliable delivery during page unload
            const data = JSON.stringify({ sessionId: this.sessionId });
            
            navigator.sendBeacon(
                'http://localhost:8080/api/auth/logout',
                new Blob([data], { type: 'application/json' })
            );
            
            // Also use synchronous XHR as fallback
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:8080/api/auth/logout', false); // synchronous
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('X-Session-Id', this.sessionId);
            xhr.send();
            
        } catch (error) {
            console.error('🚨 Sync logout error:', error);
        }
    }
    
    /**
     * Send async logout signal
     */
    async sendLogout() {
        if (!this.sessionId) return;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Session-Id': this.sessionId
                }
            });
            
            console.log('✅ Logout sent successfully');
            
        } catch (error) {
            console.error('❌ Logout error:', error);
        }
    }
    
    /**
     * Handle session expiration
     */
    handleSessionExpired() {
        console.log('⏰ Session expired - cleaning up');
        
        // Notify other tabs
        localStorage.setItem('sessionLogout', Date.now().toString());
        
        // Cleanup and redirect
        this.cleanup();
        
        // Show message and redirect
        alert('Your session has expired for security reasons. Please log in again.');
        window.location.href = '/login';
    }
    
    /**
     * Manual logout
     */
    async logout() {
        console.log('🔓 Manual logout initiated');
        
        await this.sendLogout();
        
        // Notify other tabs
        localStorage.setItem('sessionLogout', Date.now().toString());
        
        this.cleanup();
    }
    
    /**
     * Cleanup session management
     */
    cleanup() {
        console.log('🧹 Cleaning up session management');
        
        // Clear intervals
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        // Remove event listeners
        if (this.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
            this.visibilityChangeHandler = null;
        }
        
        if (this.beforeUnloadHandler) {
            window.removeEventListener('beforeunload', this.beforeUnloadHandler);
            this.beforeUnloadHandler = null;
        }
        
        // Clear session data
        this.sessionId = null;
        this.isSessionManaged = false;
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('authData');
        localStorage.removeItem('sessionLogout');
    }
    
    /**
     * Check session status
     */
    async checkSessionStatus() {
        if (!this.sessionId) return false;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;
            
            const response = await fetch('http://localhost:8080/api/auth/session/status', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Session-Id': this.sessionId
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.sessionValid;
            }
            
            return false;
        } catch (error) {
            console.error('Session status check error:', error);
            return false;
        }
    }
    
    /**
     * Get session info
     */
    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            isSessionManaged: this.isSessionManaged,
            hasHeartbeat: !!this.heartbeatInterval
        };
    }
}

// Create global instance
const sessionManager = new SessionManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionManager;
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
    window.SessionManager = SessionManager;
    window.sessionManager = sessionManager;
}

console.log('🎯 SessionManager initialized');
