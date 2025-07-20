package com.example.wega_villa.config;

import com.example.wega_villa.service.SessionService;
import com.example.wega_villa.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private SessionService sessionService;    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        final String sessionHeader = request.getHeader("X-Session-Id");
        
        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("JWT Token validation error: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, username)) {
                // Additional session validation for ADMIN/MANAGER users
                boolean sessionValid = true;
                
                if (sessionHeader != null && !sessionHeader.isEmpty()) {
                    // Check if session is still valid
                    sessionValid = sessionService.isSessionValid(sessionHeader);
                    
                    if (sessionValid) {
                        // Update heartbeat to keep session alive
                        sessionService.updateHeartbeat(sessionHeader);
                    } else {
                        logger.warn("Invalid or expired session: " + sessionHeader + " for user: " + username);
                    }
                }
                
                if (sessionValid) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken
                            .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                } else {
                    // Session invalid - don't authenticate
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\":\"Session expired. Please log in again.\",\"code\":\"SESSION_EXPIRED\"}");
                    response.setContentType("application/json");
                    return;
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
