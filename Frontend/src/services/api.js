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
  getGlobalLeaderboard: (limit = 100) => api.get(`/users/leaderboard?limit=${limit}`),
  getGameLeaderboard: (gameId, limit = 100) => api.get(`/leaderboard/game/${gameId}?limit=${limit}`),
};

// Message/Chat API
export const messageAPI = {
  getRecentMessages: (limit = 50) => api.get(`/messages/recent?limit=${limit}`),
  sendMessage: (data) => api.post('/messages', data),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  toggleReaction: (messageId, emoji) => api.post(`/messages/${messageId}/react`, { emoji }),
  getUnreadCount: () => api.get('/messages/unread/count'),
  markAsRead: (lastMessageId) => api.post('/messages/mark-read', { lastMessageId }),
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

// Notification API
export const notificationAPI = {
  // Get all notifications with pagination
  getNotifications: (page = 0, size = 20) => 
    api.get(`/notifications?page=${page}&size=${size}`),
  
  // Get notifications filtered by type
  getNotificationsByType: (type, page = 0, size = 20) => 
    api.get(`/notifications/filter?type=${type}&page=${page}&size=${size}`),
  
  // Get all unread notifications
  getUnreadNotifications: () => api.get('/notifications/unread'),
  
  // Get unread notification count
  getUnreadCount: () => api.get('/notifications/unread/count'),
  
  // Mark a notification as read
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  
  // Mark all notifications as read
  markAllAsRead: () => api.put('/notifications/read-all'),
  
  // Delete a notification
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
  
  // Clear all notifications
  clearAll: () => api.delete('/notifications/clear-all'),
  
  // Create announcement (Admin only)
  createAnnouncement: (data) => api.post('/notifications/announcement', data),
};

export default api;
