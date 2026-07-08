package com.purple.fooddelivery.controller;

import com.purple.fooddelivery.dto.MenuItemDTO;
import com.purple.fooddelivery.dto.OrderDTO;
import com.purple.fooddelivery.dto.RestaurantDTO;
import com.purple.fooddelivery.entity.MenuItem;
import com.purple.fooddelivery.mapper.MenuMapper;
import com.purple.fooddelivery.mapper.OrderMapper;
import com.purple.fooddelivery.mapper.RestaurantMapper;
import com.purple.fooddelivery.service.OrderService;
import com.purple.fooddelivery.service.RestaurantService;
import com.purple.fooddelivery.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    // --- Helper to get Authenticated Owner ---
    private Long getAuthenticatedOwnerId(Principal principal) {
        return userService.getAuthenticatedOwnerId(principal.getName());
    }

    // --- Endpoints ---

    @PostMapping(value = "/{restaurantId}/menu", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemDTO> addMenuItem(
            Principal principal,
            @PathVariable Long restaurantId,
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam boolean isVeg,
            @RequestParam Double price,
            @RequestParam(required = false) MultipartFile image) throws IOException {

        MenuItem item = new MenuItem();
        item.setName(name);
        item.setCategory(category);
        item.setVeg(isVeg);
        item.setPrice(price);

        return ResponseEntity.ok(MenuMapper.mapToMenuItemDTO(
                restaurantService.addMenuItem(getAuthenticatedOwnerId(principal), restaurantId, item, image)));
    }

    @PutMapping(value = "/{restaurantId}/menu/{menuItemId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemDTO> updateMenuItem(
            Principal principal,
            @PathVariable Long restaurantId,
            @PathVariable Long menuItemId,
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam boolean isVeg,
            @RequestParam Double price,
            @RequestParam(required = false) MultipartFile image) throws IOException {

        MenuItem item = new MenuItem();
        item.setName(name);
        item.setCategory(category);
        item.setVeg(isVeg);
        item.setPrice(price);

        return ResponseEntity.ok(MenuMapper.mapToMenuItemDTO(
                restaurantService.updateMenuItem(getAuthenticatedOwnerId(principal), restaurantId, menuItemId, item, image)));
    }

    @DeleteMapping("/{restaurantId}/menu/{menuItemId}")
    public ResponseEntity<?> deleteMenuItem(Principal principal, @PathVariable Long restaurantId, @PathVariable Long menuItemId) {
        restaurantService.deleteMenuItem(getAuthenticatedOwnerId(principal), restaurantId, menuItemId);
        return ResponseEntity.ok(Map.of("message", "Menu item archived successfully"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<RestaurantDTO>> getMyRestaurants(Principal principal) {
        Long ownerId = getAuthenticatedOwnerId(principal);
        return ResponseEntity.ok(restaurantService.getMyRestaurants(ownerId));
    }

    @PostMapping("/create")
    public ResponseEntity<RestaurantDTO> createRestaurant(Principal principal, @Valid @RequestBody RestaurantDTO restaurantDTO) {
        return ResponseEntity.ok(RestaurantMapper.mapToRestaurantDTO(
                restaurantService.createRestaurant(getAuthenticatedOwnerId(principal), restaurantDTO)));
    }

    @PutMapping("/{restaurantId}/profile")
    public ResponseEntity<RestaurantDTO> updateRestaurantProfile(
            Principal principal,
            @PathVariable Long restaurantId,
            @RequestBody RestaurantDTO restaurantDTO) {
        return ResponseEntity.ok(RestaurantMapper.mapToRestaurantDTO(
                restaurantService.updateRestaurantInfo(getAuthenticatedOwnerId(principal), restaurantId, restaurantDTO)));
    }

    @GetMapping("/{restaurantId}/orders")
    public ResponseEntity<List<OrderDTO>> getRestaurantOrders(Principal principal, @PathVariable Long restaurantId) {
        Long ownerId = getAuthenticatedOwnerId(principal);

        // Ensure the owner actually owns this restaurant before showing orders
        restaurantService.validateOwnership(ownerId, restaurantId);

        return ResponseEntity.ok(restaurantService.getOrdersByRestaurant(ownerId, restaurantId));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            Principal principal,
            @PathVariable Long orderId,
            @RequestBody Map<String, String> payload) {

        Long ownerId = getAuthenticatedOwnerId(principal);

        // The service should verify that the order belongs to a restaurant owned by 'ownerId'
        return ResponseEntity.ok(OrderMapper.mapToOrderDTO(
                orderService.updateOrderStatusSecurely(ownerId, orderId, payload.get("status"))));
    }
}

