import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // optional if using cookies
  timeout: 0, // No timeout (let server respond even if it takes longer)
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url); // Debug log
    return config;
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

    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(
        new Error('Cannot connect to server. Please check if your backend server is running on http://localhost:8080')
      );
    }
    if (error.code === 'ERR_CONNECTION_REFUSED') {
      return Promise.reject(
        new Error('Connection refused. Please start your backend server on http://localhost:8080')
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
