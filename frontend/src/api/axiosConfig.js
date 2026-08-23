import axios from 'axios';

// Dynamic API Base URL detection:
// - Uses VITE_API_BASE_URL environment variable if configured
// - If accessed on mobile via Vercel/Network, falls back to local machine network IP (172.16.2.65)
// - If accessed on local machine, uses localhost:8080
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'http://172.16.2.65:8080/api';
  }
  return 'http://localhost:8080/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Token into request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('anapoorna_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('anapoorna_token');
      localStorage.removeItem('anapoorna_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
