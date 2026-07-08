import React, { useState } from 'react';
import { restaurantAPI } from '../api/services';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiLink, FiHome, FiShield, FiFileText } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';

const CreateRestaurantPage = () => {
  const [form, setForm] = useState({ name: '', address: '', phoneNumber: '', locationUrl: '', licenseNumber: '', gstNumber: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await restaurantAPI.create(form);
      const restaurant = res.data;
      // Store restaurantId for use in dashboard and menu pages
      localStorage.setItem('restaurantId', String(restaurant.id));
      toast.success(`🎉 Restaurant "${restaurant.name}" created! Pending admin verification.`);
      navigate('/restaurant/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to create restaurant';
      toast.error(typeof msg === 'string' ? msg : 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="page-header text-center">
              <div style={{ fontSize: '3rem' }}>🍴</div>
              <h1 className="page-title">Register Your Restaurant</h1>
              <p className="page-subtitle">Set up your restaurant profile to start receiving orders</p>
            </div>

            <div className="form-card">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <MdRestaurant className="me-2 text-warning" />Restaurant Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="restaurant-name"
                    className="form-control form-control-lg"
                    placeholder="e.g. The Spice Garden"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FiHome className="me-2 text-warning" />Address *
                  </label>
                  <textarea
                    name="address"
                    id="restaurant-address"
                    className="form-control"
                    rows={3}
                    placeholder="Full address including city and pincode"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FiPhone className="me-2 text-warning" />Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="restaurant-phone"
                    className="form-control form-control-lg"
                    placeholder="10-digit phone number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FiLink className="me-2 text-warning" />Google Maps URL
                  </label>
                  <input
                    type="url"
                    name="locationUrl"
                    id="restaurant-location"
                    className="form-control form-control-lg"
                    placeholder="https://maps.google.com/..."
                    value={form.locationUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FiShield className="me-2 text-warning" />FSSAI License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    className="form-control form-control-lg"
                    placeholder="14-digit FSSAI License Number"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FiFileText className="me-2 text-warning" />GST Number *
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    className="form-control form-control-lg"
                    placeholder="15-digit GST Number"
                    value={form.gstNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="alert alert-info d-flex align-items-center gap-2">
                  <span>ℹ️</span>
                  <span>Your restaurant will be visible to customers after admin verification.</span>
                </div>

                <button
                  type="submit"
                  id="create-restaurant-btn"
                  className="btn btn-primary btn-lg w-100 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                  ) : '🚀 Create Restaurant'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurantPage;
