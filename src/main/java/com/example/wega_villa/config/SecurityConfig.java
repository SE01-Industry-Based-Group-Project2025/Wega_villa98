package com.example.wega_villa.config;

import com.example.wega_villa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {    
    
    @Autowired
    private UserRepository userRepository;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }    @Bean
    public UserDetailsService userDetailsService() {
        return email -> userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow specific origins for better security
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",    // React development
            "http://localhost:3001",    // Alternative React port
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow REST API endpoints
                .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/test").permitAll()
                // Allow authenticated auth endpoints
                .requestMatchers("/api/auth/verify", "/api/auth/profile").hasAnyRole("USER", "ADMIN", "MANAGER", "TOUR_GUIDE")
                // Allow contact submission endpoint for public access
                .requestMatchers("/api/contact/**").permitAll()
                // Allow static resources and HTML templates
                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/*.html").permitAll()
                .requestMatchers("/").permitAll()
                // Event booking endpoints - allow USER, ADMIN, MANAGER roles
                .requestMatchers("/api/bookings/**").hasAnyRole("USER", "ADMIN", "MANAGER")
                // Allow profile endpoints for all authenticated users
                .requestMatchers("/api/profile/**").hasAnyRole("USER", "ADMIN", "MANAGER", "TOUR_GUIDE")
                // Tour guide management endpoints - allow manager and admin
                .requestMatchers(HttpMethod.POST, "/api/admin/tour-guides").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/admin/tour-guides").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/admin/tour-guides/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/tour-guides/**").hasAnyRole("MANAGER", "ADMIN")
                // Admin endpoints - restrict to admin only
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Manager endpoints - allow manager and admin
                .requestMatchers("/api/manager/**").hasAnyRole("MANAGER", "ADMIN")
                // Tour guide endpoints - allow tour guide, manager and admin
                .requestMatchers("/api/guide/**").hasAnyRole("TOUR_GUIDE", "MANAGER", "ADMIN")
                // Guide profile endpoints - allow public read, authenticated write
                .requestMatchers(HttpMethod.GET, "/api/guide-profile/all", "/api/guide-profile/guide/**", 
                                "/api/guide-profile/by-language/**", "/api/guide-profile/top-rated", 
                                "/api/guide-profile/search").permitAll()
                .requestMatchers("/api/guide-profile/**").hasAnyRole("TOUR_GUIDE", "ADMIN", "MANAGER")
                // Review endpoints - allow public read, authenticated write
                .requestMatchers(HttpMethod.GET, "/api/reviews/all", "/api/reviews/rating/**", 
                                "/api/reviews/statistics").permitAll()
                .requestMatchers("/api/reviews/**").hasAnyRole("USER", "ADMIN", "MANAGER", "TOUR_GUIDE")
                // Room endpoints - allow public read, manager/admin write
                .requestMatchers(HttpMethod.GET, "/api/rooms", "/api/rooms/available", 
                                "/api/rooms/type/**", "/api/rooms/{id}", "/api/rooms/types").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/rooms", "/api/rooms/types").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/rooms/**", "/api/rooms/types/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/rooms/**/availability").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/rooms/**", "/api/rooms/types/**").hasRole("ADMIN")
                // User endpoints - allow all authenticated users
                .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN", "MANAGER", "TOUR_GUIDE")
                .anyRequest().authenticated()
            )
            // Add JWT filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            // Remove form login for REST API
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(form -> form.disable());
        return http.build();
    }
}
