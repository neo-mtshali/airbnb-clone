import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Accommodation API calls
export const accommodationApi = {
  getAllAccommodations: () => api.get('/accommodations'),
  getAccommodationById: (id) => api.get(`/accommodations/${id}`),
  searchAccommodations: (params) => api.get('/accommodations/search', { params }),
  createAccommodation: (data) => api.post('/accommodations', data),
  updateAccommodation: (id, data) => api.put(`/accommodations/${id}`, data),
  deleteAccommodation: (id) => api.delete(`/accommodations/${id}`),
};

// User API calls
export const userApi = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/me'),
};

export default api;
