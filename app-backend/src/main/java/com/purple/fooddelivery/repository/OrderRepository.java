package com.purple.fooddelivery.repository;

import com.purple.fooddelivery.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // For the "My Orders" button (User mapping is named 'customer' in the entity)
    List<Order> findByCustomerId(Long customerId);

    // For the Restaurant Dashboard to see their incoming/past orders
    List<Order> findByRestaurantId(Long restaurantId);

    // For finding a specific order by its Razorpay transaction ID
    Order findByRazorpayPaymentId(String paymentId);

}

