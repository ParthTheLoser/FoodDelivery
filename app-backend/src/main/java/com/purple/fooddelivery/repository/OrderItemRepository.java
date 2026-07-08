package com.purple.fooddelivery.repository;

import com.purple.fooddelivery.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Fetch all specific food items inside a single order
    List<OrderItem> findByOrderId(Long orderId);
}
