package com.railway_reservation_system.Railway_Ticket_reservation_System.repo;

import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional; // Import

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    // --- NEW METHOD ---
    Optional<Booking> findByPnr(String pnr);
}