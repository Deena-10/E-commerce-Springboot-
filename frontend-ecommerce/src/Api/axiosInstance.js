import axios from 'axios';
import config from '../config/env';

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true, // optional if using cookies
  timeout: 0, // No timeout (let server respond even if it takes longer)
});

axiosInstance.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', requestConfig.url); // Debug log
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status); // Debug log
    return response;
  },
  (error) => {
    console.error('Request error:', error); // Debug log

    // Handle 401 Unauthorized - redirect to login (but not for auth endpoints)
    if (error.response?.status === 401 && !error.config?.url?.includes('/api/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }

    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(
        new Error(`Cannot connect to server. Please check if your backend server is running on ${config.API_BASE_URL}`)
      );
    }
    if (error.code === 'ERR_CONNECTION_REFUSED') {
      return Promise.reject(
        new Error(`Connection refused. Please start your backend server on ${config.API_BASE_URL}`)
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
