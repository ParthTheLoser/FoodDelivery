import React, { useState, useEffect } from 'react';
import { adminAPI, menuAPI } from '../api/services';
import toast from 'react-hot-toast';
import { FiShield, FiCheck, FiSlash, FiRefreshCw } from 'react-icons/fi';

// Mock admin functionality - fetches restaurants from menu item restaurantIds
const AdminPanel = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [manualId, setManualId] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Use real backend endpoint to get ALL restaurants including those without menu items
      const [restaurantsRes, menuRes] = await Promise.all([
        adminAPI.getAllRestaurants(),
        menuAPI.getAllMenu(0, 500),
      ]);

      const rList = (restaurantsRes.data || []).map((r) => ({
        id: r.id,
        name: r.name,
        verified: r.verified,
        blocked: !r.verified,
        address: r.address,
        phoneNumber: r.phoneNumber,
        locationUrl: r.locationUrl,
        licenseNumber: r.licenseNumber,
        gstNumber: r.gstNumber
      }));
      setRestaurants(rList);

      const items = menuRes.data.content || [];
      setMenuItems(items);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to load data';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setProcessingId(id);
    try {
      await adminAPI.verifyRestaurant(id);
      toast.success(`Restaurant #${id} verified ✅`);
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, verified: true, blocked: false } : r))
      );
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to verify restaurant';
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleBlock = async (id) => {
    if (!window.confirm(`Block restaurant #${id}?`)) return;
    setProcessingId(id);
    try {
      await adminAPI.blockRestaurant(id);
      toast.success(`Restaurant #${id} blocked 🚫`);
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, verified: false, blocked: true } : r))
      );
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to block restaurant';
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleManualAction = async (action) => {
    if (!manualId) { toast.error('Enter a restaurant ID'); return; }
    if (action === 'verify') await handleVerify(Number(manualId));
    if (action === 'block') await handleBlock(Number(manualId));
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <FiShield className="me-2 text-warning" />Admin Panel
          </h1>
          <p className="page-subtitle">Manage restaurants and platform operations</p>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Restaurants', value: restaurants.length, icon: '🏪', color: 'primary' },
            { label: 'Total Menu Items', value: menuItems.length, icon: '🍽️', color: 'info' },
            { label: 'Active', value: restaurants.filter((r) => !r.blocked).length, icon: '✅', color: 'success' },
            { label: 'Blocked', value: restaurants.filter((r) => r.blocked).length, icon: '🚫', color: 'danger' },
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



        {/* Restaurant list */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Restaurants (from Menu Data)</h5>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchData}>
            <FiRefreshCw className="me-2" />Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-warning" /></div>
        ) : restaurants.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🏪</div>
            <h5>No restaurants found</h5>
            <p className="text-muted">Restaurant data appears when menu items exist</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Restaurant Name</th>
                  <th>Menu Items</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td className="fw-semibold">{r.name}</td>
                    <td>{menuItems.filter((i) => i.restaurantId === r.id).length}</td>
                    <td>
                      <span className={`badge ${r.verified ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {r.verified ? '✅ Verified' : '⏳ Unverified'}
                      </span>
                      {r.blocked && <span className="badge bg-danger ms-1">🚫 Blocked</span>}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-info text-white"
                          onClick={() => setSelectedRestaurant(r)}
                          title="View Details"
                        >
                          ℹ️
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleVerify(r.id)}
                          disabled={processingId === r.id}
                        >
                          <FiCheck size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleBlock(r.id)}
                          disabled={processingId === r.id}
                        >
                          <FiSlash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Details Modal */}
      {selectedRestaurant && (
        <div className="cart-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="form-card bg-dark text-white p-4 rounded" style={{ minWidth: '400px' }}>
            <h4 className="mb-4 fw-bold">{selectedRestaurant.name} Details</h4>
            <div className="mb-3">
              <label className="text-info small fw-bold">Restaurant ID</label>
              <div className="fw-semibold">#{selectedRestaurant.id}</div>
            </div>
            <div className="mb-3">
              <label className="text-info small fw-bold">FSSAI License Number</label>
              <div className="fw-semibold">{selectedRestaurant.licenseNumber || 'Not provided'}</div>
            </div>
            <div className="mb-3">
              <label className="text-info small fw-bold">GST Number</label>
              <div className="fw-semibold">{selectedRestaurant.gstNumber || 'Not provided'}</div>
            </div>
            <div className="mb-3">
              <label className="text-info small fw-bold">Address</label>
              <div className="fw-semibold">{selectedRestaurant.address || 'Not provided'}</div>
            </div>
            <div className="mb-3">
              <label className="text-info small fw-bold">Phone Number</label>
              <div className="fw-semibold">{selectedRestaurant.phoneNumber || 'Not provided'}</div>
            </div>
            <div className="mb-4">
              <label className="text-info small fw-bold">Location</label>
              <div className="fw-semibold">
                {selectedRestaurant.locationUrl ? (
                  <a href={selectedRestaurant.locationUrl} target="_blank" rel="noreferrer" className="text-info text-decoration-underline">View on Maps</a>
                ) : 'Not provided'}
              </div>
            </div>
            <button className="btn btn-secondary w-100" onClick={() => setSelectedRestaurant(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
