import React, { useState, useEffect } from 'react';
import { userAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiEdit3, FiSave, FiX } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, login, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phoneNumber: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getProfile();
        setProfile(res.data);
        setForm({ name: res.data.name || '', phoneNumber: res.data.phoneNumber || '' });
      } catch (err) {
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userAPI.updateProfile(form);
      setProfile(res.data);
      login(token, res.data);
      toast.success('Profile updated successfully! ✅');
      setEditing(false);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const ROLE_COLORS = { USER: 'success', RESTAURANT_OWNER: 'warning', ADMIN: 'danger' };

  if (!profile) {
    return (
      <div className="page-wrapper d-flex justify-content-center align-items-center">
        <div className="spinner-border text-warning" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-card__header">
                <div className="profile-avatar">
                  {profile.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="mb-0 fw-bold">{profile.name}</h3>
                  <span className={`badge bg-${ROLE_COLORS[profile.role] || 'secondary'} mt-1`}>
                    {profile.role}
                  </span>
                </div>
                {!editing && (
                  <button
                    className="btn-icon ms-auto"
                    onClick={() => setEditing(true)}
                    id="edit-profile-btn"
                  >
                    <FiEdit3 size={20} />
                  </button>
                )}
              </div>

              <div className="profile-card__body">
                {!editing ? (
                  <div className="profile-info">
                    <div className="profile-info__item">
                      <FiUser className="profile-info__icon" />
                      <div>
                        <label>Full Name</label>
                        <p>{profile.name || '—'}</p>
                      </div>
                    </div>
                    <div className="profile-info__item">
                      <FiMail className="profile-info__icon" />
                      <div>
                        <label>Email Address</label>
                        <p>{profile.email || '—'}</p>
                      </div>
                    </div>
                    <div className="profile-info__item">
                      <FiPhone className="profile-info__icon" />
                      <div>
                        <label>Phone Number</label>
                        <p>{profile.phoneNumber || '—'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} className="profile-form">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        id="profile-name"
                        className="form-control form-control-lg"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        id="profile-phone"
                        className="form-control form-control-lg"
                        value={form.phoneNumber}
                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                        pattern="[0-9]{10}"
                        placeholder="10-digit phone number"
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <FiSave className="me-2" />}
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setEditing(false)}
                      >
                        <FiX className="me-1" />Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
