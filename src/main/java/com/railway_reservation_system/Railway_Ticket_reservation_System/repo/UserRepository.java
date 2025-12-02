package com.railway_reservation_system.Railway_Ticket_reservation_System.repo;

import com.railway_reservation_system.Railway_Ticket_reservation_System.module.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate; // Import
import java.util.List; // Import
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // --- NEW METHOD ---
    List<User> findByAssignedTrainIdAndAssignedJourneyDate(String trainId, LocalDate journeyDate);
}