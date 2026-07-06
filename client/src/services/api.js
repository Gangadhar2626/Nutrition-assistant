import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  getStats: () => api.get('/users/stats'),
  deleteUser: (id) => api.delete(`/users/${id}`),
  approveDietitian: (id) => api.put(`/users/${id}/approve`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  getClients: () => api.get('/users/clients'),
  getAvailableClients: () => api.get('/users/available-clients'),
};

export const mealPlanAPI = {
  getAll: () => api.get('/mealplans'),
  create: (data) => api.post('/mealplans', data),
  update: (id, data) => api.put(`/mealplans/${id}`, data),
  delete: (id) => api.delete(`/mealplans/${id}`),
  assign: (id, userId) => api.put(`/mealplans/${id}/assign`, { userId }),
};

export const progressAPI = {
  getAll: () => api.get('/progress'),
  create: (data) => api.post('/progress', data),
  update: (id, data) => api.put(`/progress/${id}`, data),
  delete: (id) => api.delete(`/progress/${id}`),
};

export default api;
