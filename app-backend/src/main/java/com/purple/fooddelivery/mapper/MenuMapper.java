package com.purple.fooddelivery.mapper;

import com.purple.fooddelivery.dto.MenuItemDTO;
import com.purple.fooddelivery.entity.MenuItem;
import java.util.Base64;

public class MenuMapper {
    public static MenuItemDTO mapToMenuItemDTO(MenuItem item) {
        String base64Image = (item.getImage() != null) ?
                Base64.getEncoder().encodeToString(item.getImage()) : null;

        return new MenuItemDTO(
                item.getId(),
                item.getName(),
                item.getCategory(),
                item.isVeg(),
                item.getPrice(),
                item.getRestaurant().getId(),
                item.getRestaurant().getName(),
                base64Image
        );
    }

}
