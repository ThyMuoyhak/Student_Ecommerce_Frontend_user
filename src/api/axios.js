import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://ecommerce-backend-ygw2.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to EVERY request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    console.log(`[Axios] ${config.method?.toUpperCase()} ${config.url}`);
    console.log('[Axios] Token from localStorage:', token ? `${token.substring(0, 50)}...` : 'NO TOKEN');
    
    // IMPORTANT: Always add token if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Axios] Added Authorization header:', config.headers.Authorization);
    } else {
      console.log('[Axios] No token available');
    }
    
    // Don't override Content-Type for FormData
    if (config.data instanceof FormData) {
      console.log('[Axios] FormData detected, letting browser set Content-Type');
      delete config.headers['Content-Type'];
    }
    
    console.log('[Axios] Final headers:', JSON.stringify(config.headers, null, 2));
    
    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Axios] Response ${response.status}: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[Axios] Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('[Axios] Unauthorized - clearing storage and redirecting');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;