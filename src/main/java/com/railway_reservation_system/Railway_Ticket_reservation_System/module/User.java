package com.railway_reservation_system.Railway_Ticket_reservation_System.module;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "app_users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String assignedTrainId;
    private LocalDate assignedJourneyDate;

    // --- THIS IS THE CORRECTED METHOD ---
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Spring Security's "hasRole('ADMIN')" check looks for "ROLE_ADMIN"
        // This adds the required "ROLE_" prefix to our role name.
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    // --- END OF FIX ---

    @Override
    public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}