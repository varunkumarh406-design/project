import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Users API
export const getUserProfile = (id) => API.get(`/users/${id}`);
export const updateUserProfile = (data) => API.put('/users/update', data);
export const followUser = (id) => API.post(`/users/follow/${id}`);

// Trades API
export const createTrade = (data) => API.post('/trades', data);
export const getTradeFeed = () => API.get('/trades/feed');
export const likeTrade = (id) => API.post(`/trades/${id}/like`);
export const commentTrade = (id, data) => API.post(`/trades/${id}/comment`, data);

// Leaderboard API
export const getLeaderboard = () => API.get('/leaderboard');

export default API;
