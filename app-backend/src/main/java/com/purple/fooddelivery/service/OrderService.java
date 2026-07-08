package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.OrderItemDTO;
import com.purple.fooddelivery.entity.Order;
import com.purple.fooddelivery.entity.OrderItem;

import java.util.List;

public interface OrderService {

    Order createOrder(Long userId, Long restaurantId, List<OrderItemDTO> items) throws Exception;

    Order updateOrderStatusSecurely(Long ownerId, Long orderId, String status);

    List<Order> getUserOrders(Long userId);

}

