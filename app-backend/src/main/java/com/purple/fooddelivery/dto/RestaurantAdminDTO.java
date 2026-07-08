package com.purple.fooddelivery.dto;

import lombok.Value;

@Value
public class RestaurantAdminDTO {
    Long id;
    String name;
    String address;
    String phoneNumber;
    String locationUrl;
    String licenseNumber;
    String gstNumber;
    boolean verified;
}

