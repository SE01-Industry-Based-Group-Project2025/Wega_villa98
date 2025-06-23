package com.example.wega_villa.config;

import com.example.wega_villa.model.Role;
import com.example.wega_villa.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            String[] roles = {"ADMIN", "USER", "TOUR_GUIDE", "MANAGER"};
            for (String roleName : roles) {
                if (!roleRepository.findByName(roleName).isPresent()) {
                    Role role = new Role();
                    role.setName(roleName);
                    roleRepository.save(role);
                }
            }
        };
    }
}
