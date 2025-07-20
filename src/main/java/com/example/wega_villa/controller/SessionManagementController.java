package com.example.wega_villa.controller;

import com.example.wega_villa.model.User;
import com.example.wega_villa.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/sessions")
@CrossOrigin(origins = "*")
public class SessionManagementController {
    
    @Autowired
    private SessionService sessionService;
    
    /**
     * Get all active sessions (ADMIN only)
     */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveSessions() {
        try {
            // Check if user has ADMIN role
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }
            
            User user = (User) auth.getPrincipal();
            boolean isAdmin = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }
            
            Map<String, SessionService.SessionInfo> activeSessions = sessionService.getAllActiveSessions();
            
            return ResponseEntity.ok(Map.of(
                "sessions", activeSessions,
                "count", activeSessions.size()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch active sessions"));
        }
    }
    
    /**
     * Get session statistics (ADMIN only)
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getSessionStats() {
        try {
            // Check if user has ADMIN role
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }
            
            User user = (User) auth.getPrincipal();
            boolean isAdmin = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }
            
            Map<String, Object> stats = sessionService.getSessionStats();
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch session statistics"));
        }
    }
    
    /**
     * Invalidate a specific session (ADMIN only)
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> invalidateSession(@PathVariable String sessionId) {
        try {
            // Check if user has ADMIN role
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }
            
            User user = (User) auth.getPrincipal();
            boolean isAdmin = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }
            
            boolean success = sessionService.invalidateSession(sessionId);
            
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "message", "Session invalidated successfully",
                    "sessionId", sessionId
                ));
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "Session not found"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to invalidate session"));
        }
    }
    
    /**
     * Invalidate all sessions for a user (ADMIN only)
     */
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> invalidateUserSessions(@PathVariable Long userId) {
        try {
            // Check if user has ADMIN role
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }
            
            User user = (User) auth.getPrincipal();
            boolean isAdmin = user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }
            
            sessionService.invalidateAllUserSessions(userId);
            
            return ResponseEntity.ok(Map.of(
                "message", "All user sessions invalidated successfully",
                "userId", userId
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to invalidate user sessions"));
        }
    }
}
