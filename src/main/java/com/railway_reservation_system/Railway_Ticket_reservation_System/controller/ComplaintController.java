package com.railway_reservation_system.Railway_Ticket_reservation_System.controller;

import com.railway_reservation_system.Railway_Ticket_reservation_System.dto.ComplaintRequest;
import com.railway_reservation_system.Railway_Ticket_reservation_System.dto.ComplaintResponseDTO; // Import
import com.railway_reservation_system.Railway_Ticket_reservation_System.dto.UserDTO; // Import
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.*;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.BookingRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.ComplaintRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.UserRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors; // Import

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private EmailService emailService;

    // --- THIS METHOD IS UPDATED TO RETURN A DTO ---
    @PostMapping
    public ResponseEntity<ComplaintResponseDTO> submitComplaint(@RequestBody ComplaintRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findByPnr(request.bookingPnr())
                .orElseThrow(() -> new RuntimeException("Booking not found for PNR: " + request.bookingPnr()));

        String trainId = booking.getTrain().getId().toString();
        LocalDate journeyDate = booking.getJourneyDate();

        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setBookingPnr(request.bookingPnr());
        complaint.setComplaintType(request.complaintType());
        complaint.setDescription(request.description());
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setTimestamp(LocalDateTime.now());
        complaint.setTrainId(trainId);
        complaint.setJourneyDate(journeyDate);

        Complaint savedComplaint = complaintRepository.save(complaint);

        // Send Email Notification
        notifyStaffByEmail(savedComplaint);

        return ResponseEntity.ok(convertToComplaintDTO(savedComplaint));
    }

    private void notifyStaffByEmail(Complaint complaint) {
        List<User> staffOnDuty = userRepository.findByAssignedTrainIdAndAssignedJourneyDate(
                complaint.getTrainId(),
                complaint.getJourneyDate()
        );

        if (staffOnDuty.isEmpty()) {
            System.err.println("No staff found for train " + complaint.getTrainId() + " on " + complaint.getJourneyDate());
            return;
        }

        String subject = String.format("New Complaint: %s on Train %s",
                complaint.getComplaintType(),
                complaint.getTrainId()
        );
        String body = String.format(
                "A new complaint has been submitted:\n\n" +
                        "Train: %s\n" +
                        "Date: %s\n" +
                        "PNR: %s\n" +
                        "Type: %s\n" +
                        "Description: %s\n\n" +
                        "Please log in to the staff dashboard to resolve.",
                complaint.getTrainId(),
                complaint.getJourneyDate(),
                complaint.getBookingPnr(),
                complaint.getComplaintType(),
                complaint.getDescription()
        );

        for (User staff : staffOnDuty) {
            if (staff.getEmail() != null && !staff.getEmail().isEmpty()) {
                emailService.sendEmail(staff.getEmail(), subject, body);
            }
        }
    }

    // --- THIS METHOD IS UPDATED TO RETURN A DTO ---
    @GetMapping("/my")
    public List<ComplaintResponseDTO> getMyComplaints() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Complaint> complaints = complaintRepository.findByUserId(user.getId());

        // --- Manually convert Entities to DTOs ---
        List<ComplaintResponseDTO> complaintDTOs = complaints.stream()
                .map(this::convertToComplaintDTO)
                .collect(Collectors.toList());

        return complaintDTOs;
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