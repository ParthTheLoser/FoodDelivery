import React, { useState, useEffect, useCallback } from 'react';
import { menuAPI } from '../api/services';
import MenuCard from '../components/MenuCard';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineDeliveryDining, MdAccessTime } from 'react-icons/md';
import { BiDish } from 'react-icons/bi';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Biryani', 'Pizza', 'Burger', 'Desserts', 'Drinks', 'Snacks'];

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (debouncedQuery.trim()) {
        res = await menuAPI.searchMenu(debouncedQuery.trim(), page, 12);
      } else {
        res = await menuAPI.getAllMenu(page, 12);
      }
      const data = res.data;
      // Spring Page: { content, totalPages, totalElements, size, number }
      setMenuItems(data.content || []);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page]);

  useEffect(() => {
    setPage(0);
  }, [debouncedQuery]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const filteredItems = menuItems.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchVeg = !vegOnly || item.veg;
    return matchCategory && matchVeg;
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-badge">🔥 Fast Delivery</div>
              <h1 className="hero-title">
                Order food you<br />
                <span className="hero-highlight">absolutely love</span>
              </h1>
              <p className="hero-subtitle">
                Discover the best food from over 500 restaurants in your city, delivered right to your door.
              </p>

              {/* Search bar */}
              <div className="hero-search">
                <FiSearch className="hero-search__icon" />
                <input
                  type="text"
                  id="hero-search-input"
                  className="hero-search__input"
                  placeholder="Search for dishes, restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="hero-search__clear" onClick={() => setSearchQuery('')}>×</button>
                )}
              </div>

              {/* Stats */}
              <div className="hero-stats">
                <div className="hero-stat">
                  <MdOutlineDeliveryDining size={24} className="text-warning" />
                  <span>30 min delivery</span>
                </div>
                <div className="hero-stat">
                  <BiDish size={24} className="text-warning" />
                  <span>500+ dishes</span>
                </div>
                <div className="hero-stat">
                  <MdAccessTime size={24} className="text-warning" />
                  <span>Order anytime</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div className="hero-illustration">
                <div className="hero-food-circle">
                  {['🍕', '🍔', '🍜', '🌮', '🍱', '🍣'].map((emoji, i) => (
                    <div
                      key={i}
                      className="hero-food-item"
                      style={{
                        transform: `rotate(${i * 60}deg) translateY(-120px)`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    >
                      <span>{emoji}</span>
                    </div>
                  ))}
                  <div className="hero-food-center">🍽️</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section container">
        {/* Category Filter */}
        <div className="section-header">
          <h2 className="section-title">
            {debouncedQuery ? `Results for "${debouncedQuery}"` : 'Explore Our Menu'}
          </h2>
          <div className="filter-toggle">
            <label className="veg-toggle" htmlFor="veg-filter">
              <input
                type="checkbox"
                id="veg-filter"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
              />
              <span className="veg-toggle__slider" />
              <span className="veg-toggle__label">🟢 Veg Only</span>
            </label>
          </div>
        </div>

        <div className="category-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'category-pill--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="skeleton-body">
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text short" />
                  <div className="skeleton skeleton-text shorter" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>🔍</div>
            <h4>No items found</h4>
            <p className="text-muted">Try a different search or category</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-wrap">
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {page + 1} of {totalPages}
            </span>
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
