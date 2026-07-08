package com.purple.fooddelivery.dto;

import lombok.Value;

@Value
public class MenuItemDTO {
    Long id;
    String name;
    String category;
    boolean isVeg;
    Double price;
    Long restaurantId;
    String restaurantName;
    String imageBase64;
}