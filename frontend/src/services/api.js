import axios from 'axios';

// Hardcoded for Vercel deployment
const API_BASE_URL = 'https://aqua-mind-ai.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
