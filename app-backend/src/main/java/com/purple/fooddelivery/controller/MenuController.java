package com.purple.fooddelivery.controller;

import com.purple.fooddelivery.dto.MenuItemDTO;
import com.purple.fooddelivery.entity.MenuItem;
import com.purple.fooddelivery.mapper.MenuMapper;
import com.purple.fooddelivery.repository.MenuItemRepository;
import com.purple.fooddelivery.service.MenuService;
import com.purple.fooddelivery.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private MenuService menuService;

    // For Home Page (Pagination and Sorting)
    @GetMapping
    public ResponseEntity<Page<MenuItemDTO>> getAllMenu(
            @PageableDefault(page = 0, size = 8, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {

        // Map the Page of entities to a Page of DTOs
        Page<MenuItemDTO> dtoPage = restaurantService.getMenuItems(pageable)
                .map(MenuMapper::mapToMenuItemDTO);
        return ResponseEntity.ok(dtoPage);
    }

    // For Explore Page (Search by name/category)
    @GetMapping("/search")
    public ResponseEntity<Page<MenuItemDTO>> searchMenu(
            @RequestParam String keyword,
            @PageableDefault(page = 0, size = 8, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {

        Page<MenuItemDTO> results = menuService.searchMenu(keyword, keyword, pageable);

        return ResponseEntity.ok(results);
    }
}

