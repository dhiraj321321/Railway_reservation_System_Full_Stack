package com.railway_reservation_system.Railway_Ticket_reservation_System.dto;

import com.railway_reservation_system.Railway_Ticket_reservation_System.module.ComplaintStatus;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.ComplaintType;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ComplaintResponseDTO {
    private Long id;
    private String bookingPnr;
    private ComplaintType complaintType;
    private String description;
    private ComplaintStatus status;
    private LocalDateTime timestamp;
    private String trainId;
    private LocalDate journeyDate;
    private UserDTO user; // Send the safe UserDTO, not the full User entity
}