package com.railway_reservation_system.Railway_Ticket_reservation_System.controller;

import com.railway_reservation_system.Railway_Ticket_reservation_System.dto.RegistrationRequest;
import com.railway_reservation_system.Railway_Ticket_reservation_System.dto.StaffAssignmentRequest;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Role;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.User;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create-staff")
    public ResponseEntity<User> createStaff(@RequestBody RegistrationRequest request, @RequestParam Role role) {
        if (role == Role.USER || role == Role.ADMIN) {
            return ResponseEntity.badRequest().build(); // Admin can only create TTE or POLICE
        }
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.status(409).build(); // Conflict, email exists
        }

        User staff = new User();
        staff.setName(request.name());
        staff.setEmail(request.email());
        staff.setPassword(passwordEncoder.encode(request.password()));
        staff.setRole(role);
        // Phone number would be added via a separate 'updateProfile' endpoint, not here

        User savedStaff = userRepository.save(staff);
        return ResponseEntity.ok(savedStaff);
    }

    @PostMapping("/assign-staff")
    public ResponseEntity<User> assignStaffToTrain(@RequestBody StaffAssignmentRequest request) {
        User staff = userRepository.findByEmail(request.staffEmail())
                .orElseThrow(() -> new RuntimeException("Staff user not found"));

        if (staff.getRole() != Role.TTE && staff.getRole() != Role.POLICE) {
            return ResponseEntity.badRequest().build(); // Can only assign TTE or POLICE
        }

        staff.setAssignedTrainId(request.trainId());
        staff.setAssignedJourneyDate(request.journeyDate());

        User updatedStaff = userRepository.save(staff);
        return ResponseEntity.ok(updatedStaff);
    }
}