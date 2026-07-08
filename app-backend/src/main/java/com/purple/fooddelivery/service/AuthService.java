package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.AuthResponseDTO;
import com.purple.fooddelivery.dto.LoginRequestDTO;
import com.purple.fooddelivery.dto.RegisterRequestDTO;
import com.purple.fooddelivery.entity.User;

import java.util.Map;

public interface AuthService {
    String registerUser(RegisterRequestDTO request);
    AuthResponseDTO loginUser(LoginRequestDTO request);
}
