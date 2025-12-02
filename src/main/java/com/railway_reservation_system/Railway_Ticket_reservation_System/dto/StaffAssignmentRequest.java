package com.railway_reservation_system.Railway_Ticket_reservation_System.dto;

import java.time.LocalDate;

public record StaffAssignmentRequest(
        String staffEmail,
        String trainId,
        LocalDate journeyDate
) {}