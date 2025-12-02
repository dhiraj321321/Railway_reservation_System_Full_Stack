package com.railway_reservation_system.Railway_Ticket_reservation_System.controller;

// --- Add Map and Set imports here ---
import java.util.Map;
import java.util.Set;
// --- End imports ---

import com.railway_reservation_system.Railway_Ticket_reservation_System.dto.FoodOrderRequest;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.*; // Import all from module
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.FoodItemRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.FoodOrderRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList; // Keep ArrayList import

@RestController
@RequestMapping("/api/food")
public class FoodController {

    @Autowired private FoodItemRepository foodItemRepository;
    @Autowired private FoodOrderRepository foodOrderRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping("/menu")
    public List<FoodItem> getMenu() {
        return foodItemRepository.findAll();
    }

    @PostMapping("/order")
    public ResponseEntity<FoodOrder> placeOrder(@RequestBody FoodOrderRequest orderRequest) {
        // --- Input Validation ---
        if (orderRequest == null || orderRequest.bookingPnr() == null || orderRequest.bookingPnr().isEmpty() ||
                orderRequest.items() == null || orderRequest.items().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Map<Long, Integer> itemQuantities = orderRequest.items().stream()
                .filter(item -> item.quantity() > 0)
                .collect(Collectors.toMap(
                        FoodOrderRequest.OrderItemDTO::foodItemId,
                        FoodOrderRequest.OrderItemDTO::quantity,
                        (q1, q2) -> q1 + q2 // Sum quantities if same item ID sent twice
                ));

        if (itemQuantities.isEmpty()) {
            return ResponseEntity.badRequest().build(); // No valid items
        }

        Set<Long> requestedItemIds = itemQuantities.keySet();
        List<FoodItem> orderedFoodItems = foodItemRepository.findAllById(requestedItemIds);

        // Verify all requested items exist
        if (orderedFoodItems.size() != requestedItemIds.size()) {
            Set<Long> foundIds = orderedFoodItems.stream().map(FoodItem::getId).collect(Collectors.toSet());
            requestedItemIds.removeAll(foundIds);
            System.err.println("Food items not found: " + requestedItemIds);
            throw new RuntimeException("One or more food items not found.");
        }

        // --- Start of Explicit Two-Step Save Logic ---

        // 1. Create the FoodOrder shell (without items added yet)
        FoodOrder foodOrder = new FoodOrder();
        foodOrder.setUser(user);
        foodOrder.setBookingPnr(orderRequest.bookingPnr());
        foodOrder.setStatus(FoodOrderStatus.ORDERED);
        foodOrder.setTimestamp(LocalDateTime.now());
        // Price will be calculated and set later

        // 2. Create FoodOrderItem entities (don't set the foodOrder reference yet)
        final double[] calculatedTotalPrice = {0.0};
        List<FoodOrderItem> orderItems = orderedFoodItems.stream().map(foodItem -> {
            int quantity = itemQuantities.get(foodItem.getId());
            calculatedTotalPrice[0] += foodItem.getPrice() * quantity;

            FoodOrderItem orderItem = new FoodOrderItem();
            orderItem.setFoodItem(foodItem);
            orderItem.setQuantity(quantity);
            orderItem.setPrice(foodItem.getPrice());
            // Intentionally DO NOT set foodOrder here
            return orderItem;
        }).collect(Collectors.toList());

        // 3. Set the calculated total price on the order shell
        foodOrder.setTotalPrice(calculatedTotalPrice[0]);

        // 4. Save the FoodOrder FIRST - This generates the ID
        FoodOrder savedOrderShell = foodOrderRepository.save(foodOrder);

        // 5. Now, iterate through the items and set the reference to the SAVED order
        for (FoodOrderItem item : orderItems) {
            item.setFoodOrder(savedOrderShell);
        }

        // 6. Add the fully linked items to the SAVED order's list
        //    (Using the getter then addAll ensures the managed list is modified)
        savedOrderShell.getItems().addAll(orderItems);


        // 7. Save the order AGAIN. Hibernate will detect the changes to the 'items' collection
        //    and now cascade the save to the FoodOrderItems, which have the correct foreign key.
        FoodOrder finalOrder = foodOrderRepository.save(savedOrderShell);

        // --- End of Explicit Two-Step Save Logic ---

        return ResponseEntity.ok(finalOrder);
    }


    @GetMapping("/my-orders")
    public List<FoodOrder> getMyFoodOrders() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        return foodOrderRepository.findByUserId(user.getId());
    }
}