package com.example.wega_villa.controller;

import com.example.wega_villa.model.User;
import com.example.wega_villa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Change own password
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData) {
        try {
            System.out.println("=== CHANGE PASSWORD REQUEST ===");
            
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            String email = passwordData.get("email");
            
            System.out.println("Password change request for email: " + email);

            // Validation
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is required"));
            }
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "New password is required"));
            }
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            // Find user
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            System.out.println("Found user: " + user.getName() + " (" + user.getEmail() + ")");

            // Check if current password is correct
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                System.out.println("Current password verification failed");
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            System.out.println("Password updated successfully for user: " + user.getEmail());

            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            System.out.println("Exception occurred during password change: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to change password: " + e.getMessage()));
        }
    }

    // Update own profile
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> profileData) {
        try {
            System.out.println("=== UPDATE PROFILE REQUEST ===");
            System.out.println("Profile data: " + profileData);
            
            String email = profileData.get("email");
            String newName = profileData.get("name");
            String newEmail = profileData.get("newEmail");
            
            System.out.println("Profile update request for email: " + email);

            // Validation
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current email is required"));
            }

            // Find user
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            System.out.println("Found user: " + user.getName() + " (" + user.getEmail() + ")");

            // Update name if provided
            if (newName != null && !newName.trim().isEmpty()) {
                System.out.println("Updating name from '" + user.getName() + "' to '" + newName + "'");
                user.setName(newName);
            }

            // Update email if provided and different
            if (newEmail != null && !newEmail.trim().isEmpty() && !newEmail.equals(user.getEmail())) {
                if (userRepository.existsByEmail(newEmail)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "New email already exists"));
                }
                System.out.println("Updating email from '" + user.getEmail() + "' to '" + newEmail + "'");
                user.setEmail(newEmail);
            }

            userRepository.save(user);
            System.out.println("Profile updated successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("message", "Profile updated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Exception occurred during profile update: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }

    // Delete own account
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteOwnAccount(@RequestBody Map<String, String> deleteData) {
        try {
            System.out.println("=== DELETE OWN ACCOUNT REQUEST ===");
            
            String email = deleteData.get("email");
            String password = deleteData.get("password");
            
            System.out.println("Account deletion request for email: " + email);

            // Validation
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required for account deletion"));
            }

            // Find user
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            System.out.println("Found user for deletion: " + user.getName() + " (" + user.getEmail() + ")");

            // Verify password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                System.out.println("Password verification failed for account deletion");
                return ResponseEntity.badRequest().body(Map.of("error", "Password is incorrect"));
            }

            // Prevent admin from deleting their own account if they're the only admin
            if (user.getRoles().stream().anyMatch(role -> role.getName().equals("ADMIN"))) {
                List<User> allAdmins = userRepository.findByRoleName("ADMIN");
                if (allAdmins.size() <= 1) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Cannot delete the last admin account"));
                }
            }

            userRepository.delete(user);
            System.out.println("Account deleted successfully for: " + email);

            return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
        } catch (Exception e) {
            System.out.println("Exception occurred during account deletion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete account: " + e.getMessage()));
        }
    }

    // Get own profile information
    @GetMapping("/info")
    public ResponseEntity<?> getProfileInfo(@RequestParam String email) {
        try {
            System.out.println("=== GET PROFILE INFO REQUEST ===");
            System.out.println("Profile info request for email: " + email);

            // Find user
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            System.out.println("Found user: " + user.getName() + " (" + user.getEmail() + ")");

            String userRole = user.getRoles().isEmpty() ? "USER" : 
                user.getRoles().iterator().next().getName();

            Map<String, Object> profileInfo = new HashMap<>();
            profileInfo.put("id", user.getId());
            profileInfo.put("name", user.getName());
            profileInfo.put("email", user.getEmail());
            profileInfo.put("role", userRole);

            return ResponseEntity.ok(profileInfo);
        } catch (Exception e) {
            System.out.println("Exception occurred while fetching profile info: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch profile info: " + e.getMessage()));
        }
    }
}
