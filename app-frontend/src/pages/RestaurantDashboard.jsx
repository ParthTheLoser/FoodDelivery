import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../api/services';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiRefreshCw, FiClock, FiCheckCircle, FiPlus, FiChevronDown } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';

const STATUS_OPTIONS = ['CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS = {
  PENDING: 'warning', CONFIRMED: 'info', PREPARING: 'primary',
  READY: 'secondary', OUT_FOR_DELIVERY: 'info', DELIVERED: 'success', CANCELLED: 'danger',
};

const RestaurantDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({ name: '', address: '', phoneNumber: '', locationUrl: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchMyRestaurant();
  }, []);

  const fetchMyRestaurant = async () => {
    setLoading(true);
    try {
      const res = await restaurantAPI.getMyRestaurants();
      const list = res.data || [];
      setRestaurants(list);
      if (list.length > 0) {
        const savedId = localStorage.getItem('restaurantId');
        const found = savedId ? list.find(r => r.id === Number(savedId)) : null;
        const r = found || list[0];
        setRestaurant(r);
        localStorage.setItem('restaurantId', r.id);
        if (r.verified) {
          fetchOrders(r.id);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to load restaurant';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantChange = (e) => {
    const selectedId = Number(e.target.value);
    const r = restaurants.find(res => res.id === selectedId);
    if (r) {
      setRestaurant(r);
      localStorage.setItem('restaurantId', r.id);
      setOrders([]);
      if (r.verified) {
        fetchOrders(r.id);
      }
    }
  };

  const fetchOrders = async (rid) => {
    setOrdersLoading(true);
    try {
      const res = await restaurantAPI.getOrders(rid || restaurant?.id);
      setOrders(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to load orders';
      toast.error(msg);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await restaurantAPI.updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to update status';
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const openUpdateModal = () => {
    setUpdateForm({
      name: restaurant.name || '',
      address: restaurant.address || '',
      phoneNumber: restaurant.phoneNumber || '',
      locationUrl: restaurant.locationUrl || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const res = await restaurantAPI.updateProfile(restaurant.id, updateForm);
      toast.success('Restaurant details updated successfully');
      setRestaurant(res.data);
      setRestaurants(restaurants.map(r => r.id === res.data.id ? res.data : r));
      setShowUpdateModal(false);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to update details';
      toast.error(msg);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper d-flex justify-content-center align-items-center">
        <div className="spinner-border text-warning" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title"><MdRestaurant className="me-2 text-warning" />Restaurant Dashboard</h1>
          </div>
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🍴</div>
            <h4>No Restaurant Found</h4>
            <p className="text-muted">You haven't created a restaurant yet.</p>
            <Link to="/restaurant/create" className="btn btn-primary mt-2">Create Your Restaurant</Link>
          </div>
        </div>
      </div>
    );
  }

  const isVerified = restaurant.verified;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="page-title d-flex align-items-center gap-3 mb-1">
              <MdRestaurant className="text-warning flex-shrink-0" />
              {restaurants.length > 1 ? (
                <div className="position-relative d-flex align-items-center">
                  <select
                    className="form-select form-select-lg bg-dark text-white border-secondary fw-bold pe-5"
                    value={restaurant.id}
                    onChange={handleRestaurantChange}
                    style={{ width: 'auto', minWidth: '250px', cursor: 'pointer', appearance: 'none' }}
                  >
                    {restaurants.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  <FiChevronDown className="position-absolute end-0 me-3 text-warning pointer-events-none" size={24} style={{ pointerEvents: 'none' }} />
                </div>
              ) : (
                restaurant.name
              )}
            </h1>
            <p className="page-subtitle mb-0">{restaurant.address}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            {isVerified ? (
              <span className="badge bg-success fs-6 px-3 py-2">
                <FiCheckCircle className="me-1" />Verified
              </span>
            ) : (
              <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                <FiClock className="me-1" />Pending Verification
              </span>
            )}
            <Link to="/restaurant/create" className="btn btn-primary" title="Create another restaurant">
              <FiPlus className="me-2" />New
            </Link>
            {isVerified && (
              <button className="btn btn-outline-secondary" onClick={() => fetchOrders()}>
                <FiRefreshCw className="me-2" />Refresh
              </button>
            )}
          </div>
        </div>

        {/* Pending Verification Banner */}
        {!isVerified && (
          <div className="alert alert-warning border-0 rounded-3 mb-4 d-flex align-items-center gap-3" style={{ background: 'rgba(255, 193, 7, 0.15)', borderLeft: '4px solid #ffc107 !important' }}>
            <FiClock size={32} className="text-warning flex-shrink-0" />
            <div>
              <h5 className="mb-1 fw-bold">Your restaurant is pending admin verification</h5>
              <p className="mb-0 text-muted">Once an admin verifies your restaurant, you will be able to manage orders, add menu items, and accept customers. Please wait for approval.</p>
            </div>
          </div>
        )}

        {/* Restaurant Info Card */}
        <div className="form-card mb-4" style={{ opacity: isVerified ? 1 : 0.7, pointerEvents: isVerified ? 'auto' : 'none', filter: isVerified ? 'none' : 'grayscale(30%)' }}>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="text-muted small">Restaurant ID</div>
              <div className="fw-bold">#{restaurant.id}</div>
            </div>
            <div className="col-md-2">
              <div className="text-muted small">Phone</div>
              <div className="fw-bold">{restaurant.phoneNumber || '—'}</div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">License & GST</div>
              <div className="fw-bold small">{restaurant.licenseNumber || '—'}</div>
              <div className="fw-bold small">{restaurant.gstNumber || '—'}</div>
            </div>
            <div className="col-md-2">
              <div className="text-muted small">Status</div>
              <div>
                {isVerified
                  ? <span className="badge bg-success">✅ Active &amp; Verified</span>
                  : <span className="badge bg-warning text-dark">⏳ Pending Verification</span>
                }
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-center justify-content-end">
              <button className="btn btn-outline-primary btn-sm w-100" onClick={openUpdateModal}>
                Edit Info
              </button>
            </div>
          </div>
        </div>

        {/* Orders Section — only when verified */}
        {isVerified ? (
          <>
            {/* Stats */}
            <div className="row g-3 mb-4">
              {[
                { label: 'Total Orders', value: orders.length, icon: '📦', color: 'primary' },
                { label: 'Pending', value: orders.filter((o) => o.status === 'PENDING').length, icon: '⏳', color: 'warning' },
                { label: 'Preparing', value: orders.filter((o) => o.status === 'PREPARING').length, icon: '👨‍🍳', color: 'info' },
                { label: 'Delivered', value: orders.filter((o) => o.status === 'DELIVERED').length, icon: '✅', color: 'success' },
              ].map((stat) => (
                <div key={stat.label} className="col-6 col-md-3">
                  <div className={`stat-card stat-card--${stat.color}`}>
                    <div className="stat-card__icon">{stat.icon}</div>
                    <div className="stat-card__value">{stat.value}</div>
                    <div className="stat-card__label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="text-center py-5"><div className="spinner-border text-warning" /></div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '3rem' }}>📭</div>
                <h5>No orders yet</h5>
                <p className="text-muted">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card__header">
                      <div>
                        <h6 className="mb-0">Order #{order.id}</h6>
                        <small className="text-muted">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : ''}
                        </small>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <span className="order-total">₹{order.totalAmount?.toFixed(2)}</span>
                        <select
                          className={`form-select form-select-sm status-select status-select--${STATUS_COLORS[order.status]}`}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="order-card__items">
                      {(order.items || []).map((item) => (
                        <div key={item.id} className="order-item-row">
                          <span className="order-item-name">{item.foodName}</span>
                          <span className="order-item-qty">× {item.quantity}</span>
                          <span className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="form-card text-center py-5" style={{ opacity: 0.5 }}>
            <FiClock size={48} className="text-warning mb-3" />
            <h5>Orders will appear here after verification</h5>
            <p className="text-muted">You cannot manage orders until your restaurant is verified by an admin.</p>
          </div>
        )}
      </div>

      {/* Update Restaurant Modal */}
      {showUpdateModal && (
        <div className="cart-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="form-card bg-dark text-white p-4 rounded" style={{ minWidth: '400px', maxWidth: '90%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Update Restaurant</h4>
              <button className="btn-close btn-close-white" onClick={() => setShowUpdateModal(false)}></button>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-3">
                <label className="text-info small fw-bold mb-1">Name</label>
                <input type="text" className="form-control" value={updateForm.name} onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="text-info small fw-bold mb-1">Address</label>
                <textarea className="form-control" rows={2} value={updateForm.address} onChange={(e) => setUpdateForm({...updateForm, address: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="text-info small fw-bold mb-1">Phone Number</label>
                <input type="tel" className="form-control" pattern="[0-9]{10}" value={updateForm.phoneNumber} onChange={(e) => setUpdateForm({...updateForm, phoneNumber: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label className="text-info small fw-bold mb-1">Google Maps URL</label>
                <input type="url" className="form-control" value={updateForm.locationUrl} onChange={(e) => setUpdateForm({...updateForm, locationUrl: e.target.value})} />
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-secondary w-50" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-50" disabled={updateLoading}>
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
