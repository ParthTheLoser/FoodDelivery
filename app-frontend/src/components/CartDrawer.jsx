import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/services';
import toast from 'react-hot-toast';
import { FiPlus, FiMinus, FiTrash2, FiX } from 'react-icons/fi';

const CartDrawer = ({ show, onHide }) => {
  const { cartItems, cartRestaurantId, cartRestaurantName, addToCart, removeFromCart, clearCart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    if (!cartRestaurantId) return;

    const orderItems = cartItems.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      const res = await orderAPI.checkout(cartRestaurantId, orderItems);
      toast.success('🎉 Order placed successfully!');
      clearCart();
      onHide();
      navigate('/my-orders');
    } catch (err) {
      // Backend returns { error: "..." } on failure (not { message: "..." })
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to place order. Please try again.';
      toast.error(errMsg);
    }
  };

  return (
    <>
      {/* Overlay */}
      {show && (
        <div
          className="cart-overlay"
          onClick={onHide}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 1040, backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Drawer */}
      <div className={`cart-drawer ${show ? 'cart-drawer--open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer__header">
          <div>
            <h5 className="mb-0 fw-bold">Your Cart</h5>
            {cartRestaurantName && (
              <small className="text-muted">{cartRestaurantName}</small>
            )}
          </div>
          <button className="btn-icon" onClick={onHide}>
            <FiX size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer__body">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }}>🛒</div>
              <p className="text-muted mt-3">Your cart is empty</p>
              <p className="text-muted small">Add items from the menu to get started</p>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__info">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className={`veg-badge ${item.veg ? 'veg-badge--veg' : 'veg-badge--nonveg'}`} />
                      <span className="fw-semibold">{item.name}</span>
                    </div>
                    <span className="text-warning fw-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => removeFromCart(item.id)}>
                      <FiMinus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => addToCart(item)}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-semibold">Total</span>
              <span className="fw-bold fs-5 text-warning">₹{cartTotal.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary w-100 btn-lg fw-bold"
              onClick={handleCheckout}
            >
              Place Order
            </button>
            <button
              className="btn btn-outline-danger w-100 mt-2"
              onClick={clearCart}
            >
              <FiTrash2 className="me-2" />Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
