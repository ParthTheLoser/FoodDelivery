package com.purple.fooddelivery.service;

import com.purple.fooddelivery.entity.*;
import com.purple.fooddelivery.dto.OrderItemDTO;
import com.purple.fooddelivery.repository.MenuItemRepository;
import com.purple.fooddelivery.repository.OrderRepository;
import com.purple.fooddelivery.repository.RestaurantRepository;
import com.purple.fooddelivery.repository.UserRepository;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RestaurantRepository restaurantRepo;

    @Autowired
    private MenuItemRepository menuRepo;

    @Override
    @Transactional
    public Order createOrder(Long userId, Long restaurantId, List<OrderItemDTO> items) throws Exception {
        User user = userRepo.findById(userId).orElseThrow();
        Restaurant restaurant = restaurantRepo.findById(restaurantId).orElseThrow();

        // 1. Calculate Total Amount Securely
        double totalAmount = 0.0;
        java.util.List<OrderItem> orderItems = new java.util.ArrayList<>();
        for (OrderItemDTO itemDto : items) {
            MenuItem menuItem = menuRepo.findById(itemDto.getMenuItemId()).orElseThrow();
            OrderItem item = new OrderItem();
            item.setPriceAtPurchase(menuItem.getPrice()); // Lock in the current price
            item.setQuantity(itemDto.getQuantity());
            totalAmount += (menuItem.getPrice() * item.getQuantity());
            item.setMenuItem(menuItem);
            orderItems.add(item);
        }

        // 2. Create Razorpay Order
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (totalAmount * 100)); // Razorpay uses paise
        orderRequest.put("currency", "INR");
        com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);

        // 3. Save to Database
        Order order = new Order();
        order.setCustomer(user);
        order.setRestaurant(restaurant);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        order.setRazorpayPaymentId(razorpayOrder.get("id"));

        // Link items to the order
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setOrderItems(orderItems);

        return orderRepo.save(order);
    }

    @Override
    @Transactional
    public Order updateOrderStatusSecurely(Long ownerId, Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Verify that the order belongs to a restaurant owned by the person logged in
        if (!order.getRestaurant().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Access Denied: This order does not belong to your restaurant");
        }

        order.setStatus(status);
        return orderRepo.save(order);
    }

    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepo.findByCustomerId(userId);
    }
}

