import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import RestaurantDashboard from './pages/RestaurantDashboard';
import ManageMenuPage from './pages/ManageMenuPage';
import CreateRestaurantPage from './pages/CreateRestaurantPage';
import AdminPanel from './pages/AdminPanel';

// Simple full-menu page reusing HomePage
import MenuPage from './pages/MenuPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* User */}
              <Route path="/my-orders" element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Restaurant Owner */}
              <Route path="/restaurant/dashboard" element={
                <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/menu" element={
                <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
                  <ManageMenuPage />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/create" element={
                <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
                  <CreateRestaurantPage />
                </ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPanel />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Toast Notifications */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e1e2e',
                color: '#fff',
                border: '1px solid rgba(255,107,53,0.3)',
              },
              success: { iconTheme: { primary: '#ff6b35', secondary: '#fff' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
