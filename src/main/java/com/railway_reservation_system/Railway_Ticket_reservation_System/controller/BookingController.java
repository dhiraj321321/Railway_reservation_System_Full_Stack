package com.railway_reservation_system.Railway_Ticket_reservation_System.controller;

import com.railway_reservation_system.Railway_Ticket_reservation_System.dto.BookingRequest;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Booking;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Passenger;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Train;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.User;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.BookingRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.TrainRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;
import java.time.LocalDate;


@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TrainRepository trainRepository;

    @GetMapping("/my-bookings")
    public List<Booking> getMyBookings() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return bookingRepository.findByUserId(user.getId());
    }

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest bookingRequest) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Train train = trainRepository.findById(bookingRequest.trainId()).orElseThrow();

        List<Passenger> passengers = bookingRequest.passengers().stream().map(p -> {
            Passenger passenger = new Passenger();
            passenger.setName(p.name());
            passenger.setAge(p.age());
            passenger.setGender(p.gender());
            return passenger;
        }).collect(Collectors.toList());

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTrain(train);
        booking.setPassengers(passengers);
        booking.setStatus("CONFIRMED");
        booking.setPnr(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setJourneyDate(bookingRequest.journeyDate());

        return bookingRepository.save(booking);
    }
}