import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaHeart, FaFire, FaThumbsUp, FaLaugh, FaSadTear, FaReply, FaEdit, FaTrash } from 'react-icons/fa';
import { commentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './CommentsModal.css';

const REACTIONS = [
    { type: 'like', icon: FaThumbsUp, color: '#00d4ff', label: 'Like' },
    { type: 'love', icon: FaHeart, color: '#ff1493', label: 'Love' },
    { type: 'fire', icon: FaFire, color: '#ff6600', label: 'Fire' },
    { type: 'laugh', icon: FaLaugh, color: '#ffd700', label: 'Laugh' },
    { type: 'sad', icon: FaSadTear, color: '#87ceeb', label: 'Sad' },
];

const CommentItem = ({ comment, onReply, onEdit, onDelete, onReaction, currentUserId, level = 0, onReplyAdded }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [showReactions, setShowReactions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [localComment, setLocalComment] = useState(comment);
    const [reactionPosition, setReactionPosition] = useState('left');
    const reactionTimeoutRef = useState(null);
    const reactionButtonRef = useState(null);

    // Update local comment when prop changes
    useEffect(() => {
        setLocalComment(comment);
    }, [comment]);

    const handleReactionHover = (e) => {
        // Clear any existing timeout
        if (reactionTimeoutRef.current) {
            clearTimeout(reactionTimeoutRef.current);
        }

        // Calculate position
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const spaceOnRight = window.innerWidth - rect.right;
        const spaceOnLeft = rect.left;

        // If not enough space on left (default), show on right
        if (spaceOnLeft < 250 && spaceOnRight > 250) {
            setReactionPosition('right');
        } else {
            setReactionPosition('left');
        }

        setShowReactions(true);
    };

    const handleReactionLeave = () => {
        // Delay hiding to allow moving to picker
        reactionTimeoutRef.current = setTimeout(() => {
            setShowReactions(false);
        }, 200);
    };

    const handlePickerEnter = () => {
        // Cancel hide timeout when entering picker
        if (reactionTimeoutRef.current) {
            clearTimeout(reactionTimeoutRef.current);
        }
    };

    const handlePickerLeave = () => {
        setShowReactions(false);
    };

    const loadReplies = async () => {
        if (localComment.replyIds && localComment.replyIds.length > 0 && !showReplies) {
            try {
                const response = await commentAPI.getReplies(localComment.id);
                setReplies(response.data);
                setShowReplies(true);
            } catch (error) {
                console.error('Failed to load replies:', error);
            }
        } else {
            setShowReplies(!showReplies);
        }
    };

    const handleEdit = async () => {
        if (editContent.trim() === localComment.content) {
            setIsEditing(false);
            return;
        }
        try {
            // Optimistic update
            setLocalComment(prev => ({ ...prev, content: editContent, isEdited: true }));
            setIsEditing(false);
            
            await onEdit(localComment.id, editContent);
        } catch (error) {
            console.error('Failed to edit comment:', error);
            // Revert on error
            setEditContent(localComment.content);
        }
    };

    const handleReactionClick = async (type) => {
        // Optimistic update
        const newReactions = { ...localComment.reactions };
        if (newReactions[currentUserId] === type) {
            delete newReactions[currentUserId];
        } else {
            newReactions[currentUserId] = type;
        }
        setLocalComment(prev => ({ ...prev, reactions: newReactions }));
        setShowReactions(false);
        
        try {
            await onReaction(localComment.id, type);
        } catch (error) {
            console.error('Failed to toggle reaction:', error);
            // Revert on error
            setLocalComment(prev => ({ ...prev, reactions: localComment.reactions }));
        }
    };

    const handleReplyAdded = (newReply) => {
        setReplies(prev => [...prev, newReply]);
        setLocalComment(prev => ({
            ...prev,
            replyIds: [...(prev.replyIds || []), newReply.id]
        }));
        if (!showReplies) {
            setShowReplies(true);
        }
    };

    const getReactionCount = (type) => {
        return Object.values(localComment.reactions || {}).filter(r => r === type).length;
    };

    const getUserReaction = () => {
        return localComment.reactions?.[currentUserId] || null;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className={`comment-item ${level > 0 ? 'reply' : ''}`} style={{ marginLeft: `${level * 30}px` }}>
            <div className="comment-avatar">
                <img src={comment.userAvatar || 'https://via.placeholder.com/40'} alt={comment.username} />
            </div>
            <div className="comment-content-wrapper">
                <div className="comment-header">
                    <span className="comment-username">{localComment.username}</span>
                    <span className="comment-time">{formatDate(localComment.createdAt)}</span>
                    {localComment.isEdited && <span className="edited-badge">(edited)</span>}
                </div>

                {isEditing ? (
                    <div className="comment-edit-form">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="comment-edit-input"
                            rows="3"
                        />
                        <div className="comment-edit-actions">
                            <button className="comment-save-btn cursor-target" onClick={handleEdit}>Save</button>
                            <button className="comment-cancel-btn cursor-target" onClick={() => {
                                setIsEditing(false);
                                setEditContent(localComment.content);
                            }}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="comment-text">{localComment.content}</div>
                )}

                <div className="comment-actions">
                    <div className="comment-reactions-display">
                        {REACTIONS.map(({ type, icon: Icon, color }) => {
                            const count = getReactionCount(type);
                            if (count === 0) return null;
                            return (
                                <span
                                    key={type}
                                    className={`reaction-badge ${getUserReaction() === type ? 'active' : ''}`}
                                    style={{ color }}
                                >
                                    <Icon /> {count}
                                </span>
                            );
                        })}
                    </div>

                    <div className="comment-action-buttons">
                        <div className="reaction-picker-wrapper">
                            <button
                                ref={reactionButtonRef}
                                className="comment-action-btn cursor-target"
                                onMouseEnter={handleReactionHover}
                                onMouseLeave={handleReactionLeave}
                            >
                                React
                            </button>
                            {showReactions && (
                                <div 
                                    className={`reaction-picker ${reactionPosition}`}
                                    onMouseEnter={handlePickerEnter}
                                    onMouseLeave={handlePickerLeave}
                                >
                                    {REACTIONS.map(({ type, icon: Icon, color, label }) => (
                                        <button
                                            key={type}
                                            className={`reaction-btn cursor-target ${getUserReaction() === type ? 'active' : ''}`}
                                            onClick={() => handleReactionClick(type)}
                                            style={{ color }}
                                            data-tooltip={label}
                                            title={label}
                                        >
                                            <Icon />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="comment-action-btn cursor-target" onClick={() => onReply(localComment)}>
                            <FaReply /> Reply
                        </button>

                        {localComment.userId === currentUserId && !isEditing && (
                            <>
                                <button className="comment-action-btn cursor-target" onClick={() => {
                                    setIsEditing(true);
                                    setEditContent(localComment.content);
                                }}>
                                    <FaEdit /> Edit
                                </button>
                                <button className="comment-action-btn delete cursor-target" onClick={() => onDelete(localComment.id)}>
                                    <FaTrash /> Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {localComment.replyIds && localComment.replyIds.length > 0 && (
                    <button className="show-replies-btn cursor-target" onClick={loadReplies}>
                        {showReplies ? 'Hide' : 'Show'} {localComment.replyIds.length} {localComment.replyIds.length === 1 ? 'reply' : 'replies'}
                    </button>
                )}

                {showReplies && replies.length > 0 && (
                    <div className="replies-container">
                        {replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onReaction={onReaction}
                                currentUserId={currentUserId}
                                level={level + 1}
                                onReplyAdded={handleReplyAdded}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CommentsModal = ({ isOpen, onClose, game }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        if (isOpen && game) {
            fetchComments();
            fetchCommentCount();
        }
    }, [isOpen, game]);

    const fetchComments = async () => {
        try {
            const response = await commentAPI.getTopLevelComments(game.id);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const fetchCommentCount = async () => {
        try {
            const response = await commentAPI.getCommentCount(game.id);
            setCommentCount(response.data.count);
        } catch (error) {
            console.error('Failed to fetch comment count:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setLoading(true);
        const tempComment = {
            id: 'temp-' + Date.now(),
            gameId: game.id,
            userId: user.id,
            username: user.username,
            userAvatar: user.avatarUrl,
            content: newComment,
            parentCommentId: replyingTo?.id || null,
            reactions: {},
            replyIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isEdited: false
        };

        try {
            // Optimistic update
            if (!replyingTo) {
                setComments(prev => [tempComment, ...prev]);
                setCommentCount(prev => prev + 1);
            }
            
            const response = await commentAPI.addComment(game.id, newComment, replyingTo?.id || null);
            
            // Replace temp comment with real one
            if (!replyingTo) {
                setComments(prev => prev.map(c => c.id === tempComment.id ? response.data : c));
            }
            
            setNewComment('');
            setReplyingTo(null);
            
            // Refresh to get accurate data
            await fetchComments();
            await fetchCommentCount();
        } catch (error) {
            console.error('Failed to add comment:', error);
            // Remove temp comment on error
            if (!replyingTo) {
                setComments(prev => prev.filter(c => c.id !== tempComment.id));
                setCommentCount(prev => prev - 1);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditComment = async (commentId, content) => {
        try {
            // Optimistic update
            setComments(prev => prev.map(c => 
                c.id === commentId ? { ...c, content, isEdited: true, updatedAt: new Date().toISOString() } : c
            ));
            
            await commentAPI.updateComment(commentId, content);
            // Refresh to ensure consistency
            await fetchComments();
        } catch (error) {
            console.error('Failed to edit comment:', error);
            // Revert on error
            await fetchComments();
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            // Optimistic update
            const deletedComment = comments.find(c => c.id === commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            setCommentCount(prev => prev - 1);
            
            await commentAPI.deleteComment(commentId);
            await fetchCommentCount();
        } catch (error) {
            console.error('Failed to delete comment:', error);
            // Revert on error
            await fetchComments();
            await fetchCommentCount();
        }
    };

    const handleReaction = async (commentId, reactionType) => {
        try {
            // Optimistic update
            setComments(prev => prev.map(c => {
                if (c.id === commentId) {
                    const newReactions = { ...c.reactions };
                    if (newReactions[user.id] === reactionType) {
                        delete newReactions[user.id];
                    } else {
                        newReactions[user.id] = reactionType;
                    }
                    return { ...c, reactions: newReactions };
                }
                return c;
            }));
            
            await commentAPI.toggleReaction(commentId, reactionType);
        } catch (error) {
            console.error('Failed to toggle reaction:', error);
            // Revert on error
            await fetchComments();
        }
    };

    if (!isOpen || !game) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="comments-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="comments-modal"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="comments-close-btn cursor-target" onClick={onClose}>
                        <FaTimes />
                    </button>

                    <div className="comments-modal-header">
                        <h2>Comments for {game.name}</h2>
                        <p>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</p>
                    </div>

                    <div className="comments-modal-content">
                        <div className="add-comment-section">
                            {replyingTo && (
                                <div className="replying-to">
                                    Replying to <strong>{replyingTo.username}</strong>
                                    <button className="cancel-reply cursor-target" onClick={() => setReplyingTo(null)}>
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                            <textarea
                                className="comment-input"
                                placeholder={replyingTo ? "Write a reply..." : "Share your thoughts..."}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows="3"
                            />
                            <button
                                className="comment-submit-btn cursor-target"
                                onClick={handleAddComment}
                                disabled={loading || !newComment.trim()}
                            >
                                {loading ? 'Posting...' : replyingTo ? 'Post Reply' : 'Post Comment'}
                            </button>
                        </div>

                        <div className="comments-list">
                            {comments.length === 0 ? (
                                <div className="no-comments">
                                    <p>No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                comments.map(comment => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        onReply={setReplyingTo}
                                        onEdit={handleEditComment}
                                        onDelete={handleDeleteComment}
                                        onReaction={handleReaction}
                                        currentUserId={user?.id}
                                        onReplyAdded={(newReply) => {
                                            // Handle reply added to update parent
                                            fetchComments();
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CommentsModal;
