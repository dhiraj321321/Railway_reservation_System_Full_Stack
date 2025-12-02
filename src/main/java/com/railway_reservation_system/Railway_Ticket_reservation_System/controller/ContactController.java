package com.railway_reservation_system.Railway_Ticket_reservation_System.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    // Return static contact information
    @GetMapping
    public ResponseEntity<Map<String, String>> getContacts() {
        // In a real app, these might come from config or a database
        Map<String, String> contacts = Map.of(
                "Railway Police (RPF)", "139", // Example number
                "General Enquiry", "139", // Example number
                "TTE Contact (Onboard)", "Ask attendant for TTE" // General advice
        );
        return ResponseEntity.ok(contacts);
    }
}