import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { messageAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const response = await messageAPI.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [isAuthenticated, user]);

  // Mark messages as read
  const markAsRead = useCallback(async (lastMessageId = null) => {
    if (!isAuthenticated || !user) return;
    
    try {
      await messageAPI.markAsRead(lastMessageId);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [isAuthenticated, user]);

  // Setup WebSocket connection for real-time unread updates
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const socket = new SockJS(`${API_BASE_URL}/ws/community`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Chat WS:', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to chat WebSocket');
      setConnected(true);

      // Subscribe to new messages to increment unread count
      client.subscribe('/topic/messages', (message) => {
        const newMessage = JSON.parse(message.body);
        // Only increment if not from current user
        if (newMessage.userId !== user.id) {
          setUnreadCount(prev => prev + 1);
        }
      });

      // Subscribe to unread count updates
      client.subscribe(`/topic/messages/unread/${user.id}`, (message) => {
        const data = JSON.parse(message.body);
        setUnreadCount(data.count);
      });
    };

    client.onDisconnect = () => {
      console.log('Disconnected from chat WebSocket');
      setConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('Chat STOMP error:', frame);
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
    }
  }, [isAuthenticated, user, fetchUnreadCount]);

  const value = {
    unreadCount,
    connected,
    fetchUnreadCount,
    markAsRead,
    setUnreadCount,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
