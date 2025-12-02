package com.railway_reservation_system.Railway_Ticket_reservation_System.dto;

import java.util.List;

public record FoodOrderRequest(
        String bookingPnr,
        List<OrderItemDTO> items // Field name must be 'items'
) {
    // Inner record for item details
    public static record OrderItemDTO(
            Long foodItemId,
            int quantity
    ) {}
}

