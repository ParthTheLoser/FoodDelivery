package com.purple.fooddelivery.repository;

import com.purple.fooddelivery.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    // For the Restaurant Dashboard to show their specific restaurants
    List<Restaurant> findByOwnerId(Long ownerId);

    // For the Home Page: only show verified restaurants to customers
    List<Restaurant> findByIsVerifiedTrue();

    Optional<Restaurant> findByIdAndOwnerId(Long id, Long ownerId);

}

