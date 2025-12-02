package com.railway_reservation_system.Railway_Ticket_reservation_System.controller;

import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Train;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trains")
public class TrainController {

    @Autowired
    private TrainRepository trainRepository;

    @GetMapping
    public List<Train> getTrains(@RequestParam(required = false) String from, @RequestParam(required = false) String to) {
        if (from != null && to != null) {
            return trainRepository.findByFromStationAndToStation(from, to);
        }
        return trainRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Train addTrain(@RequestBody Train train) {
        return trainRepository.save(train);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cancelTrain(@PathVariable Long id) {
        trainRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}