import React, { useState, useEffect, useCallback } from 'react';
import { menuAPI } from '../api/services';
import MenuCard from '../components/MenuCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Biryani', 'Pizza', 'Burger', 'Desserts', 'Drinks', 'Snacks'];

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('id,asc');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (debouncedQuery.trim()) {
        res = await menuAPI.searchMenu(debouncedQuery.trim(), page, 8, sortOrder);
      } else {
        res = await menuAPI.getAllMenu(page, 8, sortOrder);
      }
      setMenuItems(res.data.content || []);
      // Spring Page metadata is either at the root or under 'page'
      setTotalPages(res.data.page?.totalPages ?? res.data.totalPages ?? 1);
    } catch {
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, sortOrder]);

  useEffect(() => { setPage(0); }, [debouncedQuery, sortOrder]);
  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const filtered = menuItems.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchVeg = !vegOnly || item.veg;
    return matchCat && matchVeg;
  });

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🍽️ Full Menu</h1>
          <p className="page-subtitle">Browse everything we have to offer</p>
        </div>

        {/* Filters */}
        <div className="menu-filter-bar">
          <div className="menu-search-box">
            <FiSearch className="menu-search-icon" />
            <input
              type="text"
              id="menu-search-input"
              className="menu-search-input"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <select
              className="form-select form-select-sm bg-dark text-white border-secondary"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="id,asc">Default Sort</option>
              <option value="price,asc">Price: Low to High</option>
              <option value="price,desc">Price: High to Low</option>
              <option value="name,asc">Name: A to Z</option>
            </select>
            <label className="veg-toggle mb-0">
              <input type="checkbox" id="menu-veg-filter" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
              <span className="veg-toggle__slider" />
              <span className="veg-toggle__label">🟢 Veg Only</span>
            </label>
          </div>
        </div>

        <div className="category-scroll mb-4">
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

        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="skeleton-body">
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text short" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>🔍</div>
            <h4>No items found</h4>
            <p className="text-muted">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="menu-grid">{filtered.map((item) => <MenuCard key={item.id} item={item} />)}</div>
        )}

        {totalPages > 0 && (
          <div className="pagination-wrap d-flex justify-content-center align-items-center gap-2 mt-4">
            <button className="btn btn-outline-secondary btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            
            <div className="d-flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button className="btn btn-outline-secondary btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
