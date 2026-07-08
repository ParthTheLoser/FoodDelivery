package com.purple.fooddelivery.mapper;

import com.purple.fooddelivery.dto.RestaurantDTO;
import com.purple.fooddelivery.entity.Restaurant;

public class RestaurantMapper {
    public static RestaurantDTO mapToRestaurantDTO(Restaurant r) {
        return new RestaurantDTO(r.getId(), r.getName(), r.getAddress(), r.getPhoneNumber(), Boolean.TRUE.equals(r.getIsVerified()), r.getLocationUrl(), null, null);
    }
}
