package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.OrderDTO;
import com.purple.fooddelivery.dto.RestaurantAdminDTO;
import com.purple.fooddelivery.dto.RestaurantDTO;
import com.purple.fooddelivery.entity.MenuItem;
import com.purple.fooddelivery.entity.Restaurant;
import com.purple.fooddelivery.entity.User;
import com.purple.fooddelivery.mapper.OrderMapper;
import com.purple.fooddelivery.mapper.RestaurantMapper;
import com.purple.fooddelivery.repository.MenuItemRepository;
import com.purple.fooddelivery.repository.OrderRepository;
import com.purple.fooddelivery.repository.RestaurantRepository;
import com.purple.fooddelivery.repository.RestaurantDetailsRepository;
import com.purple.fooddelivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepo;

    @Autowired
    private MenuItemRepository menuRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private RestaurantDetailsRepository restaurantDetailsRepo;

    @Override
    public void validateOwnership(Long ownerId, Long restaurantId) {
        restaurantRepo.findByIdAndOwnerId(restaurantId, ownerId)
                .orElseThrow(() -> new RuntimeException("Access Denied: You do not own this restaurant"));
    }

    @Override
    public List<RestaurantAdminDTO> getAllRestaurants() {
        return restaurantRepo.findAll().stream()
                .map(r -> {
                    var details = restaurantDetailsRepo.findByRestaurantId(r.getId()).orElse(null);
                    return new RestaurantAdminDTO(
                            r.getId(),
                            r.getName(),
                            r.getAddress(),
                            r.getPhoneNumber(),
                            r.getLocationUrl(),
                            details != null ? details.getLicenseNumber() : null,
                            details != null ? details.getGstNumber() : null,
                            Boolean.TRUE.equals(r.getIsVerified())
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantDTO> getMyRestaurants(Long ownerId) {
        return restaurantRepo.findByOwnerId(ownerId).stream()
                .map(r -> {
                    RestaurantDTO dto = RestaurantMapper.mapToRestaurantDTO(r);
                    restaurantDetailsRepo.findByRestaurantId(r.getId()).ifPresent(details -> {
                        dto.setLicenseNumber(details.getLicenseNumber());
                        dto.setGstNumber(details.getGstNumber());
                    });
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void verifyRestaurant(Long restaurantId) {
        Restaurant r = restaurantRepo.findById(restaurantId).orElseThrow(() -> new RuntimeException("Not found"));
        r.setIsVerified(true);
        restaurantRepo.save(r);
    }

    @Override
    @Transactional
    public void blockRestaurant(Long restaurantId) {
        Restaurant r = restaurantRepo.findById(restaurantId).orElseThrow(() -> new RuntimeException("Not found"));
        r.setIsVerified(false);
        restaurantRepo.save(r);
    }

    @Override
    @Transactional
    public Restaurant createRestaurant(Long ownerId, RestaurantDTO restaurantDTO) {
        User owner = userRepo.findById(ownerId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!"RESTAURANT_OWNER".equals(owner.getRole().name())) throw new RuntimeException("Unauthorized");
        
        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantDTO.getName());
        restaurant.setAddress(restaurantDTO.getAddress());
        restaurant.setPhoneNumber(restaurantDTO.getPhoneNumber());
        restaurant.setLocationUrl(restaurantDTO.getLocationUrl());
        restaurant.setOwner(owner);
        restaurant = restaurantRepo.save(restaurant);

        com.purple.fooddelivery.entity.RestaurantDetails details = new com.purple.fooddelivery.entity.RestaurantDetails();
        details.setLicenseNumber(restaurantDTO.getLicenseNumber());
        details.setGstNumber(restaurantDTO.getGstNumber());
        details.setRestaurant(restaurant);
        restaurantDetailsRepo.save(details);

        return restaurant;
    }

    @Override
    @Transactional
    public Restaurant updateRestaurantInfo(Long ownerId, Long restaurantId, RestaurantDTO updatedInfo) {
        // Securely find by ID AND OwnerID
        Restaurant r = restaurantRepo.findByIdAndOwnerId(restaurantId, ownerId)
                .orElseThrow(() -> new RuntimeException("Access Denied: Not your restaurant"));

        if(updatedInfo.getName() != null) r.setName(updatedInfo.getName());
        if(updatedInfo.getAddress() != null) r.setAddress(updatedInfo.getAddress());
        if(updatedInfo.getPhoneNumber() != null) r.setPhoneNumber(updatedInfo.getPhoneNumber());
        if(updatedInfo.getLocationUrl() != null) r.setLocationUrl(updatedInfo.getLocationUrl());
        
        return restaurantRepo.save(r);
    }

    @Override
    @Transactional
    public MenuItem addMenuItem(Long ownerId, Long restaurantId, MenuItem item, MultipartFile image) throws IOException {
        Restaurant r = restaurantRepo.findByIdAndOwnerId(restaurantId, ownerId)
                .orElseThrow(() -> new RuntimeException("Access Denied"));
        if (image != null && !image.isEmpty()) item.setImage(image.getBytes());
        item.setRestaurant(r);
        return menuRepo.save(item);
    }

    @Override
    @Transactional
    public MenuItem updateMenuItem(Long ownerId, Long restaurantId, Long menuItemId, MenuItem updatedItem, MultipartFile image) throws IOException {
        MenuItem existing = menuRepo.findById(menuItemId).orElseThrow();
        // Cross-verify ownership
        if (!existing.getRestaurant().getId().equals(restaurantId) ||
                !existing.getRestaurant().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Access Denied");
        }
        existing.setName(updatedItem.getName());
        existing.setPrice(updatedItem.getPrice());
        existing.setCategory(updatedItem.getCategory());
        existing.setVeg(updatedItem.isVeg());
        if (image != null && !image.isEmpty()) existing.setImage(image.getBytes());
        return menuRepo.save(existing);
    }

    @Override
    @Transactional
    public void deleteMenuItem(Long ownerId, Long restaurantId, Long menuItemId) {
        MenuItem existing = menuRepo.findById(menuItemId).orElseThrow();
        if (!existing.getRestaurant().getId().equals(restaurantId) ||
                !existing.getRestaurant().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Access Denied");
        }
        existing.setDeleted(true);
        menuRepo.save(existing);
    }

    @Override
    public Page<MenuItem> getMenuItems(Pageable pageable) {
        return menuRepo.findAvailableMenuItems(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByRestaurant(Long ownerId, Long restaurantId) {

        validateOwnership(ownerId, restaurantId);

        return orderRepo.findByRestaurantId(restaurantId).stream()
                .map(OrderMapper::mapToOrderDTO)
                .collect(Collectors.toList());
    }

}

