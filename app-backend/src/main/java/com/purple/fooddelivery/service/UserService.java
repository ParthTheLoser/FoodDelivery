package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.UserProfileDTO;
import com.purple.fooddelivery.dto.UserUpdateDTO;

public interface UserService {
    Long getAuthenticatedOwnerId(String email);
    UserProfileDTO getProfile(Long userId);
    UserProfileDTO updateProfile(Long userId, UserUpdateDTO updateDTO);
}
