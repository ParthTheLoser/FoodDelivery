import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/services';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const ROLES = [
  { value: 'USER', label: '🧑 Customer', desc: 'Order food from restaurants' },
  { value: 'RESTAURANT_OWNER', label: '🍴 Restaurant Owner', desc: 'Manage your restaurant' },
];

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed. Please try again.';
      toast.error(typeof msg === 'string' ? msg : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left visual */}
        <div className="auth-visual">
          <div className="auth-visual__content">
            <div className="food-emojis">
              {['🍕', '🍔', '🍜', '🌮', '🍱', '🍣', '🥗', '🍛'].map((emoji, i) => (
                <span key={i} className="floating-emoji" style={{ animationDelay: `${i * 0.3}s` }}>
                  {emoji}
                </span>
              ))}
            </div>
            <h3>Join FoodRush<br />Today!</h3>
            <p>Thousands of restaurants waiting for you</p>
          </div>
        </div>

        {/* Form */}
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🍕</div>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Start your food delivery journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role selector */}
            <div className="form-group-custom">
              <label className="form-label-custom">I am a...</label>
              <div className="role-selector">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={`role-option ${form.role === r.value ? 'role-option--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={handleChange}
                      className="visually-hidden"
                    />
                    <span className="role-label">{r.label}</span>
                    <span className="role-desc">{r.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Full Name</label>
              <div className="input-group-custom">
                <span className="input-icon"><FiUser /></span>
                <input
                  type="text"
                  name="name"
                  id="register-name"
                  className="form-input-custom"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Email Address</label>
              <div className="input-group-custom">
                <span className="input-icon"><FiMail /></span>
                <input
                  type="email"
                  name="email"
                  id="register-email"
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
                  id="register-password"
                  className="form-input-custom"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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
              id="register-submit-btn"
              className="btn-auth"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
