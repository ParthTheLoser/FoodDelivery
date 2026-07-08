package com.purple.fooddelivery.entity;

import jakarta.persistence.*;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Data
@Table(name = "restaurant_details")
public class RestaurantDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "License number is required")
    @Pattern(regexp = "^[0-9]{14}$", message = "FSSAI License must be exactly 14 digits")
    private String licenseNumber;

    @NotBlank(message = "GST number is required")
    @Pattern(regexp = "^[0-9A-Z]{15}$", message = "GST Number must be exactly 15 characters")
    private String gstNumber;

    @OneToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}
