import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const login = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Accommodation API
export const getAccommodations = async () => {
  try {
    const response = await api.get('/accommodations');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

export const getAccommodation = async (id) => {
  try {
    const response = await api.get(`/accommodations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

export const createAccommodation = async (accommodationData) => {
  try {
    const response = await api.post('/accommodations', accommodationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

export const updateAccommodation = async (id, accommodationData) => {
  try {
    const response = await api.put(`/accommodations/${id}`, accommodationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

export const deleteAccommodation = async (id) => {
  try {
    const response = await api.delete(`/accommodations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

// Reservation API
export const getReservations = async () => {
  try {
    const response = await api.get('/reservations');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

export default api;
