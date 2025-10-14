// src/api/axiosInstance.js

import axios from 'axios';

// 1. Define baseUrl FIRST from environment variables.
// It's good practice to add a fallback for local development if the .env variable is not found.
export const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 2. Create the Axios instance using the baseUrl defined ABOVE.
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// 3. The interceptor remains the same. It correctly adds the token to every request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // It's slightly more conventional to use bracket notation for the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // This part handles errors that happen before the request is sent
    return Promise.reject(error);
  }
);

// 4. Export the configured instance as the default export.
export default axiosInstance;