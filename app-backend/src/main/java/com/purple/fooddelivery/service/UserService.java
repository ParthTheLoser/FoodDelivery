package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.UserProfileDTO;
import com.purple.fooddelivery.dto.UserUpdateDTO;
import com.purple.fooddelivery.entity.User;

import java.security.Principal;

public interface UserService {
    Long getAuthenticatedOwnerId(String email);
    User getAuthenticatedOwner(String email);
    UserProfileDTO getProfile(Long userId);
    UserProfileDTO updateProfile(Long userId, UserUpdateDTO updateDTO);
}
