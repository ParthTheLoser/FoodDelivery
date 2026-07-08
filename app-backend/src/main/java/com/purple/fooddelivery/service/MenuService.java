package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.MenuItemDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MenuService {
    Page<MenuItemDTO> searchMenu(String name, String category, Pageable pageable);
}
