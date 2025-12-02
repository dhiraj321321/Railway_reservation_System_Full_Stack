package com.railway_reservation_system.Railway_Ticket_reservation_System.controller;

import com.railway_reservation_system.Railway_Ticket_reservation_System.dto.ComplaintResponseDTO; // Import
import com.railway_reservation_system.Railway_Ticket_reservation_System.dto.UserDTO; // Import
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Complaint;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.ComplaintStatus;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.User;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.ComplaintRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors; // Import

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    // --- THIS METHOD IS UPDATED TO RETURN A DTO ---
    @GetMapping("/my-complaints")
    @PreAuthorize("hasAnyRole('ROLE_TTE', 'ROLE_POLICE')") // Use full role name
    public ResponseEntity<List<ComplaintResponseDTO>> getMyAssignedComplaints() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User staff = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Staff user not found"));

        String trainId = staff.getAssignedTrainId();
        LocalDate journeyDate = staff.getAssignedJourneyDate();

        if (trainId == null || journeyDate == null) {
            return ResponseEntity.ok(List.of());
        }

        List<Complaint> complaints = complaintRepository.findByTrainIdAndJourneyDate(trainId, journeyDate);

        // --- Manually convert Entities to DTOs ---
        List<ComplaintResponseDTO> complaintDTOs = complaints.stream()
                .map(this::convertToComplaintDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(complaintDTOs);
    }

    // --- THIS METHOD IS UPDATED TO RETURN A DTO ---
    @PutMapping("/complaints/{id}/resolve")
    @PreAuthorize("hasAnyRole('ROLE_TTE', 'ROLE_POLICE', 'ROLE_ADMIN')") // Use full role name
    public ResponseEntity<ComplaintResponseDTO> resolveComplaint(@PathVariable Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(ComplaintStatus.RESOLVED);
        Complaint updatedComplaint = complaintRepository.save(complaint);

        return ResponseEntity.ok(convertToComplaintDTO(updatedComplaint));
    }

    // --- Helper method to convert Entity to DTO ---
    private ComplaintResponseDTO convertToComplaintDTO(Complaint complaint) {
        // Create the DTO for the user who filed the complaint
        UserDTO userDTO = new UserDTO();
        userDTO.setName(complaint.getUser().getName());
        userDTO.setEmail(complaint.getUser().getEmail());

        // Create the main Complaint DTO
        ComplaintResponseDTO dto = new ComplaintResponseDTO();
        dto.setId(complaint.getId());
        dto.setBookingPnr(complaint.getBookingPnr());
        dto.setComplaintType(complaint.getComplaintType());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus());
        dto.setTimestamp(complaint.getTimestamp());
        dto.setTrainId(complaint.getTrainId());
        dto.setJourneyDate(complaint.getJourneyDate());
        dto.setUser(userDTO); // Set the safe User DTO

        return dto;
    }
}