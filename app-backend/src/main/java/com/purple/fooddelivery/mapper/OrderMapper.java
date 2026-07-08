package com.purple.fooddelivery.mapper;

import com.purple.fooddelivery.dto.OrderDTO;
import com.purple.fooddelivery.dto.OrderItemDTO;
import com.purple.fooddelivery.entity.Order;

import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {
    public static OrderDTO mapToOrderDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        item.getMenuItem().getId(),
                        item.getMenuItem().getName(),
                        item.getQuantity(),
                        item.getPriceAtPurchase()
                ))
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getRazorpayPaymentId(),
                order.getCreatedAt(),
                order.getRestaurant().getName(),
                itemDTOs
        );
    }
}
