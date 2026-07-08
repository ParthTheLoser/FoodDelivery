package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.UserProfileDTO;
import com.purple.fooddelivery.dto.UserUpdateDTO;
import com.purple.fooddelivery.entity.User;
import com.purple.fooddelivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepo;

    @Override
    public Long getAuthenticatedOwnerId(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    @Override
    public UserProfileDTO getProfile(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return new UserProfileDTO(user.getName(), user.getEmail(), user.getRole(), user.getPhoneNumber());
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(Long userId, UserUpdateDTO updateDTO) {
        User user = userRepo.findById(userId).orElseThrow();
        user.setName(updateDTO.getName());
        user.setPhoneNumber(updateDTO.getPhoneNumber());
        userRepo.save(user);
        return getProfile(userId);
    }
}
