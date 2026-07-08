import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartRestaurantId, setCartRestaurantId] = useState(null);
  const [cartRestaurantName, setCartRestaurantName] = useState('');

  const addToCart = (item) => {
    // If cart has items from a different restaurant, clear first
    if (cartRestaurantId && cartRestaurantId !== item.restaurantId) {
      if (!window.confirm(`Your cart contains items from "${cartRestaurantName}". Do you want to clear cart and add items from "${item.restaurantName}"?`)) {
        return;
      }
      setCartItems([]);
    }
    setCartRestaurantId(item.restaurantId);
    setCartRestaurantName(item.restaurantName);

    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = prev
        .map((ci) => (ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci))
        .filter((ci) => ci.quantity > 0);
      if (updated.length === 0) {
        setCartRestaurantId(null);
        setCartRestaurantName('');
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurantId(null);
    setCartRestaurantName('');
  };

  const cartCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartTotal = cartItems.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartRestaurantId,
        cartRestaurantName,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
