package com.railway_reservation_system.Railway_Ticket_reservation_System.repo;

import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {
    List<Train> findByFromStationAndToStation(String fromStation, String toStation);
}