package com.railway_reservation_system.Railway_Ticket_reservation_System.repo;

import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate; // Import
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserId(Long userId);

    // --- NEW METHOD ---
    List<Complaint> findByTrainIdAndJourneyDate(String trainId, LocalDate journeyDate);
}