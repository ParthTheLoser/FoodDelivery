package com.purple.fooddelivery.dto;

import lombok.Value;

@Value
public class LoginRequestDTO {
    String email;
    String password;
}
