package com.purple.fooddelivery.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponseDTO {
    String token;
    String role;
    Long userId;
}
