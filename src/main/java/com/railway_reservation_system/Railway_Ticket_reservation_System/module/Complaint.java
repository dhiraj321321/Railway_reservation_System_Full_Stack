package com.railway_reservation_system.Railway_Ticket_reservation_System.module;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate; // Import LocalDate
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "complaints")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false)
    private String bookingPnr;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintType complaintType;
    @Column(length = 1000)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status = ComplaintStatus.PENDING;
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    // --- NEW FIELDS ---
    @Column(nullable = false)
    private String trainId;
    @Column(nullable = false)
    private LocalDate journeyDate;
    // --- END NEW FIELDS ---
}