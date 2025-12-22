import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { notificationAPI } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, or specific type
  const stompClientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch notifications
  const fetchNotifications = useCallback(async (resetPage = false) => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoading(true);
      const currentPage = resetPage ? 0 : page;
      
      let response;
      if (filter === 'UNREAD') {
        response = await notificationAPI.getUnreadNotifications();
        setNotifications(response.data);
        setHasMore(false);
      } else if (filter !== 'ALL') {
        response = await notificationAPI.getNotificationsByType(filter, currentPage, 20);
        if (resetPage) {
          setNotifications(response.data.content);
        } else {
          setNotifications(prev => [...prev, ...response.data.content]);
        }
        setHasMore(!response.data.last);
      } else {
        response = await notificationAPI.getNotifications(currentPage, 20);
        if (resetPage) {
          setNotifications(response.data.content);
        } else {
          setNotifications(prev => [...prev, ...response.data.content]);
        }
        setHasMore(!response.data.last);
      }
      
      if (resetPage) {
        setPage(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, page, filter]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [isAuthenticated, user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      await notificationAPI.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    try {
      await notificationAPI.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, []);

  // Load more notifications
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Change filter
  const changeFilter = useCallback((newFilter) => {
    setFilter(newFilter);
    setPage(0);
    setNotifications([]);
    setHasMore(true);
  }, []);

  // Setup WebSocket connection for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const socket = new SockJS(`${API_BASE_URL}/ws/community`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Notification WS:', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to notification WebSocket');
      setConnected(true);

      // Subscribe to user-specific notifications
      client.subscribe(`/topic/notifications/${user.id}`, (message) => {
        const notification = JSON.parse(message.body);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Play notification sound (optional)
        playNotificationSound();
        
        // Show browser notification if permitted
        showBrowserNotification(notification);
      });

      // Subscribe to unread count updates
      client.subscribe(`/topic/notifications/${user.id}/count`, (message) => {
        const count = parseInt(message.body, 10);
        setUnreadCount(count);
      });
    };

    client.onDisconnect = () => {
      console.log('Disconnected from notification WebSocket');
      setConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setConnected(false);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [isAuthenticated, user?.id, API_BASE_URL]);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUnreadCount();
      fetchNotifications(true);
    }
  }, [isAuthenticated, user]);

  // Refetch when filter or page changes
  useEffect(() => {
    if (isAuthenticated && user && page > 0) {
      fetchNotifications(false);
    }
  }, [page]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications(true);
    }
  }, [filter]);

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {
      // Ignore audio errors
    }
  };

  // Show browser notification
  const showBrowserNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.senderAvatar || '/favicon.ico',
        tag: notification.id,
      });
    }
  };

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT': return '📢';
      case 'MESSAGE_REPLY': return '💬';
      case 'MESSAGE_REACTION': return '👍';
      case 'COMMENT_REPLY': return '💭';
      case 'COMMENT_REACTION': return '❤️';
      case 'ACHIEVEMENT': return '🏆';
      case 'LEVEL_UP': return '🎉';
      case 'GAME_INVITE': return '🎮';
      case 'SYSTEM': return '⚙️';
      default: return '🔔';
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT': return '#ff6b35';
      case 'MESSAGE_REPLY': return '#00d4ff';
      case 'MESSAGE_REACTION': return '#ffd700';
      case 'COMMENT_REPLY': return '#9b59b6';
      case 'COMMENT_REACTION': return '#e91e63';
      case 'ACHIEVEMENT': return '#2ecc71';
      case 'LEVEL_UP': return '#f39c12';
      case 'GAME_INVITE': return '#3498db';
      case 'SYSTEM': return '#95a5a6';
      default: return '#00d4ff';
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    hasMore,
    filter,
    connected,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    loadMore,
    changeFilter,
    requestNotificationPermission,
    getNotificationIcon,
    getNotificationColor,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
