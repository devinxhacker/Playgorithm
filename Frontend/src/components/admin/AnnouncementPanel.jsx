import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBullhorn, FaPaperPlane, FaTimes, FaUsers, FaCheck, FaSpinner } from 'react-icons/fa';
import { notificationAPI } from '../../services/api';
import './AnnouncementPanel.css';

const AnnouncementPanel = ({ onNotification }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendToAll, setSendToAll] = useState(true);
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      onNotification?.('error', 'Please fill in both title and message');
      return;
    }

    setSending(true);
    try {
      await notificationAPI.createAnnouncement({
        title: title.trim(),
        message: message.trim(),
        sendToAll: sendToAll,
      });
      
      onNotification?.('success', 'Announcement sent successfully to all users!');
      setTitle('');
      setMessage('');
      setShowPreview(false);
    } catch (error) {
      console.error('Error sending announcement:', error);
      onNotification?.('error', error.response?.data?.error || 'Failed to send announcement');
    } finally {
      setSending(false);
    }
  };

  const characterCount = message.length;
  const maxCharacters = 500;

  return (
    <motion.div
      className="announcement-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="announcement-header">
        <div className="announcement-header-left">
          <FaBullhorn className="announcement-icon" />
          <div>
            <h2>Send Announcement</h2>
            <p>Broadcast important updates to all Playgorithm users</p>
          </div>
        </div>
      </div>

      <div className="announcement-form">
        <div className="form-group">
          <label htmlFor="announcement-title">
            <span>Title</span>
            <span className="required">*</span>
          </label>
          <input
            id="announcement-title"
            type="text"
            className="form-input"
            placeholder="Enter announcement title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
          <span className="char-count">{title.length}/100</span>
        </div>

        <div className="form-group">
          <label htmlFor="announcement-message">
            <span>Message</span>
            <span className="required">*</span>
          </label>
          <textarea
            id="announcement-message"
            className="form-textarea"
            placeholder="Write your announcement message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={maxCharacters}
            rows={5}
          />
          <span className={`char-count ${characterCount > maxCharacters * 0.9 ? 'warning' : ''}`}>
            {characterCount}/{maxCharacters}
          </span>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sendToAll}
              onChange={(e) => setSendToAll(e.target.checked)}
            />
            <span className="checkbox-custom">
              <FaCheck className="check-icon" />
            </span>
            <FaUsers className="users-icon" />
            <span>Send to all users</span>
          </label>
        </div>

        <div className="form-actions">
          <button
            className="preview-btn cursor-target"
            onClick={() => setShowPreview(true)}
            disabled={!title.trim() || !message.trim()}
          >
            Preview
          </button>
          <button
            className="send-btn cursor-target"
            onClick={handleSend}
            disabled={sending || !title.trim() || !message.trim()}
          >
            {sending ? (
              <>
                <FaSpinner className="spinner" />
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send Announcement
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="preview-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="preview-header">
                <h3>Preview Notification</h3>
                <button className="close-preview cursor-target" onClick={() => setShowPreview(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="preview-content">
                <div className="preview-notification">
                  <div className="preview-notification-icon">
                    <FaBullhorn />
                  </div>
                  <div className="preview-notification-body">
                    <div className="preview-notification-title">{title || 'Announcement Title'}</div>
                    <div className="preview-notification-message">{message || 'Your announcement message will appear here...'}</div>
                    <div className="preview-notification-time">Just now</div>
                  </div>
                </div>
              </div>

              <div className="preview-footer">
                <p>This is how users will see your announcement</p>
                <button
                  className="confirm-send-btn cursor-target"
                  onClick={() => {
                    setShowPreview(false);
                    handleSend();
                  }}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Confirm & Send'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnnouncementPanel;
