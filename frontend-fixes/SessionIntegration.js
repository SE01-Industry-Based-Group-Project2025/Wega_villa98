// SessionIntegration.js - Integration guide for existing frontend

/**
 * INTEGRATION STEPS FOR YOUR EXISTING FRONTEND
 * ==========================================
 */

/**
 * 1. INCLUDE SESSION MANAGER
 * Add this to your main HTML file or import in your React app
 */

// In HTML:
// <script src="./SessionManager.js"></script>

// In React/JS modules:
// import SessionManager from './SessionManager.js';

/**
 * 2. UPDATE YOUR LOGIN FUNCTION
 * Modify your existing login function to integrate session management
 */

// BEFORE (your current login):
/*
const login = async (credentials) => {
    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            // redirect or update UI
        }
    } catch (error) {
        console.error('Login error:', error);
    }
};
*/

// AFTER (with session management):
const loginWithSessionManagement = async (credentials) => {
    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store token and user data as before
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            
            // NEW: Start session management for ADMIN/MANAGER
            if (window.sessionManager) {
                window.sessionManager.startSession(data);
            }
            
            console.log('Login successful with session management:', data);
            
            // redirect or update UI
            return data;
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * 3. UPDATE YOUR LOGOUT FUNCTION
 */

// BEFORE (your current logout):
/*
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};
*/

// AFTER (with session management):
const logoutWithSessionManagement = async () => {
    try {
        // NEW: Use session manager for proper cleanup
        if (window.sessionManager) {
            await window.sessionManager.logout();
        } else {
            // Fallback: manual cleanup
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('authData');
        }
        
        console.log('Logged out successfully');
        window.location.href = '/login';
        
    } catch (error) {
        console.error('Logout error:', error);
        // Still redirect even if logout request fails
        window.location.href = '/login';
    }
};

/**
 * 4. UPDATE YOUR API REQUEST FUNCTION
 * Add session ID header to all API requests for ADMIN/MANAGER
 */

// BEFORE (your current API function):
/*
const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...(options.headers || {})
        }
    };
    
    return fetch(url, config);
};
*/

// AFTER (with session management):
const apiRequestWithSession = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    // Get session info from session manager
    const sessionInfo = window.sessionManager ? window.sessionManager.getSessionInfo() : {};
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...(sessionInfo.sessionId && { 'X-Session-Id': sessionInfo.sessionId }),
            ...(options.headers || {})
        }
    };
    
    const response = await fetch(url, config);
    
    // Handle session expiration
    if (response.status === 401) {
        const data = await response.json().catch(() => ({}));
        if (data.code === 'SESSION_EXPIRED') {
            console.warn('Session expired detected in API call');
            if (window.sessionManager) {
                window.sessionManager.handleSessionExpired();
            }
        }
    }
    
    return response;
};

/**
 * 5. ADD SESSION STATUS CHECK TO YOUR APP INITIALIZATION
 */

const initializeAppWithSession = async () => {
    try {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            // Verify token is still valid
            const response = await fetch('http://localhost:8080/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('User still authenticated:', data);
                
                // Initialize session management if needed
                const authData = localStorage.getItem('authData');
                if (authData && window.sessionManager) {
                    const sessionData = JSON.parse(authData);
                    if (sessionData.sessionManaged) {
                        console.log('Resuming session management');
                        window.sessionManager.startSessionManagement();
                    }
                }
            } else {
                // Token invalid, clear storage
                console.log('Token expired, clearing storage');
                localStorage.clear();
                window.location.href = '/login';
            }
        }
    } catch (error) {
        console.error('App initialization error:', error);
    }
};

/**
 * 6. REACT COMPONENT EXAMPLE
 * If you're using React, here's how to integrate:
 */

/*
import React, { useEffect } from 'react';

const App = () => {
    useEffect(() => {
        // Initialize session management when app loads
        initializeAppWithSession();
        
        // Cleanup on unmount
        return () => {
            if (window.sessionManager) {
                window.sessionManager.cleanup();
            }
        };
    }, []);
    
    const handleLogin = async (credentials) => {
        try {
            const result = await loginWithSessionManagement(credentials);
            // Handle successful login
        } catch (error) {
            // Handle login error
        }
    };
    
    const handleLogout = async () => {
        await logoutWithSessionManagement();
    };
    
    return (
        <div>
            // Your app content
        </div>
    );
};
*/

/**
 * 7. ADD TO YOUR EXISTING ADMIN DASHBOARD
 * If you want to show session info in admin dashboard:
 */

const displaySessionInfo = () => {
    if (!window.sessionManager) return null;
    
    const sessionInfo = window.sessionManager.getSessionInfo();
    
    return `
        <div class="session-info">
            <h4>Session Status</h4>
            <p>Session ID: ${sessionInfo.sessionId || 'None'}</p>
            <p>Managed: ${sessionInfo.isSessionManaged ? 'Yes' : 'No'}</p>
            <p>Heartbeat Active: ${sessionInfo.hasHeartbeat ? 'Yes' : 'No'}</p>
        </div>
    `;
};

/**
 * 8. TESTING THE INTEGRATION
 * To test if everything works:
 */

const testSessionManagement = async () => {
    console.log('🧪 Testing session management...');
    
    // Test 1: Check if session manager is loaded
    if (window.sessionManager) {
        console.log('✅ SessionManager loaded');
    } else {
        console.error('❌ SessionManager not loaded');
        return;
    }
    
    // Test 2: Check session info
    const info = window.sessionManager.getSessionInfo();
    console.log('📊 Session info:', info);
    
    // Test 3: Test heartbeat (if session is active)
    if (info.sessionId) {
        console.log('💓 Testing heartbeat...');
        await window.sessionManager.sendHeartbeat();
    }
    
    // Test 4: Check session status
    if (info.sessionId) {
        console.log('🔍 Checking session status...');
        const isValid = await window.sessionManager.checkSessionStatus();
        console.log('📈 Session valid:', isValid);
    }
    
    console.log('🧪 Session management test completed');
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
    window.testSessionManagement = testSessionManagement;
    window.loginWithSessionManagement = loginWithSessionManagement;
    window.logoutWithSessionManagement = logoutWithSessionManagement;
    window.apiRequestWithSession = apiRequestWithSession;
}

console.log('🔧 Session integration helpers loaded');

export {
    loginWithSessionManagement,
    logoutWithSessionManagement,
    apiRequestWithSession,
    initializeAppWithSession,
    testSessionManagement
};
