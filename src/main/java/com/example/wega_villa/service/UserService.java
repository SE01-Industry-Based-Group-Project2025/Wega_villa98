package com.example.wega_villa.service;

import com.example.wega_villa.model.Role;
import com.example.wega_villa.model.User;
import com.example.wega_villa.repository.RoleRepository;
import com.example.wega_villa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;    
    public User registerNewUser(String email, String name, String password, Set<String> roleNames) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(email); // Email is used for authentication
        user.setName(name); // Display name
        user.setPassword(passwordEncoder.encode(password));
        
        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            roles.add(role);
        }
        user.setRoles(roles);
        return userRepository.save(user);
    }

    // Overloaded method for backward compatibility
    public User registerNewUser(String email, String password, Set<String> roleNames) {
        return registerNewUser(email, email, password, roleNames);
    }
}
