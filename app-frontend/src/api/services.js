import axiosInstance from './axiosInstance';

export const authAPI = {
  login: (data) => axiosInstance.post('/api/auth/login', data),
  register: (data) => axiosInstance.post('/api/auth/register', data),
};

export const userAPI = {
  getProfile: () => axiosInstance.get('/api/user/profile'),
  updateProfile: (data) => axiosInstance.put('/api/user/profile', data),
};

export const menuAPI = {
  // Spring Page response: { content, totalPages, totalElements, size, number, ... }
  getAllMenu: (page = 0, size = 8, sort = 'id,asc') =>
    axiosInstance.get('/api/menu', { params: { page, size, ...(sort && { sort }) } }),
  searchMenu: (keyword, page = 0, size = 8, sort = 'id,asc') =>
    axiosInstance.get('/api/menu/search', { params: { keyword, page, size, ...(sort && { sort }) } }),
};

export const orderAPI = {
  // Backend expects List<OrderItem> — each: { menuItem: { id }, quantity }
  checkout: (restaurantId, items) =>
    axiosInstance.post(`/api/orders/checkout/${restaurantId}`, items),
  getMyOrders: () => axiosInstance.get('/api/orders/my-orders'),
};

export const restaurantAPI = {
  // Returns list of restaurants owned by the authenticated user (with isVerified status)
  getMyRestaurants: () => axiosInstance.get('/api/restaurant/my'),

  // Backend: @Valid @RequestBody Restaurant — expects JSON: { name, address, phoneNumber, locationUrl }
  create: (data) => axiosInstance.post('/api/restaurant/create', data),

  // Backend: @RequestBody Restaurant
  updateProfile: (restaurantId, data) =>
    axiosInstance.put(`/api/restaurant/${restaurantId}/profile`, data),

  // Backend: @RequestParam name, category, isVeg, price + optional MultipartFile image
  addMenuItem: (restaurantId, params, imageFile) => {
    const formData = new FormData();
    if (imageFile) formData.append('image', imageFile);
    // Params go as query params (not in formData body)
    const searchParams = new URLSearchParams();
    searchParams.append('name', params.name);
    searchParams.append('category', params.category);
    searchParams.append('isVeg', String(params.isVeg));
    searchParams.append('price', String(params.price));
    return axiosInstance.post(
      `/api/restaurant/${restaurantId}/menu?${searchParams.toString()}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  updateMenuItem: (restaurantId, menuItemId, params, imageFile) => {
    const formData = new FormData();
    if (imageFile) formData.append('image', imageFile);
    const searchParams = new URLSearchParams();
    searchParams.append('name', params.name);
    searchParams.append('category', params.category);
    searchParams.append('isVeg', String(params.isVeg));
    searchParams.append('price', String(params.price));
    return axiosInstance.put(
      `/api/restaurant/${restaurantId}/menu/${menuItemId}?${searchParams.toString()}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  deleteMenuItem: (restaurantId, menuItemId) =>
    axiosInstance.delete(`/api/restaurant/${restaurantId}/menu/${menuItemId}`),

  getOrders: (restaurantId) =>
    axiosInstance.get(`/api/restaurant/${restaurantId}/orders`),

  // Backend: @RequestBody Map<String, String> payload — expects { status: "..." }
  updateOrderStatus: (orderId, status) =>
    axiosInstance.put(`/api/restaurant/orders/${orderId}/status`, { status }),
};

export const adminAPI = {
  getAllRestaurants: () => axiosInstance.get('/api/admin/restaurants'),
  verifyRestaurant: (id) => axiosInstance.put(`/api/admin/verify-restaurant/${id}`),
  blockRestaurant: (id) => axiosInstance.put(`/api/admin/block-restaurant/${id}`),
};
