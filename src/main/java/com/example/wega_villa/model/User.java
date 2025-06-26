package com.example.wega_villa.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;    @Column(nullable = false, unique = true)
    private String email; // This will be the email for authentication

    @Column(nullable = false)
    private String name; // This will be the actual display name/username

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deactivated_at")
    private LocalDateTime deactivatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Enum for user status
    public enum UserStatus {
        ACTIVE, INACTIVE, DEACTIVATED
    }    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
      @Override
    public String getUsername() { return email; } // UserDetails interface requires getUsername()
    public void setUsername(String email) { this.email = email; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    @Override
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getDeactivatedAt() { return deactivatedAt; }
    public void setDeactivatedAt(LocalDateTime deactivatedAt) { this.deactivatedAt = deactivatedAt; }

    // Method to deactivate user (soft delete)
    public void deactivate() {
        this.status = UserStatus.DEACTIVATED;
        this.deactivatedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Method to reactivate user
    public void reactivate() {
        this.status = UserStatus.ACTIVE;
        this.deactivatedAt = null;
        this.updatedAt = LocalDateTime.now();
    }

    // Check if user is active
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }

    // UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());
        
        // Also add privileges as authorities
        Set<Privilege> privileges = roles.stream()
                .flatMap(role -> role.getPrivileges().stream())
                .collect(Collectors.toSet());
        
        privileges.forEach(privilege -> 
            authorities.add(new SimpleGrantedAuthority(privilege.getName()))
        );
        
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { 
        return this.status == UserStatus.ACTIVE; // Only active users are enabled
    }
}
