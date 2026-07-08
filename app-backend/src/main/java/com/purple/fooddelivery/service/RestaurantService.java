package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.OrderDTO;
import com.purple.fooddelivery.dto.RestaurantAdminDTO;
import com.purple.fooddelivery.dto.RestaurantDTO;
import com.purple.fooddelivery.entity.MenuItem;
import com.purple.fooddelivery.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface RestaurantService {

    void validateOwnership(Long ownerId, Long restaurantId);

    List<RestaurantAdminDTO> getAllRestaurants();

    List<RestaurantDTO> getMyRestaurants(Long ownerId);

    void verifyRestaurant(Long restaurantId);
    void blockRestaurant(Long id);

    Restaurant createRestaurant(Long ownerId, RestaurantDTO restaurantDTO);
    Restaurant updateRestaurantInfo(Long ownerId, Long restaurantId, RestaurantDTO updatedInfo);

    MenuItem addMenuItem(Long ownerId, Long restaurantId, MenuItem item, MultipartFile image) throws IOException;
    MenuItem updateMenuItem(Long ownerId, Long restaurantId, Long menuItemId, MenuItem updatedItem, MultipartFile image) throws IOException;
    void deleteMenuItem(Long ownerId, Long restaurantId, Long menuItemId);

    Page<MenuItem> getMenuItems(Pageable pageable);

    List<OrderDTO> getOrdersByRestaurant(Long ownerId, Long restaurantId);

}

