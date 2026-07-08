import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiPlus } from 'react-icons/fi';
import { MdRestaurantMenu, MdDashboard } from 'react-icons/md';

const Navbar = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top app-navbar">
        <div className="container">
          {/* Brand */}
          <Link className="navbar-brand brand-logo" to="/">
            <span className="brand-icon">🍕</span>
            <span className="brand-text">FoodRush</span>
          </Link>

          {/* Mobile toggle */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
            aria-controls="navbarMain"
            aria-expanded="false"
          >
            <FiMenu color="#ff6b35" size={24} />
          </button>

          {/* Nav links */}
          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/')}`} to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/menu')}`} to="/menu">
                  Menu
                </Link>
              </li>
              {isAuthenticated && role === 'USER' && (
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/my-orders')}`} to="/my-orders">
                    My Orders
                  </Link>
                </li>
              )}
              {isAuthenticated && role === 'RESTAURANT_OWNER' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/restaurant/dashboard')}`} to="/restaurant/dashboard">
                      <MdDashboard className="me-1" />Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/restaurant/menu')}`} to="/restaurant/menu">
                      <MdRestaurantMenu className="me-1" />Manage Menu
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated && role === 'ADMIN' && (
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/admin')}`} to="/admin">
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>

            {/* Right side */}
            <div className="d-flex align-items-center gap-3">
              {isAuthenticated && role === 'USER' && (
                <button
                  className="btn btn-cart position-relative"
                  onClick={() => setShowCart(true)}
                  id="cart-btn"
                >
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </button>
              )}

              {isAuthenticated ? (
                <div className="dropdown" onMouseLeave={() => setShowDropdown(false)}>
                  <button
                    className="btn btn-user dropdown-toggle"
                    id="userDropdown"
                    onClick={() => setShowDropdown(!showDropdown)}
                    aria-expanded={showDropdown}
                  >
                    <FiUser size={16} className="me-1" />
                    <span className="d-none d-md-inline">
                      {user?.name && !user.name.includes('@') ? user.name : (user?.email?.split('@')[0] || 'Account')}
                    </span>
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end app-dropdown ${showDropdown ? 'show' : ''}`} aria-labelledby="userDropdown">
                    <li>
                      <span className="dropdown-item-text text-muted small">
                        {user?.email}
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    {role === 'RESTAURANT_OWNER' && (
                      <li>
                        <Link className="dropdown-item" to="/restaurant/create" onClick={() => setShowDropdown(false)}>
                          <FiPlus className="me-2" />Add Restaurant
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={() => setShowDropdown(false)}>
                        <FiUser className="me-2" />Profile
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <FiLogOut className="me-2" />Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-primary btn-sm px-3">Login</Link>
                  <Link to="/register" className="btn btn-primary btn-sm px-3">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer show={showCart} onHide={() => setShowCart(false)} />
    </>
  );
};

export default Navbar;
