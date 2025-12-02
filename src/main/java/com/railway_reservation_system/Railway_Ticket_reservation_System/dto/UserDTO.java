package com.railway_reservation_system.Railway_Ticket_reservation_System.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String email;

    // We can add more fields here if the frontend needs them
    // but NEVER the password
}