import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './MessageCenter.css';
import { FaComments, FaImage, FaPaperPlane, FaTimes, FaTrash } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080';

const MessageCenter = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const availableEmojis = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  // Fetch recent messages on mount
  useEffect(() => {
    fetchRecentMessages();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    if (user) {
      connectWebSocket();
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchRecentMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/recent?limit=50`);
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS(`${API_BASE_URL}/ws/community`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      setConnected(true);

      // Subscribe to public messages
      client.subscribe('/topic/messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => {
          // Check if message already exists to prevent duplicates
          const exists = prevMessages.some(msg => msg.id === receivedMessage.id);
          if (exists) return prevMessages;
          return [...prevMessages, receivedMessage];
        });
      });

      // Subscribe to message deletions
      client.subscribe('/topic/messages/delete', (message) => {
        const deletedMessageId = message.body;
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== deletedMessageId)
        );
      });

      // Subscribe to reaction updates
      client.subscribe('/topic/messages/reaction', (message) => {
        const updatedMessage = JSON.parse(message.body);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        );
      });
    };

    client.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setConnected(false);
    };

    client.activate();
    setStompClient(client);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage();
        if (!imageUrl) return;
      }

      const messageData = {
        content: newMessage.trim(),
        imageUrl: imageUrl,
        replyToMessageId: replyTo?.id || null,
      };

      await axios.post(`${API_BASE_URL}/api/messages`, messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear input
      setNewMessage('');
      handleRemoveImage();
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.status === 400 || error.response?.status === 403) {
        const errorMessage = error.response?.data?.error || 
                            'Your message contains inappropriate content and cannot be posted. Please review our community guidelines and avoid using offensive language or inappropriate content.';
        alert('⚠️ MESSAGE BLOCKED\n\n' + errorMessage);
      } else {
        alert('Failed to send message. Please try again.');
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/messages/${messageId}/react`,
        { emoji },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowEmojiPicker(null);
    } catch (error) {
      console.error('Error reacting to message:', error);
      alert('Failed to react to message');
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <div className="message-center">
      <div className="message-center-container">
        <div className="message-center-header">
          <h1>
            <FaComments />
            Community Chat
          </h1>
          <div className="online-count">
            <span className="online-dot"></span>
            <span>Live</span>
          </div>
        </div>

        {connected && (
          <div className="connection-status connected">
            ✓ Connected - Messages will update in real-time
          </div>
        )}

        {!connected && !loading && (
          <div className="connection-status disconnected">
            ⚠ Disconnected - Attempting to reconnect...
          </div>
        )}

        <div className="messages-container">
          {loading ? (
            <div className="loading-messages">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="no-messages">
              <div className="no-messages-icon">💬</div>
              <p>No messages yet. Be the first to say hello!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="message-item">
                <div className="message-avatar">
                  {message.userAvatar ? (
                    <img src={message.userAvatar} alt={message.username} />
                  ) : (
                    getInitials(message.username)
                  )}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-username">{message.username}</span>
                    <span className="message-time">{formatTime(message.createdAt)}</span>
                    {message.flagged && (
                      <span className="message-flagged-badge">FLAGGED</span>
                    )}
                  </div>
                  {message.replyToMessageId && (
                    <div className="reply-indicator">
                      <span className="reply-icon">↩️</span>
                      <span className="reply-to-username">@{message.replyToUsername}</span>
                      <span className="reply-to-content">{message.replyToContent?.substring(0, 50)}{message.replyToContent?.length > 50 ? '...' : ''}</span>
                    </div>
                  )}
                  <div className="message-text">{message.content}</div>
                  {message.imageUrl && (
                    <img
                      src={`${API_BASE_URL}${message.imageUrl}`}
                      alt="Message attachment"
                      className="message-image"
                    />
                  )}
                  
                  {/* Reactions Display */}
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="reactions-display">
                      {Object.entries(message.reactions).map(([emoji, userIds]) => (
                        userIds.length > 0 && (
                          <button
                            key={emoji}
                            className={`reaction-bubble ${userIds.includes(user?.id) ? 'reacted' : ''}`}
                            onClick={() => handleReaction(message.id, emoji)}
                          >
                            {emoji} <span className="reaction-count">{userIds.length}</span>
                          </button>
                        )
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="message-actions">
                    <button
                      className="message-action-btn message-reaction-btn"
                      onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                    >
                      😊 React
                    </button>
                    <button
                      className="message-action-btn message-reply-btn"
                      onClick={() => handleReply(message)}
                    >
                      ↩️ Reply
                    </button>
                    {user && message.userId === user.id && (
                      <button
                        className="message-action-btn message-delete-btn"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>

                  {/* Emoji Picker */}
                  {showEmojiPicker === message.id && (
                    <div className="emoji-picker">
                      {availableEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          className="emoji-option"
                          onClick={() => handleReaction(message.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input-container">
          <div className="message-input-wrapper">
            {replyTo && (
              <div className="reply-preview">
                <div className="reply-preview-content">
                  <span className="reply-preview-label">Replying to @{replyTo.username}</span>
                  <span className="reply-preview-text">{replyTo.content.substring(0, 50)}{replyTo.content.length > 50 ? '...' : ''}</span>
                </div>
                <button className="reply-preview-close" onClick={cancelReply}>
                  <FaTimes />
                </button>
              </div>
            )}
            <div className="message-input-area">
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button className="remove-image-btn" onClick={handleRemoveImage}>
                    <FaTimes />
                  </button>
                </div>
              )}
              <textarea
                className="message-input"
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={2}
              />
            </div>
            <div className="message-input-buttons">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <button
                className="upload-image-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaImage /> Image
              </button>
              <button
                className="send-message-btn"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && !selectedImage}
              >
                <FaPaperPlane /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
