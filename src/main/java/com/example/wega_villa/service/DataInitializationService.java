package com.example.wega_villa.service;

import com.example.wega_villa.model.Privilege;
import com.example.wega_villa.model.Role;
import com.example.wega_villa.model.User;
import com.example.wega_villa.repository.PrivilegeRepository;
import com.example.wega_villa.repository.RoleRepository;
import com.example.wega_villa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class DataInitializationService {

    @Autowired
    private PrivilegeRepository privilegeRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initData() {
        createPrivilegesIfNotFound();
        createRolesIfNotFound();
        createAdminUserIfNotFound();
    }    private void createPrivilegesIfNotFound() {
        String[] privilegeNames = {
            // ADMIN privileges - unrestricted access to all functionalities
            "MANAGE_ALL_USERS", "MANAGE_ALL_TOURS", "MANAGE_ALL_BOOKINGS", "MANAGE_ALL_MANAGER",
            "MANAGE_ALL_EVENTS", "DELETE_ANY_DATA", "VIEW_ALL_REPORTS",
            "SYSTEM_CONFIGURATION", "MANAGE_ROLES_PRIVILEGES", "ADMIN_DASHBOARD_ACCESS",
            
            // MANAGER privileges - departmental management
            "ADD_TOUR_GUIDE", "MANAGE_TOUR_GUIDES", "DELETE_TOUR_GUIDE",
            "VIEW_BOOKINGS", "DELETE_BOOKING", "MODIFY_BOOKING_STATUS", 
            "VIEW_EVENT_BOOKINGS", "DELETE_EVENT_BOOKING", "MODIFY_EVENT_BOOKING",
            "MANAGE_ROOM_PACKAGES", "MANAGE_EVENT_PACKAGES", "CREATE_PACKAGES",
            "VIEW_USER_REQUESTS", "MANAGE_USER_REQUESTS", "APPROVE_REQUESTS",
            "VIEW_DEPARTMENTAL_REPORTS", "MANAGER_DASHBOARD_ACCESS",
            
            // GUIDE privileges - tour and client management
            "MANAGE_OWN_PROFILE", "UPDATE_GUIDE_PROFILE", 
            "MANAGE_OWN_TOURS", "CREATE_TOUR_PACKAGES", "UPDATE_TOUR_PACKAGES", "DELETE_OWN_TOURS",
            "VIEW_OWN_REVIEWS", "RESPOND_TO_REVIEWS", "VIEW_TOUR_STATISTICS",
            "VIEW_MESSAGES", "RESPOND_TO_MESSAGES", "SEND_MESSAGES",
            "UPDATE_TOUR_STATUS", "VIEW_OWN_BOOKINGS", "GUIDE_DASHBOARD_ACCESS",
            
            // USER privileges - booking and personal management
            "BOOK_ROOMS", "BOOK_EVENTS", "BOOK_TOURS", "VIEW_AVAILABLE_PACKAGES",
            "VIEW_OWN_BOOKINGS", "CANCEL_OWN_BOOKING", "MODIFY_OWN_BOOKING",
            "LEAVE_REVIEWS", "EDIT_OWN_REVIEWS", "DELETE_OWN_REVIEWS",
            "SEND_MESSAGES", "VIEW_OWN_MESSAGES", "UPDATE_OWN_PROFILE", 
            "VIEW_OWN_PROFILE", "SUBMIT_REQUESTS", "USER_DASHBOARD_ACCESS",
            
            // Common privileges
            "READ_PUBLIC_CONTENT", "VIEW_AVAILABLE_TOURS", "SEARCH_CONTENT"
        };

        for (String name : privilegeNames) {
            if (privilegeRepository.findByName(name).isEmpty()) {
                Privilege privilege = new Privilege();
                privilege.setName(name);
                privilegeRepository.save(privilege);
            }
        }
    }    
    private void createRolesIfNotFound() {
        // Create ADMIN role - unrestricted access to all functionalities
        createRoleIfNotFound("ADMIN", Arrays.asList(
            // All privileges for admin - complete system access
            "MANAGE_ALL_USERS", "MANAGE_ALL_TOURS", "MANAGE_ALL_BOOKINGS", 
            "MANAGE_ALL_EVENTS", "DELETE_ANY_DATA", "VIEW_ALL_REPORTS",
            "SYSTEM_CONFIGURATION", "MANAGE_ROLES_PRIVILEGES", "ADMIN_DASHBOARD_ACCESS",
            "ADD_TOUR_GUIDE", "MANAGE_TOUR_GUIDES", "DELETE_TOUR_GUIDE",
            "VIEW_BOOKINGS", "DELETE_BOOKING", "MODIFY_BOOKING_STATUS", 
            "VIEW_EVENT_BOOKINGS", "DELETE_EVENT_BOOKING", "MODIFY_EVENT_BOOKING",
            "MANAGE_ROOM_PACKAGES", "MANAGE_EVENT_PACKAGES", "CREATE_PACKAGES",
            "VIEW_USER_REQUESTS", "MANAGE_USER_REQUESTS", "APPROVE_REQUESTS",
            "VIEW_DEPARTMENTAL_REPORTS", "MANAGER_DASHBOARD_ACCESS",
            "MANAGE_OWN_PROFILE", "UPDATE_GUIDE_PROFILE", 
            "MANAGE_OWN_TOURS", "CREATE_TOUR_PACKAGES", "UPDATE_TOUR_PACKAGES", "DELETE_OWN_TOURS",
            "VIEW_OWN_REVIEWS", "RESPOND_TO_REVIEWS", "VIEW_TOUR_STATISTICS",
            "VIEW_MESSAGES", "RESPOND_TO_MESSAGES", "SEND_MESSAGES",
            "UPDATE_TOUR_STATUS", "VIEW_OWN_BOOKINGS", "GUIDE_DASHBOARD_ACCESS",
            "BOOK_ROOMS", "BOOK_EVENTS", "BOOK_TOURS", "VIEW_AVAILABLE_PACKAGES",
            "CANCEL_OWN_BOOKING", "MODIFY_OWN_BOOKING", "LEAVE_REVIEWS", 
            "EDIT_OWN_REVIEWS", "DELETE_OWN_REVIEWS", "VIEW_OWN_MESSAGES", 
            "UPDATE_OWN_PROFILE", "VIEW_OWN_PROFILE", "SUBMIT_REQUESTS", 
            "USER_DASHBOARD_ACCESS", "READ_PUBLIC_CONTENT", "VIEW_AVAILABLE_TOURS", "SEARCH_CONTENT"
        ));

        // Create MANAGER role - can manage tour guides, bookings, packages, and user requests
        createRoleIfNotFound("MANAGER", Arrays.asList(
            "ADD_TOUR_GUIDE", "MANAGE_TOUR_GUIDES", "DELETE_TOUR_GUIDE",
            "VIEW_BOOKINGS", "DELETE_BOOKING", "MODIFY_BOOKING_STATUS", 
            "VIEW_EVENT_BOOKINGS", "DELETE_EVENT_BOOKING", "MODIFY_EVENT_BOOKING",
            "MANAGE_ROOM_PACKAGES", "MANAGE_EVENT_PACKAGES", "CREATE_PACKAGES",
            "VIEW_USER_REQUESTS", "MANAGE_USER_REQUESTS", "APPROVE_REQUESTS",
            "VIEW_DEPARTMENTAL_REPORTS", "MANAGER_DASHBOARD_ACCESS",
            "UPDATE_OWN_PROFILE", "VIEW_OWN_PROFILE", "SEND_MESSAGES", "VIEW_MESSAGES",
            "READ_PUBLIC_CONTENT", "VIEW_AVAILABLE_TOURS", "SEARCH_CONTENT"
        ));        // Create TOUR_GUIDE role - can manage profile, tours, reviews, and messages
        createRoleIfNotFound("TOUR_GUIDE", Arrays.asList(
            "MANAGE_OWN_PROFILE", "UPDATE_GUIDE_PROFILE", 
            "MANAGE_OWN_TOURS", "CREATE_TOUR_PACKAGES", "UPDATE_TOUR_PACKAGES", "DELETE_OWN_TOURS",
            "VIEW_OWN_REVIEWS", "RESPOND_TO_REVIEWS", "VIEW_TOUR_STATISTICS",
            "VIEW_MESSAGES", "RESPOND_TO_MESSAGES", "SEND_MESSAGES",
            "UPDATE_TOUR_STATUS", "VIEW_OWN_BOOKINGS", "GUIDE_DASHBOARD_ACCESS",
            "READ_PUBLIC_CONTENT", "VIEW_AVAILABLE_TOURS", "SEARCH_CONTENT"
        ));

        // Create USER role - can book services, manage own profile, and leave reviews
        createRoleIfNotFound("USER", Arrays.asList(
            "BOOK_ROOMS", "BOOK_EVENTS", "BOOK_TOURS", "VIEW_AVAILABLE_PACKAGES",
            "VIEW_OWN_BOOKINGS", "CANCEL_OWN_BOOKING", "MODIFY_OWN_BOOKING",
            "LEAVE_REVIEWS", "EDIT_OWN_REVIEWS", "DELETE_OWN_REVIEWS",
            "SEND_MESSAGES", "VIEW_OWN_MESSAGES", "UPDATE_OWN_PROFILE", 
            "VIEW_OWN_PROFILE", "SUBMIT_REQUESTS", "USER_DASHBOARD_ACCESS",
            "READ_PUBLIC_CONTENT", "VIEW_AVAILABLE_TOURS", "SEARCH_CONTENT"
        ));
    }

    private void createRoleIfNotFound(String roleName, java.util.List<String> privilegeNames) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            
            Set<Privilege> privileges = new HashSet<>();
            for (String privilegeName : privilegeNames) {
                privilegeRepository.findByName(privilegeName).ifPresent(privileges::add);
            }
            role.setPrivileges(privileges);
            
            roleRepository.save(role);
        }
    }    
    private void createAdminUserIfNotFound() {
        if (userRepository.findByEmail("admin@wega.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@wega.com");
            admin.setName("Administrator"); // Add the name field
            admin.setPassword(passwordEncoder.encode("admin123"));
            
            Set<Role> adminRoles = new HashSet<>();
            roleRepository.findByName("ADMIN").ifPresent(adminRoles::add);
            admin.setRoles(adminRoles);
            
            userRepository.save(admin);
        }
    }
}
