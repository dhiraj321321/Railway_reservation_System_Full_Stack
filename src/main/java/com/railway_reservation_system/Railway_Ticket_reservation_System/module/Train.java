package com.railway_reservation_system.Railway_Ticket_reservation_System.module;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "trains")
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(name = "from_station")
    private String fromStation;
    @Column(name = "to_station")
    private String toStation;
    private String departure;
    private String arrival;
    private String duration;
    private double price;
    private int seatsAvailable;
}
