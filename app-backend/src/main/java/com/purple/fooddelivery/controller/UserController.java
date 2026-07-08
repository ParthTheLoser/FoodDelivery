package com.purple.fooddelivery.controller;

import com.purple.fooddelivery.dto.UserProfileDTO;
import com.purple.fooddelivery.dto.UserUpdateDTO;
import com.purple.fooddelivery.repository.UserRepository;
import com.purple.fooddelivery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user/profile")
public class UserController {

    @Autowired
    private UserService userService;

    private Long getAuthenticatedUserId(Principal principal) {
        return userService.getAuthenticatedOwnerId(principal.getName());
    }

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile(Principal principal) {
        return ResponseEntity.ok(userService.getProfile(getAuthenticatedUserId(principal)));
    }

    @PutMapping
    public ResponseEntity<UserProfileDTO> updateProfile(Principal principal, @RequestBody UserUpdateDTO dto) {
        return ResponseEntity.ok(userService.updateProfile(getAuthenticatedUserId(principal), dto));
    }
}
