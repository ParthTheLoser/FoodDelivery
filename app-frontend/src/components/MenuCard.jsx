import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { MdLocalFireDepartment } from 'react-icons/md';
import toast from 'react-hot-toast';

const FALLBACK_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';

const MenuCard = ({ item }) => {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { isAuthenticated, role } = useAuth();

  const cartItem = cartItems.find((ci) => ci.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const imageSrc = item.imageBase64
    ? `data:image/jpeg;base64,${item.imageBase64}`
    : FALLBACK_FOOD_IMAGE;

  const handleAdd = () => {
    if (!isAuthenticated || role !== 'USER') {
      toast.error('Please login as a customer to add items');
      return;
    }
    addToCart(item);
    toast.success(`${item.name} added to cart!`, { icon: '🛒', duration: 1500 });
  };

  return (
    <div className="menu-card">
      <div className="menu-card__image-wrap">
        <img
          src={imageSrc}
          alt={item.name}
          className="menu-card__image"
          onError={(e) => { e.target.src = FALLBACK_FOOD_IMAGE; }}
        />
        <div className="menu-card__badges">
          <span className={`veg-indicator ${item.veg ? 'veg' : 'nonveg'}`}>
            <span className="veg-dot" />
          </span>
          {item.price < 150 && (
            <span className="value-badge">
              <MdLocalFireDepartment size={12} /> Value
            </span>
          )}
        </div>
      </div>

      <div className="menu-card__body">
        <div className="menu-card__category">{item.category}</div>
        <h6 className="menu-card__name">{item.name}</h6>
        <p className="menu-card__restaurant">{item.restaurantName}</p>

        <div className="menu-card__footer">
          <span className="menu-card__price">₹{item.price?.toFixed(2)}</span>

          {quantity === 0 ? (
            <button className="btn-add-cart" onClick={handleAdd} id={`add-item-${item.id}`}>
              <FiPlus size={14} className="me-1" /> ADD
            </button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => removeFromCart(item.id)}>
                <FiMinus size={13} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={handleAdd}>
                <FiPlus size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
