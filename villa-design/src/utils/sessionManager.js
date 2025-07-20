// Session Management Utility
// Handles session lifecycle for ADMIN and MANAGER users

let heartbeatInterval = null;

/**
 * Start session management with automatic heartbeat
 * @param {string} sessionId - The session ID from login response
 * @param {function} onSessionExpired - Callback when session expires
 */
export const startSessionManagement = (sessionId, onSessionExpired) => {
  if (!sessionId) {
    console.warn('⚠️ No session ID provided for session management');
    return;
  }
  
  console.log('🔄 Starting session management for session:', sessionId.substring(0, 8) + '...');
  
  // Clear any existing interval
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  
  // Send heartbeat every 5 minutes to keep session alive
  heartbeatInterval = setInterval(async () => {
    try {
      const response = await fetch('/api/auth/heartbeat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-Session-Id': sessionId,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('💗 Heartbeat sent successfully');
      } else if (response.status === 401) {
        console.warn('🚫 Session expired during heartbeat');
        await handleSessionExpiration(onSessionExpired);
      } else {
        console.error('❌ Heartbeat failed:', response.status);
      }
    } catch (error) {
      console.error('💔 Heartbeat failed:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

/**
 * Send immediate heartbeat (useful when tab becomes visible)
 * @param {string} sessionId - The session ID
 * @param {function} onSessionExpired - Callback when session expires
 */
export const sendHeartbeat = async (sessionId, onSessionExpired) => {
  if (!sessionId) return;
  
  try {
    const response = await fetch('/api/auth/heartbeat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Session-Id': sessionId,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('💗 Manual heartbeat sent successfully');
    } else if (response.status === 401) {
      console.warn('🚫 Session expired during manual heartbeat');
      await handleSessionExpiration(onSessionExpired);
    }
  } catch (error) {
    console.error('💔 Manual heartbeat failed:', error);
  }
};

/**
 * Handle session expiration
 * @param {function} onSessionExpired - Callback when session expires
 */
export const handleSessionExpiration = async (onSessionExpired) => {
  console.log('⏰ Session expired, cleaning up...');
  
  // Clear heartbeat interval
  stopSessionManagement();
  
  // Clear all localStorage
  localStorage.clear();
  
  // Call the provided callback (usually redirects to login)
  if (onSessionExpired) {
    onSessionExpired();
  } else {
    // Fallback: show alert and redirect
    alert('Your session has expired. Please log in again.');
    window.location.href = '/auth';
  }
};

/**
 * Enhanced logout with session management
 * @param {string} sessionId - The session ID
 * @param {function} onLogoutComplete - Callback when logout is complete
 */
export const logoutWithSession = async (sessionId, onLogoutComplete) => {
  console.log('👋 Logging out with session management...');
  
  try {
    if (sessionId) {
      // Send logout request with session ID
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-Session-Id': sessionId,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Logout request sent successfully');
    }
  } catch (error) {
    console.error('❌ Logout error:', error);
  } finally {
    // Clear heartbeat interval
    stopSessionManagement();
    
    // Signal other tabs to logout
    localStorage.setItem('sessionLogout', Date.now().toString());
    
    // Clear all localStorage
    localStorage.clear();
    
    // Call completion callback
    if (onLogoutComplete) {
      onLogoutComplete();
    } else {
      // Fallback: redirect to login
      window.location.href = '/auth';
    }
  }
};

/**
 * Stop session management (clear heartbeat interval)
 */
export const stopSessionManagement = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    console.log('🛑 Session management stopped');
  }
};

/**
 * Check if session management is active
 * @returns {boolean} - True if session is being managed
 */
export const isSessionManaged = () => {
  const sessionId = localStorage.getItem('sessionId');
  const sessionManaged = localStorage.getItem('sessionManaged');
  return sessionId && sessionManaged === 'true';
};

/**
 * Get current session ID
 * @returns {string|null} - Current session ID or null
 */
export const getCurrentSessionId = () => {
  return localStorage.getItem('sessionId');
};

/**
 * Check session status with backend
 * @returns {Promise<boolean>} - True if session is valid
 */
export const checkSessionStatus = async () => {
  const sessionId = getCurrentSessionId();
  if (!sessionId) return false;
  
  try {
    const response = await fetch('/api/auth/session/status', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Session-Id': sessionId
      }
    });
    
    const data = await response.json();
    return data.sessionValid;
  } catch (error) {
    console.error('Session status check failed:', error);
    return false;
  }
};

/**
 * Setup browser event listeners for session management
 * @param {function} onSessionExpired - Callback when session expires
 */
export const setupSessionEventListeners = (onSessionExpired) => {
  // Multi-tab logout detection
  const handleStorageChange = (event) => {
    if (event.key === 'sessionLogout') {
      console.log('🔄 Logout detected in another tab, redirecting...');
      localStorage.clear();
      if (onSessionExpired) {
        onSessionExpired();
      } else {
        window.location.href = '/auth';
      }
    }
  };

  // Tab visibility change detection
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      const sessionId = getCurrentSessionId();
      if (sessionId) {
        console.log('👁️ Tab became visible, sending heartbeat...');
        sendHeartbeat(sessionId, onSessionExpired);
      }
    }
  };

  // Browser close detection
  const handleBeforeUnload = (event) => {
    const sessionId = getCurrentSessionId();
    if (sessionId) {
      // Send logout signal using beacon API
      navigator.sendBeacon('/api/auth/logout', JSON.stringify({
        sessionId: sessionId
      }));
      
      // Optional: Show confirmation dialog
      event.returnValue = 'You will be logged out for security. Continue?';
    }
  };

  // Add event listeners
  window.addEventListener('storage', handleStorageChange);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};
