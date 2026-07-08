import React, { useState, useEffect } from 'react';
import { orderAPI } from '../api/services';
import { FiClock, FiPackage } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';

const STATUS_COLORS = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PREPARING: 'primary',
  READY: 'secondary',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper d-flex justify-content-center align-items-center">
        <div className="spinner-border text-warning" role="status" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <FiPackage className="me-2 text-warning" />My Orders
          </h1>
          <p className="page-subtitle">Track all your past and current orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>📦</div>
            <h4>No orders yet</h4>
            <p className="text-muted">Start exploring our menu and place your first order!</p>
            <a href="/" className="btn btn-primary mt-3">Browse Menu</a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-card__header">
                  <div className="d-flex align-items-center gap-2">
                    <MdRestaurant size={20} className="text-warning" />
                    <div>
                      <h6 className="mb-0 fw-bold">{order.restaurantName}</h6>
                      <small className="text-muted">
                        <FiClock size={12} className="me-1" />
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString('en-IN')
                          : 'N/A'}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`status-badge status-badge--${STATUS_COLORS[order.status] || 'secondary'}`}>
                      {order.status || 'UNKNOWN'}
                    </span>
                    <span className="order-total">₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-card__items">
                  {(order.items || []).map((item) => (
                    <div key={item.id} className="order-item-row">
                      <span className="order-item-name">{item.foodName}</span>
                      <span className="order-item-qty">× {item.quantity}</span>
                      <span className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="order-card__footer">
                  <span className="text-muted small">Order #{order.id}</span>
                  {order.razorpayPaymentId && (
                    <span className="text-muted small">
                      Payment: {order.razorpayPaymentId}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
