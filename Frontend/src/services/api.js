import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  getUserByUsername: (username) => api.get(`/users/${username}`),
  updateProfile: (data) => api.put('/users/me', data),
};

// Game API
export const gameAPI = {
  getAllGames: () => api.get('/games'),
  getGameById: (id) => api.get(`/games/${id}`),
  getGamesByCategory: (category) => api.get(`/games/category/${category}`),
  getGamesByDifficulty: (difficulty) => api.get(`/games/difficulty/${difficulty}`),
  startGame: (gameId) => api.post(`/games/${gameId}/start`),
  getUserSessions: () => api.get('/games/sessions'),
  getSessionById: (sessionId) => api.get(`/games/sessions/${sessionId}`),
  submitGame: (data) => api.post('/games/submit', data),
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobalLeaderboard: (limit = 100) => api.get(`/leaderboard/global?limit=${limit}`),
  getGameLeaderboard: (gameId, limit = 100) => api.get(`/leaderboard/game/${gameId}?limit=${limit}`),
};

export default api;
