package com.railway_reservation_system.Railway_Ticket_reservation_System.dto;

import java.util.List;
import java.time.LocalDate;

public record BookingRequest(Long trainId, List<PassengerDTO> passengers,LocalDate journeyDate) {}