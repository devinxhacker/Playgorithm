import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, FaTimes, FaCheck, FaCheckDouble, FaTrash, 
  FaFilter, FaChevronDown, FaExternalLinkAlt, FaSpinner,
  FaBullhorn, FaComment, FaReply, FaHeart, FaTrophy,
  FaLevelUpAlt, FaGamepad, FaCog
} from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import './NotificationModal.css';

const NOTIFICATION_FILTERS = [
  { key: 'ALL', label: 'All', icon: FaBell },
  { key: 'UNREAD', label: 'Unread', icon: FaCheck },
  { key: 'ANNOUNCEMENT', label: 'Announcements', icon: FaBullhorn },
  { key: 'MESSAGE_REPLY', label: 'Message Replies', icon: FaReply },
  { key: 'MESSAGE_REACTION', label: 'Message Reactions', icon: FaHeart },
  { key: 'COMMENT_REPLY', label: 'Comment Replies', icon: FaComment },
  { key: 'COMMENT_REACTION', label: 'Comment Reactions', icon: FaHeart },
  { key: 'ACHIEVEMENT', label: 'Achievements', icon: FaTrophy },
  { key: 'LEVEL_UP', label: 'Level Ups', icon: FaLevelUpAlt },
];

const NotificationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    filter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    loadMore,
    changeFilter,
    getNotificationIcon,
    getNotificationColor,
  } = useNotifications();

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const modalRef = useRef(null);
  const listRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Infinite scroll
  const handleScroll = () => {
    if (!listRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !loading) {
      loadMore();
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'MESSAGE_REPLY':
      case 'MESSAGE_REACTION':
        navigate('/community');
        onClose();
        break;
      case 'COMMENT_REPLY':
      case 'COMMENT_REACTION':
        if (notification.additionalData) {
          navigate('/dashboard');
          onClose();
        }
        break;
      case 'ACHIEVEMENT':
      case 'LEVEL_UP':
        navigate('/profile');
        onClose();
        break;
      default:
        break;
    }
  };

  // Get icon component for notification type
  const getIconComponent = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT': return FaBullhorn;
      case 'MESSAGE_REPLY': return FaReply;
      case 'MESSAGE_REACTION': return FaHeart;
      case 'COMMENT_REPLY': return FaComment;
      case 'COMMENT_REACTION': return FaHeart;
      case 'ACHIEVEMENT': return FaTrophy;
      case 'LEVEL_UP': return FaLevelUpAlt;
      case 'GAME_INVITE': return FaGamepad;
      case 'SYSTEM': return FaCog;
      default: return FaBell;
    }
  };

  const currentFilter = NOTIFICATION_FILTERS.find(f => f.key === filter) || NOTIFICATION_FILTERS[0];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="notification-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="notification-modal"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="notification-modal-header">
            <div className="notification-header-left">
              <FaBell className="notification-header-icon" />
              <h2>Notifications</h2>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </div>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read-btn cursor-target"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <FaCheckDouble />
                  <span>Mark all read</span>
                </button>
              )}
              <button 
                className="close-btn cursor-target"
                onClick={onClose}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="notification-filter-bar">
            <div className="filter-dropdown-wrapper">
              <button 
                className="filter-dropdown-btn cursor-target"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <currentFilter.icon />
                <span>{currentFilter.label}</span>
                <FaChevronDown className={`chevron ${showFilterDropdown ? 'open' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    className="filter-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {NOTIFICATION_FILTERS.map((f) => (
                      <button
                        key={f.key}
                        className={`filter-option cursor-target ${filter === f.key ? 'active' : ''}`}
                        onClick={() => {
                          changeFilter(f.key);
                          setShowFilterDropdown(false);
                        }}
                      >
                        <f.icon />
                        <span>{f.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {notifications.length > 0 && (
              <button 
                className="clear-all-btn cursor-target"
                onClick={() => setConfirmClear(true)}
              >
                <FaTrash />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div 
            ref={listRef}
            className="notification-list"
            onScroll={handleScroll}
          >
            {notifications.length === 0 && !loading ? (
              <div className="no-notifications">
                <div className="no-notifications-icon">🔔</div>
                <h3>No notifications yet</h3>
                <p>When you receive notifications, they'll appear here</p>
              </div>
            ) : (
              <>
                {notifications.map((notification, index) => {
                  const IconComponent = getIconComponent(notification.type);
                  const color = getNotificationColor(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div className="unread-indicator" />
                      )}
                      
                      {/* Icon */}
                      <div 
                        className="notification-icon"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {notification.senderAvatar ? (
                          <img 
                            src={notification.senderAvatar} 
                            alt={notification.senderUsername}
                            className="sender-avatar"
                          />
                        ) : (
                          <IconComponent />
                        )}
                      </div>

                      {/* Content */}
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.timeAgo}</div>
                      </div>

                      {/* Actions */}
                      <div className="notification-actions">
                        {!notification.isRead && (
                          <button 
                            className="action-btn mark-read cursor-target"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            title="Mark as read"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button 
                          className="action-btn delete cursor-target"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="loading-more">
                    <FaSpinner className="spinner" />
                    <span>Loading...</span>
                  </div>
                )}

                {/* Load more button */}
                {hasMore && !loading && notifications.length > 0 && (
                  <button 
                    className="load-more-btn cursor-target"
                    onClick={loadMore}
                  >
                    Load more
                  </button>
                )}
              </>
            )}
          </div>

          {/* Clear confirmation modal */}
          <AnimatePresence>
            {confirmClear && (
              <motion.div
                className="confirm-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="confirm-modal"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <h3>Clear all notifications?</h3>
                  <p>This action cannot be undone.</p>
                  <div className="confirm-actions">
                    <button 
                      className="cancel-btn cursor-target"
                      onClick={() => setConfirmClear(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="confirm-btn cursor-target"
                      onClick={() => {
                        clearAll();
                        setConfirmClear(false);
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationModal;
