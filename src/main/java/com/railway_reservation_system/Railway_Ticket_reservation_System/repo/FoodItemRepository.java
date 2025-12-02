package com.railway_reservation_system.Railway_Ticket_reservation_System.repo;

import com.railway_reservation_system.Railway_Ticket_reservation_System.module.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    // Find only available food items
    List<FoodItem> findByAvailableTrue();
}
