package com.example.wega_villa.service;

import com.example.wega_villa.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SessionService {
    
    // Store active sessions: sessionId -> SessionInfo
    private final ConcurrentHashMap<String, SessionInfo> activeSessions = new ConcurrentHashMap<>();
    
    // Store user sessions: userId -> Set<sessionId>
    private final ConcurrentHashMap<Long, Set<String>> userSessions = new ConcurrentHashMap<>();
    
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    public SessionService() {
        // Clean up expired sessions every 5 minutes
        scheduler.scheduleAtFixedRate(this::cleanupExpiredSessions, 5, 5, TimeUnit.MINUTES);
    }
    
    public static class SessionInfo {
        private final String sessionId;
        private final Long userId;
        private final String userEmail;
        private final String userRole;
        private final LocalDateTime createdAt;
        private LocalDateTime lastHeartbeat;
        private boolean active;
        
        public SessionInfo(String sessionId, Long userId, String userEmail, String userRole) {
            this.sessionId = sessionId;
            this.userId = userId;
            this.userEmail = userEmail;
            this.userRole = userRole;
            this.createdAt = LocalDateTime.now();
            this.lastHeartbeat = LocalDateTime.now();
            this.active = true;
        }
        
        // Getters
        public String getSessionId() { return sessionId; }
        public Long getUserId() { return userId; }
        public String getUserEmail() { return userEmail; }
        public String getUserRole() { return userRole; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public LocalDateTime getLastHeartbeat() { return lastHeartbeat; }
        public boolean isActive() { return active; }
        
        // Setters
        public void setLastHeartbeat(LocalDateTime lastHeartbeat) { this.lastHeartbeat = lastHeartbeat; }
        public void setActive(boolean active) { this.active = active; }
        
        public boolean isExpired() {
            // Session expires after 30 minutes of inactivity
            return LocalDateTime.now().isAfter(lastHeartbeat.plusMinutes(30));
        }
    }
    
    /**
     * Create a new session for admin/manager users
     */
    public String createSession(User user) {
        // Only create sessions for ADMIN and MANAGER roles
        String userRole = user.getRoles().isEmpty() ? "USER" : 
            user.getRoles().iterator().next().getName();
            
        if (!userRole.equals("ADMIN") && !userRole.equals("MANAGER")) {
            return null; // No session tracking for regular users
        }
        
        String sessionId = java.util.UUID.randomUUID().toString();
        SessionInfo sessionInfo = new SessionInfo(sessionId, user.getId(), user.getEmail(), userRole);
        
        // Store session
        activeSessions.put(sessionId, sessionInfo);
        
        // Track user sessions
        userSessions.computeIfAbsent(user.getId(), k -> ConcurrentHashMap.newKeySet()).add(sessionId);
        
        System.out.println("Created session for " + userRole + " user: " + user.getEmail() + " (Session: " + sessionId + ")");
        
        return sessionId;
    }
    
    /**
     * Update session heartbeat to keep it alive
     */
    public boolean updateHeartbeat(String sessionId) {
        SessionInfo session = activeSessions.get(sessionId);
        if (session != null && session.isActive()) {
            session.setLastHeartbeat(LocalDateTime.now());
            System.out.println("Updated heartbeat for session: " + sessionId + " (User: " + session.getUserEmail() + ")");
            return true;
        }
        return false;
    }
    
    /**
     * Validate if session is active and not expired
     */
    public boolean isSessionValid(String sessionId) {
        SessionInfo session = activeSessions.get(sessionId);
        return session != null && session.isActive() && !session.isExpired();
    }
    
    /**
     * Get session info by session ID
     */
    public SessionInfo getSession(String sessionId) {
        return activeSessions.get(sessionId);
    }
    
    /**
     * Invalidate a specific session (logout)
     */
    public boolean invalidateSession(String sessionId) {
        SessionInfo session = activeSessions.get(sessionId);
        if (session != null) {
            session.setActive(false);
            activeSessions.remove(sessionId);
            
            // Remove from user sessions
            Set<String> userSessionSet = userSessions.get(session.getUserId());
            if (userSessionSet != null) {
                userSessionSet.remove(sessionId);
                if (userSessionSet.isEmpty()) {
                    userSessions.remove(session.getUserId());
                }
            }
            
            System.out.println("Invalidated session: " + sessionId + " (User: " + session.getUserEmail() + ")");
            return true;
        }
        return false;
    }
    
    /**
     * Invalidate all sessions for a user
     */
    public void invalidateAllUserSessions(Long userId) {
        Set<String> userSessionSet = userSessions.get(userId);
        if (userSessionSet != null) {
            for (String sessionId : userSessionSet) {
                SessionInfo session = activeSessions.get(sessionId);
                if (session != null) {
                    session.setActive(false);
                    activeSessions.remove(sessionId);
                    System.out.println("Invalidated user session: " + sessionId);
                }
            }
            userSessions.remove(userId);
        }
    }
    
    /**
     * Get all active sessions for a user
     */
    public Set<SessionInfo> getUserSessions(Long userId) {
        Set<String> sessionIds = userSessions.get(userId);
        if (sessionIds == null) {
            return Set.of();
        }
        
        return sessionIds.stream()
            .map(activeSessions::get)
            .filter(session -> session != null && session.isActive() && !session.isExpired())
            .collect(Collectors.toSet());
    }
    
    /**
     * Get all active sessions (for admin monitoring)
     */
    public Map<String, SessionInfo> getAllActiveSessions() {
        return activeSessions.entrySet().stream()
            .filter(entry -> entry.getValue().isActive() && !entry.getValue().isExpired())
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
    
    /**
     * Clean up expired sessions
     */
    private void cleanupExpiredSessions() {
        System.out.println("Running session cleanup...");
        
        activeSessions.entrySet().removeIf(entry -> {
            SessionInfo session = entry.getValue();
            if (session.isExpired() || !session.isActive()) {
                System.out.println("Removing expired/inactive session: " + entry.getKey() + " (User: " + session.getUserEmail() + ")");
                
                // Remove from user sessions
                Set<String> userSessionSet = userSessions.get(session.getUserId());
                if (userSessionSet != null) {
                    userSessionSet.remove(entry.getKey());
                    if (userSessionSet.isEmpty()) {
                        userSessions.remove(session.getUserId());
                    }
                }
                return true;
            }
            return false;
        });
        
        System.out.println("Session cleanup completed. Active sessions: " + activeSessions.size());
    }
    
    /**
     * Get session statistics
     */
    public Map<String, Object> getSessionStats() {
        Map<String, Object> stats = new ConcurrentHashMap<>();
        stats.put("totalActiveSessions", activeSessions.size());
        stats.put("totalActiveUsers", userSessions.size());
        
        Map<String, Long> roleStats = activeSessions.values().stream()
            .filter(session -> session.isActive() && !session.isExpired())
            .collect(Collectors.groupingBy(SessionInfo::getUserRole, Collectors.counting()));
        
        stats.put("sessionsByRole", roleStats);
        return stats;
    }
}
