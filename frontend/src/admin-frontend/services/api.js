import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = 'http://localhost:5001/api';

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
    console.log('Making login request to:', `${API_URL}/users/login`);
    const response = await api.post('/users/login', { email, password });
    console.log('Login API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      throw { 
        message: error.response.data?.message || 'Authentication failed', 
        status: error.response.status 
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      throw { message: 'No response from server. Please check if the backend is running.' };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      throw { message: error.message || 'Unknown error occurred' };
    }
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
