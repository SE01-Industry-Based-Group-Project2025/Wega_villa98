package com.example.wega_villa.controller;

import com.example.wega_villa.model.User;
import com.example.wega_villa.model.Role;
import com.example.wega_villa.service.UserService;
import com.example.wega_villa.repository.UserRepository;
import com.example.wega_villa.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // Create a new manager
    @PostMapping("/managers")
    // @PreAuthorize("hasAuthority('MANAGE_ALL_USERS') or hasAuthority('ADD_TOUR_GUIDE')")
    public ResponseEntity<?> createManager(@RequestBody Map<String, String> managerData) {
        try {
            System.out.println("=== CREATE MANAGER REQUEST ===");
            System.out.println("Received data: " + managerData);
            
            String name = managerData.get("name");
            String email = managerData.get("email");
            String password = managerData.get("password");
            // Note: phone field would need to be added to User entity to store phone numbers

            System.out.println("Parsed - Name: " + name + ", Email: " + email);

            // Validation
            if (name == null || name.trim().isEmpty()) {
                System.out.println("Validation failed: Name is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
            }
            if (email == null || email.trim().isEmpty()) {
                System.out.println("Validation failed: Email is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (password == null || password.trim().isEmpty()) {
                System.out.println("Validation failed: Password is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }

            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                System.out.println("Validation failed: Email already exists");
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }

            System.out.println("Creating user with MANAGER role...");
            // Create user with MANAGER role
            User manager = userService.registerNewUser(email, name, password, Collections.singleton("MANAGER"));
            System.out.println("User created successfully with ID: " + manager.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", manager.getId());
            response.put("name", manager.getName());
            response.put("email", manager.getEmail());
            response.put("role", "MANAGER");
            response.put("status", "Active");
            response.put("message", "Manager created successfully");

            System.out.println("Returning response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create manager: " + e.getMessage()));
        }
    }    // Get all managers
    @GetMapping("/managers")
    // @PreAuthorize("hasAuthority('MANAGE_ALL_USERS') or hasAuthority('VIEW_DEPARTMENTAL_REPORTS')")
    public ResponseEntity<?> getAllManagers() {
        try {
            System.out.println("=== GET ALL MANAGERS REQUEST ===");
            List<User> managers = userRepository.findByRoleName("MANAGER");
            System.out.println("Found " + managers.size() + " managers");
            
            List<Map<String, Object>> managerList = managers.stream()
                .map(manager -> {
                    Map<String, Object> managerMap = new HashMap<>();
                    managerMap.put("id", manager.getId());
                    managerMap.put("name", manager.getName());
                    managerMap.put("email", manager.getEmail());
                    managerMap.put("role", "MANAGER");
                    managerMap.put("status", "Active");
                    
                    System.out.println("Manager: ID=" + manager.getId() + ", Name=" + manager.getName() + 
                                     ", Email=" + manager.getEmail());
                    return managerMap;
                })
                .collect(Collectors.toList());

            System.out.println("Returning " + managerList.size() + " managers");
            return ResponseEntity.ok(managerList);
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch managers: " + e.getMessage()));
        }
    }// Update manager
    @PutMapping("/managers/{id}")
    // @PreAuthorize("hasAuthority('MANAGE_ALL_USERS')")
    public ResponseEntity<?> updateManager(@PathVariable Long id, @RequestBody Map<String, String> managerData) {
        try {
            System.out.println("=== UPDATE MANAGER REQUEST ===");
            System.out.println("Manager ID: " + id);
            System.out.println("Update data: " + managerData);
            
            Optional<User> managerOpt = userRepository.findById(id);
            if (managerOpt.isEmpty()) {
                System.out.println("Manager not found with ID: " + id);
                return ResponseEntity.badRequest().body(Map.of("error", "Manager not found"));
            }

            User manager = managerOpt.get();
            System.out.println("Found manager: " + manager.getName() + " (" + manager.getEmail() + ")");
            
            // Update fields
            String name = managerData.get("name");
            String email = managerData.get("email");
            
            if (name != null && !name.trim().isEmpty()) {
                System.out.println("Updating name from '" + manager.getName() + "' to '" + name + "'");
                manager.setName(name);
            }
            
            if (email != null && !email.trim().isEmpty()) {
                // Check if new email already exists (excluding current user)
                if (!email.equals(manager.getEmail()) && userRepository.existsByEmail(email)) {
                    System.out.println("Email conflict: " + email + " already exists");
                    return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
                }
                System.out.println("Updating email from '" + manager.getEmail() + "' to '" + email + "'");
                manager.setEmail(email);
            }

            userRepository.save(manager);
            System.out.println("Manager updated successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("id", manager.getId());
            response.put("name", manager.getName());
            response.put("email", manager.getEmail());
            response.put("role", "MANAGER");
            response.put("status", "Active");
            response.put("message", "Manager updated successfully");

            System.out.println("Returning response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Exception occurred during update: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update manager: " + e.getMessage()));
        }
    }    // Delete manager
    @DeleteMapping("/managers/{id}")
    // @PreAuthorize("hasAuthority('MANAGE_ALL_USERS') or hasAuthority('DELETE_TOUR_GUIDE')")
    public ResponseEntity<?> deleteManager(@PathVariable Long id) {
        try {
            System.out.println("=== DELETE MANAGER REQUEST ===");
            System.out.println("Manager ID to delete: " + id);
            
            Optional<User> managerOpt = userRepository.findById(id);
            if (managerOpt.isEmpty()) {
                System.out.println("Manager not found with ID: " + id);
                return ResponseEntity.badRequest().body(Map.of("error", "Manager not found"));
            }

            User manager = managerOpt.get();
            System.out.println("Found manager to delete: " + manager.getName() + " (" + manager.getEmail() + ")");
            
            userRepository.deleteById(id);
            System.out.println("Manager deleted successfully");
            return ResponseEntity.ok(Map.of("message", "Manager deleted successfully"));
        } catch (Exception e) {
            System.out.println("Exception occurred during delete: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete manager: " + e.getMessage()));
        }
    }// Get all users by role
    @GetMapping("/users")
    // @PreAuthorize("hasAuthority('MANAGE_ALL_USERS')")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) String role) {
        try {
            List<User> users;
            if (role != null && !role.isEmpty()) {
                users = userRepository.findByRoleName(role.toUpperCase());
            } else {
                users = userRepository.findAll();
            }
            
            List<Map<String, Object>> userList = users.stream()
                .map(user -> {
                    String userRole = user.getRoles().isEmpty() ? "USER" : 
                        user.getRoles().iterator().next().getName();
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("role", userRole);
                    userMap.put("status", "Active");
                    return userMap;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch users: " + e.getMessage()));
        }
    }    // Debug endpoint to check all users in database
    @GetMapping("/debug/all-users")
    public ResponseEntity<?> debugAllUsers() {
        try {
            System.out.println("=== DEBUG: ALL USERS IN DATABASE ===");
            List<User> allUsers = userRepository.findAll();
            System.out.println("Total users found: " + allUsers.size());
            
            List<Map<String, Object>> debugList = allUsers.stream()
                .map(user -> {
                    String userRole = user.getRoles().isEmpty() ? "NO_ROLE" : 
                        user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(Collectors.joining(", "));
                    
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("roles", userRole);
                    
                    System.out.println("User: ID=" + user.getId() + ", Name=" + user.getName() + 
                                     ", Email=" + user.getEmail() + ", Roles=" + userRole);
                    return userMap;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(debugList);
        } catch (Exception e) {
            System.out.println("Exception in debug endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Debug failed: " + e.getMessage()));
        }
    }
    // ========== TOUR GUIDE MANAGEMENT ENDPOINTS ==========
    
    // Create a new tour guide
    @PostMapping("/tour-guides")
    public ResponseEntity<?> createTourGuide(@RequestBody Map<String, String> guideData) {
        try {
            System.out.println("=== CREATE TOUR GUIDE REQUEST ===");
            System.out.println("Received data: " + guideData);
            
            String name = guideData.get("name");
            String email = guideData.get("email");
            String password = guideData.get("password");

            System.out.println("Parsed - Name: " + name + ", Email: " + email);

            // Validation
            if (name == null || name.trim().isEmpty()) {
                System.out.println("Validation failed: Name is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
            }
            if (email == null || email.trim().isEmpty()) {
                System.out.println("Validation failed: Email is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (password == null || password.trim().isEmpty()) {
                System.out.println("Validation failed: Password is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }

            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                System.out.println("Validation failed: Email already exists");
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }            System.out.println("Creating user with TOUR_GUIDE role...");
            // Create user with TOUR_GUIDE role
            User guide = userService.registerNewUser(email, name, password, Collections.singleton("TOUR_GUIDE"));
            System.out.println("User created successfully with ID: " + guide.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", guide.getId());
            response.put("name", guide.getName());
            response.put("email", guide.getEmail());
            response.put("role", "TOUR_GUIDE");
            response.put("status", "Active");
            response.put("message", "Tour guide created successfully");

            System.out.println("Returning response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create tour guide: " + e.getMessage()));
        }
    }    // Get all tour guides
    @GetMapping("/tour-guides")
    public ResponseEntity<?> getAllTourGuides() {        try {
            System.out.println("=== GET ALL TOUR GUIDES REQUEST ===");
            List<User> guides = userRepository.findByRoleName("TOUR_GUIDE");
            System.out.println("Found " + guides.size() + " tour guides");
            
            List<Map<String, Object>> guideList = guides.stream()
                .map(guide -> {
                    Map<String, Object> guideMap = new HashMap<>();
                    guideMap.put("id", guide.getId());
                    guideMap.put("name", guide.getName());
                    guideMap.put("email", guide.getEmail());
                    guideMap.put("role", "TOUR_GUIDE");
                    guideMap.put("status", "Active");
                    
                    System.out.println("Tour Guide: ID=" + guide.getId() + ", Name=" + guide.getName() + 
                                     ", Email=" + guide.getEmail());
                    return guideMap;
                })
                .collect(Collectors.toList());

            System.out.println("Returning " + guideList.size() + " tour guides");
            return ResponseEntity.ok(guideList);
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch tour guides: " + e.getMessage()));
        }
    }

    // Update tour guide
    @PutMapping("/tour-guides/{id}")
    public ResponseEntity<?> updateTourGuide(@PathVariable Long id, @RequestBody Map<String, String> guideData) {
        try {
            System.out.println("=== UPDATE TOUR GUIDE REQUEST ===");
            System.out.println("Tour Guide ID: " + id);
            System.out.println("Update data: " + guideData);
            
            Optional<User> guideOpt = userRepository.findById(id);
            if (guideOpt.isEmpty()) {
                System.out.println("Tour guide not found with ID: " + id);
                return ResponseEntity.badRequest().body(Map.of("error", "Tour guide not found"));
            }

            User guide = guideOpt.get();
            System.out.println("Found tour guide: " + guide.getName() + " (" + guide.getEmail() + ")");
            
            // Update fields
            String name = guideData.get("name");
            String email = guideData.get("email");
            
            if (name != null && !name.trim().isEmpty()) {
                System.out.println("Updating name from '" + guide.getName() + "' to '" + name + "'");
                guide.setName(name);
            }
            
            if (email != null && !email.trim().isEmpty()) {
                // Check if new email already exists (excluding current user)
                if (!email.equals(guide.getEmail()) && userRepository.existsByEmail(email)) {
                    System.out.println("Email conflict: " + email + " already exists");
                    return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
                }
                System.out.println("Updating email from '" + guide.getEmail() + "' to '" + email + "'");
                guide.setEmail(email);
            }

            userRepository.save(guide);
            System.out.println("Tour guide updated successfully");            Map<String, Object> response = new HashMap<>();
            response.put("id", guide.getId());
            response.put("name", guide.getName());
            response.put("email", guide.getEmail());
            response.put("role", "TOUR_GUIDE");
            response.put("status", "Active");
            response.put("message", "Tour guide updated successfully");

            System.out.println("Returning response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Exception occurred during update: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update tour guide: " + e.getMessage()));
        }
    }

    // Delete tour guide
    @DeleteMapping("/tour-guides/{id}")
    public ResponseEntity<?> deleteTourGuide(@PathVariable Long id) {
        try {
            System.out.println("=== DELETE TOUR GUIDE REQUEST ===");
            System.out.println("Tour Guide ID to delete: " + id);
            
            Optional<User> guideOpt = userRepository.findById(id);
            if (guideOpt.isEmpty()) {
                System.out.println("Tour guide not found with ID: " + id);
                return ResponseEntity.badRequest().body(Map.of("error", "Tour guide not found"));
            }

            User guide = guideOpt.get();
            System.out.println("Found tour guide to delete: " + guide.getName() + " (" + guide.getEmail() + ")");
            
            userRepository.deleteById(id);
            System.out.println("Tour guide deleted successfully");
            return ResponseEntity.ok(Map.of("message", "Tour guide deleted successfully"));
        } catch (Exception e) {
            System.out.println("Exception occurred during delete: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete tour guide: " + e.getMessage()));
        }
    }
    
    // Debug endpoint to fix user roles (change MANAGER to TOUR_GUIDE for specific users)
    @PutMapping("/debug/fix-user-role/{id}")
    public ResponseEntity<?> fixUserRole(@PathVariable Long id, @RequestParam String newRole) {
        try {
            System.out.println("=== FIX USER ROLE REQUEST ===");
            System.out.println("User ID: " + id + ", New Role: " + newRole);
            
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            System.out.println("Found user: " + user.getName() + " (" + user.getEmail() + ")");
            
            // Find the new role
            Optional<Role> roleOpt = roleRepository.findByName(newRole);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Role not found: " + newRole));
            }
            
            Role role = roleOpt.get();
            System.out.println("Found role: " + role.getName());
            
            // Update user's role
            Set<Role> newRoles = new HashSet<>();
            newRoles.add(role);
            user.setRoles(newRoles);
            
            userRepository.save(user);
            System.out.println("User role updated successfully");
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("oldRole", "Previous role");
            response.put("newRole", newRole);
            response.put("message", "User role updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Exception occurred during role update: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update user role: " + e.getMessage()));
        }
    }
}
