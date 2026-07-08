import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../api/services';

import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);

      // API returns: { token, role, userId }
      const { token, role, userId } = res.data;

      if (!token) {
        toast.error('Login failed: no token received.');
        return;
      }

      // Temporarily set the cookie so userAPI can immediately pick it up
      document.cookie = `token=${token}; path=/; max-age=86400`;

      let userData = { role, userId, email: form.email, name: form.email.split('@')[0] };
      
      try {
        // Fetch real profile from backend right after login
        const profileRes = await userAPI.getProfile();
        userData = { ...userData, ...profileRes.data };
      } catch (err) {
        console.warn('Could not fetch full profile during login', err);
      }

      login(token, userData);
      toast.success('Welcome back! 👋');

      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'RESTAURANT_OWNER') navigate('/restaurant/dashboard');
      else navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Login failed. Please check your credentials.';
      toast.error(typeof msg === 'string' ? msg : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">🍕</div>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue your food journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group-custom">
              <label className="form-label-custom">Email Address</label>
              <div className="input-group-custom">
                <span className="input-icon"><FiMail /></span>
                <input
                  type="email"
                  name="email"
                  id="login-email"
                  className="form-input-custom"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Password</label>
              <div className="input-group-custom">
                <span className="input-icon"><FiLock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="login-password"
                  className="form-input-custom"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="btn-auth"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Sign up for free</Link>
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-visual">
          <div className="auth-visual__content">
            <div className="food-emojis">
              {['🍕', '🍔', '🍜', '🌮', '🍱', '🍣', '🥗', '🍛'].map((emoji, i) => (
                <span key={i} className="floating-emoji" style={{ animationDelay: `${i * 0.3}s` }}>
                  {emoji}
                </span>
              ))}
            </div>
            <h3>Delicious food,<br />delivered fast</h3>
            <p>Order from 500+ restaurants in your city</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
