package com.purple.fooddelivery.repository;

import com.purple.fooddelivery.entity.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    // For Restaurant Dashboard: Show all items (so the owner can see what they hid)
    Page<MenuItem> findByRestaurantId(Long restaurantId, Pageable pageable);

    // For Home Page: Only fetch available items from verified restaurants
    @org.springframework.data.jpa.repository.Query("SELECT m FROM MenuItem m WHERE m.deleted = false AND m.restaurant.isVerified = true")
    Page<MenuItem> findAvailableMenuItems(Pageable pageable);

    // For Explore Page: Search only available items from verified restaurants
    @org.springframework.data.jpa.repository.Query("SELECT m FROM MenuItem m WHERE m.deleted = false AND m.restaurant.isVerified = true AND " +
           "(LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.category) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<MenuItem> searchAvailableMenuItems(@org.springframework.data.repository.query.Param("keyword") String keyword, Pageable pageable);
}

