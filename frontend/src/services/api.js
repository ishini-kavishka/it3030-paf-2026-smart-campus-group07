import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;
