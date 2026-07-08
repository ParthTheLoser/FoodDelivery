package com.purple.fooddelivery.repository;

import com.purple.fooddelivery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Crucial for Spring Security and Login
    Optional<User> findByEmail(String email);

    // Optional: Useful for checking if an email exists during registration
    boolean existsByEmail(String email);

}

