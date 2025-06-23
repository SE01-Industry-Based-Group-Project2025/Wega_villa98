package com.example.wega_villa.controller;

import com.example.wega_villa.model.User;
import com.example.wega_villa.repository.UserRepository;
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
    private JwtUtil jwtUtil;    @PostMapping("/register")
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
            
            Map<String, Object> response = Map.of(
                "token", jwt,
                "name", user.getName(),
                "email", user.getEmail(),
                "roles", roles,
                "message", "Login successful!",
                "success", true
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Invalid username or password"));
        }
    }    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Collections.singletonMap("message", "Server is running"));
    }
}
