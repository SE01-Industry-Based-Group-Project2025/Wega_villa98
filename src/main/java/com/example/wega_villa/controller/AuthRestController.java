package com.example.wega_villa.controller;

import com.example.wega_villa.model.User;
import com.example.wega_villa.repository.UserRepository;
import com.example.wega_villa.service.SessionService;
import com.example.wega_villa.service.UserService;
import com.example.wega_villa.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthRestController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private SessionService sessionService;    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userMap) {
        try {
            // Support both 'email' and 'username' fields for compatibility
            String email = userMap.get("email");
            if (email == null) {
                email = userMap.get("username"); // Fallback to 'username' for React frontend
            }
              String name = userMap.get("name"); // Get the display name
            if (name == null) {
                name = userMap.get("fullName"); // Try fullName if name is not found
            }
            String password = userMap.get("password");
            
            System.out.println("Registration attempt - Email: " + email + ", Name: '" + name + "'");
            System.out.println("All received fields: " + userMap.keySet());
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email and password are required"));
            }
            
            // Only use email as name if name is truly not provided or empty
            if (name == null || name.trim().isEmpty()) {
                name = email.split("@")[0]; // Use part before @ as default name
                System.out.println("Name was empty, using default from email: " + name);
            } else {
                System.out.println("Using provided name: '" + name + "'");
            }
            
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email already exists"));
            }
            
            userService.registerNewUser(email, name, password, Collections.singleton("USER"));
            return ResponseEntity.ok(Collections.singletonMap("message", "Registration successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Registration failed: " + e.getMessage()));
        }
    }    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginMap) {
        try {
            // Support both 'email' and 'username' fields for compatibility
            String email = loginMap.get("email");
            if (email == null) {
                email = loginMap.get("username"); // Fallback to 'username' for React frontend
            }
            
            String password = loginMap.get("password");
            
            System.out.println("Login attempt - Email: " + email + ", Password: " + (password != null ? "[HIDDEN]" : "null"));
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email and password are required"));
            }
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
              // Get user details to include name and roles in response
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Extract role names from user roles
            String[] roles = user.getRoles().stream()
                .map(role -> role.getName())
                .toArray(String[]::new);
            
            String jwt = jwtUtil.generateToken(email, roles);
            
            // Create session for ADMIN and MANAGER users only
            String sessionId = sessionService.createSession(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("roles", roles);
            response.put("message", "Login successful!");
            response.put("success", true);
            
            // Include session ID if created (for ADMIN/MANAGER)
            if (sessionId != null) {
                response.put("sessionId", sessionId);
                response.put("sessionManaged", true);
                System.out.println("Session created for " + String.join(",", roles) + " user: " + email);
            } else {
                response.put("sessionManaged", false);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Invalid username or password"));
        }
    }    @GetMapping("/verify")
    public ResponseEntity<?> verify() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated", "authenticated", false));
            }
            
            // Get user details
            User user = null;
            if (auth.getPrincipal() instanceof User) {
                user = (User) auth.getPrincipal();
            } else if (auth.getPrincipal() instanceof String) {
                String email = (String) auth.getPrincipal();
                user = userRepository.findByEmail(email).orElse(null);
            }
            
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "User not found", "authenticated", false));
            }
            
            String[] roles = user.getRoles().stream()
                .map(role -> role.getName())
                .toArray(String[]::new);
            
            Map<String, Object> response = Map.of(
                "authenticated", true,
                "user", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "name", user.getName(),
                    "roles", roles
                )
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Auth verify error: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Authentication verification failed", "authenticated", false));
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            
            // Get user details
            User user = null;
            if (auth.getPrincipal() instanceof User) {
                user = (User) auth.getPrincipal();
            } else if (auth.getPrincipal() instanceof String) {
                String email = (String) auth.getPrincipal();
                user = userRepository.findByEmail(email).orElse(null);
            }
            
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "User not found"));
            }
            
            String[] roles = user.getRoles().stream()
                .map(role -> role.getName())
                .toArray(String[]::new);
            
            Map<String, Object> response = Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "roles", roles
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Get profile error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get profile"));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Collections.singletonMap("message", "Server is running"));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                // Get user details for logging
                User user = null;
                if (auth.getPrincipal() instanceof User) {
                    user = (User) auth.getPrincipal();
                } else if (auth.getPrincipal() instanceof String) {
                    String email = (String) auth.getPrincipal();
                    user = userRepository.findByEmail(email).orElse(null);
                }
                
                if (sessionId != null) {
                    sessionService.invalidateSession(sessionId);
                    System.out.println("Explicit logout - Session invalidated: " + sessionId + 
                        (user != null ? " (User: " + user.getEmail() + ")" : ""));
                } else if (user != null) {
                    // Invalidate all user sessions if no specific session ID provided
                    sessionService.invalidateAllUserSessions(user.getId());
                    System.out.println("Explicit logout - All sessions invalidated for user: " + user.getEmail());
                }
            }
            
            // Clear Spring Security context
            SecurityContextHolder.clearContext();
            
            return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully",
                "success", true
            ));
            
        } catch (Exception e) {
            System.out.println("Logout error: " + e.getMessage());
            return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully",
                "success", true
            )); // Always return success for logout
        }
    }
    
    @PostMapping("/heartbeat")
    public ResponseEntity<?> heartbeat(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        try {
            if (sessionId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Session ID required"));
            }
            
            boolean updated = sessionService.updateHeartbeat(sessionId);
            
            if (updated) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Heartbeat updated"
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Invalid session",
                    "code", "SESSION_INVALID"
                ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Heartbeat update failed"));
        }
    }
    
    @GetMapping("/session/status")
    public ResponseEntity<?> getSessionStatus(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        try {
            if (sessionId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Session ID required"));
            }
            
            SessionService.SessionInfo session = sessionService.getSession(sessionId);
            
            if (session == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "error", "Session not found",
                    "sessionValid", false
                ));
            }
            
            boolean isValid = sessionService.isSessionValid(sessionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sessionValid", isValid);
            response.put("sessionId", sessionId);
            response.put("userEmail", session.getUserEmail());
            response.put("userRole", session.getUserRole());
            response.put("createdAt", session.getCreatedAt().toString());
            response.put("lastHeartbeat", session.getLastHeartbeat().toString());
            response.put("active", session.isActive());
            response.put("expired", session.isExpired());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get session status"));
        }
    }
}
