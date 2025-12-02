package com.railway_reservation_system.Railway_Ticket_reservation_System.module;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList; // Import ArrayList
import java.util.List;

@Data
@Entity
@Table(name = "food_orders")
public class FoodOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Lazy fetch User unless needed
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String bookingPnr;

    // Correct mapping for bidirectional relationship
    @OneToMany(mappedBy = "foodOrder", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<FoodOrderItem> items = new ArrayList<>(); // Initialize the list

    @Column(nullable = false)
    private double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodOrderStatus status = FoodOrderStatus.ORDERED;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    // Helper method to add items and maintain consistency
    public void addItem(FoodOrderItem item) {
        items.add(item);
        item.setFoodOrder(this);
    }
    // Helper method might be needed if you remove items dynamically later
    public void removeItem(FoodOrderItem item) {
        items.remove(item);
        item.setFoodOrder(null);
    }
}