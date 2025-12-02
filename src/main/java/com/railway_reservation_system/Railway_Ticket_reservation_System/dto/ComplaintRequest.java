package com.railway_reservation_system.Railway_Ticket_reservation_System.dto;

import com.railway_reservation_system.Railway_Ticket_reservation_System.module.ComplaintType;

// DTO for submitting a complaint
public record ComplaintRequest(
        String bookingPnr,
        ComplaintType complaintType,
        String description
) {}
