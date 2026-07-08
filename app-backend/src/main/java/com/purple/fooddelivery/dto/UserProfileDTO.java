package com.purple.fooddelivery.dto;

import com.purple.fooddelivery.entity.Role;
import lombok.Value;

@Value
public class UserProfileDTO {
    String name;
    String email;
    Role role;
    String phoneNumber;
}
