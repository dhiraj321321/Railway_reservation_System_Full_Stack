package com.railway_reservation_system.Railway_Ticket_reservation_System.module;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString; // Import ToString

@Data
@Entity
@Table(name = "food_order_items")
// Exclude foodOrder from equals/hashCode AND toString to prevent infinite loops
@EqualsAndHashCode(exclude = "foodOrder")
@ToString(exclude = "foodOrder")
public class FoodOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Correct mapping for bidirectional relationship
    @ManyToOne(fetch = FetchType.LAZY) // Lazy fetch FoodOrder unless needed
    @JoinColumn(name = "food_order_id", nullable = false)
    private FoodOrder foodOrder; // Link back to the order

    @ManyToOne(fetch = FetchType.EAGER) // Eager fetch FoodItem details
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem; // Link to the menu item

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price; // Price per item at the time of order
}