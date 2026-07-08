package com.purple.fooddelivery.controller;

import com.purple.fooddelivery.dto.RestaurantAdminDTO;
import com.purple.fooddelivery.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantAdminDTO>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @PutMapping("/verify-restaurant/{id}")
    public ResponseEntity<?> verifyRestaurant(@PathVariable Long id) {
        try {
            restaurantService.verifyRestaurant(id);
            return ResponseEntity.ok(Map.of("message", "Restaurant verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/block-restaurant/{id}")
    public ResponseEntity<?> blockRestaurant(@PathVariable Long id) {
        try {
            restaurantService.blockRestaurant(id);
            return ResponseEntity.ok(Map.of("message", "Restaurant verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}

