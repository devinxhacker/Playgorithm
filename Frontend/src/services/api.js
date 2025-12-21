import axios from 'axios';

export const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

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
  adminSignup: (data) => api.post('/auth/admin/signup', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  getUserByUsername: (username) => api.get(`/users/${username}`),
  updateProfile: (data) => api.put('/users/me', data),
  getUserRank: () => api.get('/users/me/rank'),
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
  completeGame: (data) => api.post('/games/complete', data),
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobalLeaderboard: (limit = 100) => api.get(`/leaderboard/global?limit=${limit}`),
  getGameLeaderboard: (gameId, limit = 100) => api.get(`/leaderboard/game/${gameId}?limit=${limit}`),
};

export const copilotAPI = {
  createSession: (payload) => api.post('/copilot/session', payload),
  publishEvent: (payload) => api.post('/copilot/event', payload),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getGames: () => api.get('/admin/games'),
  createGame: (data) => api.post('/admin/games', data),
  updateGame: (gameId, data) => api.put(`/admin/games/${gameId}`, data),
  updateGameStatus: (gameId, isActive) => api.patch(`/admin/games/${gameId}/status`, {}, { params: { isActive } }),
  deleteGame: (gameId) => api.delete(`/admin/games/${gameId}`),
};

// Rating API
export const ratingAPI = {
  rateGame: (gameId, rating) => api.post(`/ratings/games/${gameId}`, { rating }),
  getGameRatingStats: (gameId) => api.get(`/ratings/games/${gameId}/stats`),
  deleteRating: (gameId) => api.delete(`/ratings/games/${gameId}`),
};

// Comment API
export const commentAPI = {
  addComment: (gameId, content, parentCommentId = null) => 
    api.post(`/comments/games/${gameId}`, { content, parentCommentId }),
  getTopLevelComments: (gameId) => api.get(`/comments/games/${gameId}`),
  getReplies: (commentId) => api.get(`/comments/${commentId}/replies`),
  updateComment: (commentId, content) => api.put(`/comments/${commentId}`, { content }),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  toggleReaction: (commentId, reactionType) => 
    api.post(`/comments/${commentId}/reactions`, { reactionType }),
  getCommentCount: (gameId) => api.get(`/comments/games/${gameId}/count`),
};

export default api;
