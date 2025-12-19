import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FlaggedMessages.css';
import { FaCheckCircle, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080';

const FlaggedMessages = ({ token }) => {
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlaggedMessages();
  }, []);

  const fetchFlaggedMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/flagged`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFlaggedMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flagged messages:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (messageId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/messages/${messageId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Remove from list
      setFlaggedMessages(flaggedMessages.filter((msg) => msg.id !== messageId));
      alert('Message approved and published to community');
    } catch (error) {
      console.error('Error approving message:', error);
      alert('Failed to approve message');
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFlaggedMessages(flaggedMessages.filter((msg) => msg.id !== messageId));
      alert('Message deleted permanently');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flagged-messages-loading">
        <div className="spinner"></div>
        <p>Loading flagged messages...</p>
      </div>
    );
  }

  return (
    <div className="flagged-messages-container">
      <div className="flagged-header">
        <h2>
          <FaExclamationTriangle /> Flagged Messages for Review
        </h2>
        <p>Review and moderate messages flagged by the content filter</p>
      </div>

      {flaggedMessages.length === 0 ? (
        <div className="no-flagged-messages">
          <FaCheckCircle className="success-icon" />
          <p>No flagged messages! Community is clean and safe.</p>
        </div>
      ) : (
        <div className="flagged-messages-list">
          {flaggedMessages.map((message) => (
            <div key={message.id} className="flagged-message-card">
              <div className="flagged-message-header">
                <div className="user-info">
                  <span className="username">{message.username}</span>
                  <span className="time">{formatTime(message.createdAt)}</span>
                </div>
                <span className="flag-reason">Reason: Inappropriate Content</span>
              </div>

              <div className="flagged-message-content">
                <p>{message.content}</p>
                {message.imageUrl && (
                  <img
                    src={`${API_BASE_URL}${message.imageUrl}`}
                    alt="Message attachment"
                    className="flagged-message-image"
                  />
                )}
              </div>

              <div className="flagged-message-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(message.id)}
                >
                  <FaCheckCircle /> Approve & Publish
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(message.id)}
                >
                  <FaTrash /> Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlaggedMessages;
