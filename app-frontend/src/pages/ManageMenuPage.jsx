import React, { useState, useEffect } from 'react';
import { restaurantAPI, menuAPI } from '../api/services';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit3, FiTrash2, FiUpload, FiX, FiRefreshCw, FiClock, FiChevronDown } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=60';

const emptyForm = { name: '', category: '', isVeg: true, price: '' };

const ManageMenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchMyRestaurant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyRestaurant = async () => {
    setPageLoading(true);
    try {
      const res = await restaurantAPI.getMyRestaurants();
      const list = res.data || [];
      setRestaurants(list);
      if (list.length > 0) {
        const savedId = localStorage.getItem('restaurantId');
        const found = savedId ? list.find(r => r.id === Number(savedId)) : null;
        const r = found || list[0];
        setRestaurant(r);
        setRestaurantId(r.id);
        localStorage.setItem('restaurantId', r.id);
        if (r.verified) fetchMenu(r.id);
      }
    } catch (err) {
      toast.error('Failed to load restaurant info');
    } finally {
      setPageLoading(false);
    }
  };

  const handleRestaurantChange = (e) => {
    const selectedId = Number(e.target.value);
    const r = restaurants.find(res => res.id === selectedId);
    if (r) {
      setRestaurant(r);
      setRestaurantId(r.id);
      localStorage.setItem('restaurantId', r.id);
      setMenuItems([]);
      if (r.verified) {
        fetchMenu(r.id);
      }
    }
  };

  // Fetch from public menu and filter by restaurantId
  const fetchMenu = async (restId) => {
    if (!restId) return;
    try {
      const res = await menuAPI.getAllMenu(0, 200);
      const all = res.data.content || [];
      setMenuItems(all.filter((item) => item.restaurantId === restId));
    } catch (err) {
      console.error('Could not load menu items:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB
        toast.error('Image size must be less than 100MB');
        e.target.value = '';
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, category: item.category, isVeg: item.veg, price: item.price });
    setImageFile(null);
    setImagePreview(item.imageBase64 ? `data:image/jpeg;base64,${item.imageBase64}` : '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantId) { toast.error('Set restaurant ID first'); return; }
    setLoading(true);
    const params = { name: form.name, category: form.category, isVeg: form.isVeg, price: Number(form.price) };
    try {
      let res;
      if (editingItem) {
        res = await restaurantAPI.updateMenuItem(restaurantId, editingItem.id, params, imageFile);
        setMenuItems((prev) => prev.map((i) => (i.id === editingItem.id ? res.data : i)));
        toast.success('Menu item updated! ✅');
      } else {
        res = await restaurantAPI.addMenuItem(restaurantId, params, imageFile);
        setMenuItems((prev) => [...prev, res.data]);
        toast.success('Menu item added! 🍽️');
      }
      setShowModal(false);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to save menu item';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      await restaurantAPI.deleteMenuItem(restaurantId, item.id);
      setMenuItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success('Item deleted');
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  if (pageLoading) {
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
            <h1 className="page-title"><MdRestaurantMenu className="me-2 text-warning" />Manage Menu</h1>
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
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h1 className="page-title"><MdRestaurantMenu className="me-2 text-warning" />Manage Menu</h1>
            <div className="page-subtitle d-flex align-items-center gap-2 mt-2">
              {restaurants.length > 1 ? (
                <div className="position-relative d-flex align-items-center">
                  <select
                    className="form-select form-select-sm bg-dark text-white border-secondary pe-4"
                    value={restaurant.id}
                    onChange={handleRestaurantChange}
                    style={{ width: 'auto', minWidth: '200px', cursor: 'pointer', appearance: 'none' }}
                  >
                    {restaurants.map(r => (
                      <option key={r.id} value={r.id}>{r.name} #{r.id}</option>
                    ))}
                  </select>
                  <FiChevronDown className="position-absolute end-0 me-2 text-warning pointer-events-none" size={16} style={{ pointerEvents: 'none' }} />
                </div>
              ) : (
                <span className="text-muted">{restaurant.name} #{restaurantId}</span>
              )}
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={openAddModal}
            id="add-menu-item-btn"
            disabled={!isVerified}
            title={!isVerified ? 'Pending admin verification' : ''}
          >
            <FiPlus className="me-2" />Add Item
          </button>
        </div>

        {/* Verification Banner */}
        {!isVerified && (
          <div className="alert alert-warning border-0 rounded-3 mb-4 d-flex align-items-center gap-3" style={{ background: 'rgba(255,193,7,0.15)' }}>
            <FiClock size={32} className="text-warning flex-shrink-0" />
            <div>
              <h5 className="mb-1 fw-bold">Pending Admin Verification</h5>
              <p className="mb-0 text-muted">You cannot add or edit menu items until an admin verifies your restaurant.</p>
            </div>
          </div>
        )}

        {menuItems.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🍽️</div>
            <h5>No menu items yet</h5>
            <p className="text-muted">Add your first menu item to get started</p>
            <button className="btn btn-primary mt-3" onClick={openAddModal}>
              <FiPlus className="me-2" />Add First Item
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {menuItems.map((item) => (
              <div key={item.id} className="col-md-6 col-lg-4">
                <div className="manage-menu-card">
                  <img
                    src={item.imageBase64 ? `data:image/jpeg;base64,${item.imageBase64}` : FALLBACK_IMG}
                    alt={item.name}
                    className="manage-menu-card__img"
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                  <div className="manage-menu-card__info">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className={`veg-indicator ${item.veg ? 'veg' : 'nonveg'}`}><span className="veg-dot" /></span>
                      <h6 className="mb-0">{item.name}</h6>
                    </div>
                    <p className="text-muted small mb-1">{item.category}</p>
                    <p className="fw-bold text-warning mb-0">₹{item.price}</p>
                  </div>
                  <div className="manage-menu-card__actions">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(item)} disabled={!isVerified}>
                      <FiEdit3 />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item)} disabled={!isVerified}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card__header">
              <h5 className="mb-0">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h5>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-card__body">
              {/* Image upload */}
              <div className="image-upload-area" onClick={() => document.getElementById('image-upload').click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 8 }} />
                ) : (
                  <div className="image-upload-placeholder">
                    <FiUpload size={24} />
                    <p>Click to upload image</p>
                  </div>
                )}
                <input type="file" id="image-upload" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Item Name *</label>
                <input type="text" className="form-control" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Category *</label>
                <input type="text" className="form-control" value={form.category} placeholder="e.g. Starters, Main Course"
                  onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-7">
                  <label className="form-label fw-semibold">Price (₹) *</label>
                  <input type="number" className="form-control" value={form.price} min="0" step="0.01"
                    onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="col-5">
                  <label className="form-label fw-semibold">Type</label>
                  <div className="d-flex gap-3 mt-2">
                    <label className="d-flex align-items-center gap-1">
                      <input type="radio" name="isVeg" checked={form.isVeg === true}
                        onChange={() => setForm({ ...form, isVeg: true })} />
                      <span className="text-success">🟢 Veg</span>
                    </label>
                    <label className="d-flex align-items-center gap-1">
                      <input type="radio" name="isVeg" checked={form.isVeg === false}
                        onChange={() => setForm({ ...form, isVeg: false })} />
                      <span className="text-danger">🔴 Non-Veg</span>
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenuPage;
