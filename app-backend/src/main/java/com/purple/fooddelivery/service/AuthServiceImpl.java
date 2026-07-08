package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.AuthResponseDTO;
import com.purple.fooddelivery.dto.LoginRequestDTO;
import com.purple.fooddelivery.dto.RegisterRequestDTO;
import com.purple.fooddelivery.entity.User;
import com.purple.fooddelivery.repository.UserRepository;
import com.purple.fooddelivery.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @Override
    public String registerUser(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole()); // Ensure Role is an Enum

        userRepository.save(user);

        return "User registered successfully";
    }

    @Override
    public AuthResponseDTO loginUser(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());

        return AuthResponseDTO.builder()
                .token(token)
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }
}

