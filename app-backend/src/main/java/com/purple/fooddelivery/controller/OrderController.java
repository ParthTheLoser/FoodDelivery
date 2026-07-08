package com.purple.fooddelivery.controller;

import com.purple.fooddelivery.dto.OrderDTO;
import com.purple.fooddelivery.dto.OrderItemDTO;
import com.purple.fooddelivery.entity.Order;
import com.purple.fooddelivery.entity.User;
import com.purple.fooddelivery.mapper.OrderMapper;
import com.purple.fooddelivery.repository.UserRepository;
import com.purple.fooddelivery.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired private UserRepository userRepo;

    // Helper to get logged-in user securely
    private User getAuthenticatedUser(Principal principal) {
        return userRepo.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/checkout/{restaurantId}")
    public ResponseEntity<?> checkout(Principal principal, @PathVariable Long restaurantId, @RequestBody List<OrderItemDTO> cartItems) {
        try {
            User user = getAuthenticatedUser(principal);
            Order savedOrder = orderService.createOrder(user.getId(), restaurantId, cartItems);
            return ResponseEntity.ok(OrderMapper.mapToOrderDTO(savedOrder));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Principal principal) {
        User user = getAuthenticatedUser(principal);

        // Map the entire list of user orders to DTOs
        List<OrderDTO> orderDTOs = orderService.getUserOrders(user.getId())
                .stream()
                .map(OrderMapper::mapToOrderDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }
}


