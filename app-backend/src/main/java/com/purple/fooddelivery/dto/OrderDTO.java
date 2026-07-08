package com.purple.fooddelivery.dto;

import lombok.Value;

import java.time.LocalDateTime;
import java.util.List;

@Value
public class OrderDTO {
    Long id;
    Double totalAmount;
    String status;
    String razorpayPaymentId;
    LocalDateTime createdAt;
    String restaurantName;
    List<OrderItemDTO> items;
}

