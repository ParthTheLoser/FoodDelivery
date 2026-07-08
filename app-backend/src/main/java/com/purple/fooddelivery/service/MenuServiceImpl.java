package com.purple.fooddelivery.service;

import com.purple.fooddelivery.dto.MenuItemDTO;
import com.purple.fooddelivery.mapper.MenuMapper;
import com.purple.fooddelivery.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public Page<MenuItemDTO> searchMenu(String name, String category, Pageable pageable) {
        return menuItemRepository.searchAvailableMenuItems(name, pageable)
                .map(MenuMapper::mapToMenuItemDTO);
    }
}
