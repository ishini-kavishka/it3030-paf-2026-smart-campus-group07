import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Auto-logout on 401 (expired/invalid token) or 403 (forbidden)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            // Clear the stored session
            localStorage.removeItem('user');
            // Redirect to login — works outside React components
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const resourceService = {
  // Get all resources with optional filters
  getAllResources: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.location) params.append('location', filters.location);
    if (filters.status) params.append('status', filters.status);
    if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
    
    const response = await api.get('/resources', { params });
    return response.data;
  },

  // Get single resource
  getResourceById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  // Get active resources
  getActiveResources: async () => {
    const response = await api.get('/resources/active');
    return response.data;
  },

  // Create new resource
  createResource: async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data;
  },

  // Update existing resource
  updateResource: async (id, resourceData) => {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data;
  },

  // Delete resource
  deleteResource: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  },

  // Patch status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/resources/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};

export const bookingService = {
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  updateBookingStatus: async (id, status, reason) => {
    const response = await api.patch(`/bookings/${id}/status`, { status, reason });
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};

export const notificationService = {
  // Get all notifications for the current user
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Delete a specific notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

export default api;
