import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaHeart, FaFire, FaThumbsUp, FaLaugh, FaSadTear, 
    FaComment, FaShare, FaEdit, FaTrash, FaImage, 
    FaPaperPlane, FaTimes, FaEllipsisV, FaReply 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import ThemeIndicator from '../components/ThemeIndicator/ThemeIndicator';
import DarkModeToggle from '../components/DarkModeToggle/DarkModeToggle';
import './Community.css';

const REACTIONS = [
    { type: 'like', icon: FaThumbsUp, color: '#00d4ff', label: 'Like' },
    { type: 'love', icon: FaHeart, color: '#ff1493', label: 'Love' },
    { type: 'fire', icon: FaFire, color: '#ff6600', label: 'Fire' },
    { type: 'laugh', icon: FaLaugh, color: '#ffd700', label: 'Laugh' },
    { type: 'sad', icon: FaSadTear, color: '#87ceeb', label: 'Sad' },
];

const CommentItem = ({ comment, currentUser, onReply, onEdit, onDelete, onReaction, isEditing, editText, setEditText, onSaveEdit, onCancelEdit, formatDate }) => {
    const [showReactions, setShowReactions] = useState(false);
    const [localComment, setLocalComment] = useState(comment);
    const [pickerStyle, setPickerStyle] = useState({});
    const [arrowPosition, setArrowPosition] = useState('left');
    const reactionTimeoutRef = useRef(null);

    useEffect(() => {
        setLocalComment(comment);
    }, [comment]);

    const handleReactionHover = (e) => {
        if (reactionTimeoutRef.current) {
            clearTimeout(reactionTimeoutRef.current);
        }

        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const pickerWidth = 280;
        const pickerHeight = 62;
        const spaceOnRight = window.innerWidth - rect.right;
        const spaceOnLeft = rect.left;

        let left, arrow = 'left';

        if (spaceOnRight >= pickerWidth) {
            left = rect.left;
            arrow = 'left';
        } else if (spaceOnLeft >= pickerWidth) {
            left = rect.right - pickerWidth;
            arrow = 'right';
        } else {
            left = Math.max(10, Math.min(window.innerWidth - pickerWidth - 10, rect.left - (pickerWidth - rect.width) / 2));
            arrow = 'center';
        }

        const top = rect.top - pickerHeight - 8;

        setPickerStyle({ left: `${left}px`, top: `${top}px` });
        setArrowPosition(arrow);
        setShowReactions(true);
    };

    const handleReactionLeave = () => {
        reactionTimeoutRef.current = setTimeout(() => {
            setShowReactions(false);
        }, 200);
    };

    const handlePickerEnter = () => {
        if (reactionTimeoutRef.current) {
            clearTimeout(reactionTimeoutRef.current);
        }
    };

    const handlePickerLeave = () => {
        setShowReactions(false);
    };

    const handleReactionClick = (type) => {
        const newReactions = { ...localComment.reactions };
        if (newReactions[currentUser.id] === type) {
            delete newReactions[currentUser.id];
        } else {
            newReactions[currentUser.id] = type;
        }
        setLocalComment(prev => ({ ...prev, reactions: newReactions }));
        setShowReactions(false);
        onReaction(comment.id, type);
    };

    const getReactionCount = (type) => {
        return Object.values(localComment.reactions || {}).filter(r => r === type).length;
    };

    const getUserReaction = () => {
        return localComment.reactions?.[currentUser.id] || null;
    };

    return (
        <motion.div 
            className="comment-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <img 
                src={localComment.authorAvatar || 'https://via.placeholder.com/35'} 
                alt={localComment.authorName}
                className="comment-avatar"
            />
            <div className="comment-content-wrapper">
                <div className="comment-header">
                    <span className="comment-username">{localComment.authorName}</span>
                    <span className="comment-time">{formatDate(localComment.createdAt)}</span>
                    {localComment.isEdited && <span className="edited-badge">(edited)</span>}
                </div>

                {isEditing ? (
                    <div className="comment-edit-form">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="comment-edit-input"
                            rows="2"
                        />
                        <div className="comment-edit-actions">
                            <button className="comment-save-btn cursor-target" onClick={() => onSaveEdit(comment.id)}>Save</button>
                            <button className="comment-cancel-btn cursor-target" onClick={onCancelEdit}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="comment-bubble">
                        <p>{localComment.content}</p>
                    </div>
                )}

                <div className="comment-actions-row">
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
                                className="comment-action-btn cursor-target"
                                onMouseEnter={handleReactionHover}
                                onMouseLeave={handleReactionLeave}
                            >
                                React
                            </button>
                            {showReactions && (
                                <div
                                    className="reaction-picker-portal"
                                    onMouseEnter={handlePickerEnter}
                                    onMouseLeave={handlePickerLeave}
                                >
                                    <div 
                                        className={`reaction-picker ${arrowPosition}`}
                                        style={pickerStyle}
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
                                </div>
                            )}
                        </div>

                        <button className="comment-action-btn cursor-target" onClick={() => onReply(comment)}>
                            <FaReply /> Reply
                        </button>

                        {localComment.authorName === currentUser.username && !isEditing && (
                            <>
                                <button className="comment-action-btn cursor-target" onClick={() => onEdit(comment.id, comment.content)}>
                                    <FaEdit /> Edit
                                </button>
                                <button className="comment-action-btn delete cursor-target" onClick={() => onDelete(comment.id)}>
                                    <FaTrash /> Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const PostCard = ({ post, onReaction, onComment, onDelete, onCommentReaction, currentUser }) => {
    const [showReactions, setShowReactions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [localPost, setLocalPost] = useState(post);
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const reactionButtonRef = useRef(null);
    const reactionTimeoutRef = useRef(null);
    const [pickerStyle, setPickerStyle] = useState({});
    const [arrowPosition, setArrowPosition] = useState('left');

    useEffect(() => {
        setLocalPost(post);
    }, [post]);

    const handleReactionHover = (e) => {
        if (reactionTimeoutRef.current) {
            clearTimeout(reactionTimeoutRef.current);
        }

        // Calculate position
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        
        const pickerWidth = 280;
        const pickerHeight = 62;
        
        const spaceOnRight = window.innerWidth - rect.right;
        const spaceOnLeft = rect.left;

        let left;
        let arrow = 'left';

        if (spaceOnRight >= pickerWidth) {
            left = rect.left;
            arrow = 'left';
        } else if (spaceOnLeft >= pickerWidth) {
            left = rect.right - pickerWidth;
            arrow = 'right';
        } else {
            left = Math.max(10, Math.min(window.innerWidth - pickerWidth - 10, rect.left - (pickerWidth - rect.width) / 2));
            arrow = 'center';
        }

        const top = rect.top - pickerHeight - 8;

        setPickerStyle({ left: `${left}px`, top: `${top}px` });
        setArrowPosition(arrow);
        setShowReactions(true);
    };

    const handleReactionLeave = () => {
        reactionTimeoutRef.current = setTimeout(() => {
            setShowReactions(false);
        }, 200);
    };

    const handlePickerEnter = () => {
        if (reactionTimeoutRef.current) {
            clearTimeout(reactionTimeoutRef.current);
        }
    };

    const handlePickerLeave = () => {
        setShowReactions(false);
    };

    const handleReactionClick = (type) => {
        const newReactions = { ...localPost.reactions };
        if (newReactions[currentUser.id] === type) {
            delete newReactions[currentUser.id];
        } else {
            newReactions[currentUser.id] = type;
        }
        setLocalPost(prev => ({ ...prev, reactions: newReactions }));
        setShowReactions(false);
        onReaction(post.id, type);
    };

    const getReactionCount = (type) => {
        return Object.values(localPost.reactions || {}).filter(r => r === type).length;
    };

    const getUserReaction = () => {
        return localPost.reactions?.[currentUser.id] || null;
    };

    const getTotalReactions = () => {
        return Object.keys(localPost.reactions || {}).length;
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

    const handleCommentSubmit = () => {
        if (!commentText.trim()) return;
        
        const newComment = {
            id: Date.now().toString(),
            authorName: currentUser.username,
            authorAvatar: currentUser.avatarUrl,
            content: commentText,
            createdAt: new Date().toISOString(),
            reactions: {},
            parentId: replyingTo?.id || null
        };

        onComment(post.id, newComment);
        setCommentText('');
        setReplyingTo(null);
    };

    const handleCommentEdit = (commentId) => {
        if (!editCommentText.trim()) return;
        
        const updatedComments = localPost.comments.map(c => 
            c.id === commentId ? { ...c, content: editCommentText, isEdited: true } : c
        );
        
        setLocalPost(prev => ({ ...prev, comments: updatedComments }));
        setEditingComment(null);
        setEditCommentText('');
    };

    const handleCommentDelete = (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        
        const updatedComments = localPost.comments.filter(c => c.id !== commentId);
        setLocalPost(prev => ({ ...prev, comments: updatedComments }));
    };

    return (
        <motion.div
            className="post-card cursor-target"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="post-header">
                <div className="post-author">
                    <img 
                        src={localPost.authorAvatar || 'https://via.placeholder.com/50'} 
                        alt={localPost.authorName}
                        className="author-avatar"
                    />
                    <div className="author-info">
                        <h3 className="author-name">{localPost.authorName}</h3>
                        <span className="post-time">{formatDate(localPost.createdAt)}</span>
                    </div>
                </div>
                {currentUser.id === localPost.authorId && (
                    <button className="post-menu-btn cursor-target" onClick={() => onDelete(post.id)}>
                        <FaTrash />
                    </button>
                )}
            </div>

            <div className="post-content">
                <p>{localPost.content}</p>
                {localPost.imageUrl && (
                    <img src={localPost.imageUrl} alt="Post" className="post-image" />
                )}
            </div>

            <div className="post-stats">
                {getTotalReactions() > 0 && (
                    <div className="reactions-summary">
                        {REACTIONS.map(({ type, icon: Icon, color }) => {
                            const count = getReactionCount(type);
                            if (count === 0) return null;
                            return (
                                <span key={type} className="reaction-count" style={{ color }}>
                                    <Icon /> {count}
                                </span>
                            );
                        })}
                    </div>
                )}
                {localPost.comments?.length > 0 && (
                    <span className="comment-count">{localPost.comments.length} comments</span>
                )}
            </div>

            <div className="post-actions">
                <div className="reaction-wrapper">
                    <button
                        ref={reactionButtonRef}
                        className={`action-btn cursor-target ${getUserReaction() ? 'active' : ''}`}
                        onMouseEnter={handleReactionHover}
                        onMouseLeave={handleReactionLeave}
                    >
                        {getUserReaction() ? (
                            <>
                                {REACTIONS.find(r => r.type === getUserReaction())?.icon && 
                                    React.createElement(REACTIONS.find(r => r.type === getUserReaction()).icon)
                                }
                                <span style={{ color: REACTIONS.find(r => r.type === getUserReaction())?.color }}>
                                    {REACTIONS.find(r => r.type === getUserReaction())?.label}
                                </span>
                            </>
                        ) : (
                            <>
                                <FaThumbsUp /> React
                            </>
                        )}
                    </button>
                    {showReactions && (
                        <div
                            className="reaction-picker-portal"
                            onMouseEnter={handlePickerEnter}
                            onMouseLeave={handlePickerLeave}
                        >
                            <div 
                                className={`reaction-picker ${arrowPosition}`}
                                style={pickerStyle}
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
                        </div>
                    )}
                </div>

                <button 
                    className="action-btn cursor-target"
                    onClick={() => setShowComments(!showComments)}
                >
                    <FaComment /> Comment
                </button>

                <button className="action-btn cursor-target">
                    <FaShare /> Share
                </button>
            </div>

            {showComments && (
                <motion.div 
                    className="comments-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <div className="add-comment">
                        {replyingTo && (
                            <div className="replying-to">
                                Replying to <strong>{replyingTo.authorName}</strong>
                                <button className="cancel-reply cursor-target" onClick={() => setReplyingTo(null)}>
                                    <FaTimes />
                                </button>
                            </div>
                        )}
                        <div className="comment-input-container">
                            <img 
                                src={currentUser.avatarUrl || 'https://via.placeholder.com/40'} 
                                alt={currentUser.username}
                                className="comment-avatar"
                            />
                            <div className="comment-input-wrapper">
                                <input
                                    type="text"
                                    placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                    className="comment-input"
                                />
                                <button 
                                    className="send-comment-btn cursor-target"
                                    onClick={handleCommentSubmit}
                                    disabled={!commentText.trim()}
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="comments-list">
                        {localPost.comments?.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                currentUser={currentUser}
                                onReply={setReplyingTo}
                                onEdit={(id, text) => {
                                    setEditingComment(id);
                                    setEditCommentText(text);
                                }}
                                onDelete={handleCommentDelete}
                                onReaction={onCommentReaction}
                                isEditing={editingComment === comment.id}
                                editText={editCommentText}
                                setEditText={setEditCommentText}
                                onSaveEdit={handleCommentEdit}
                                onCancelEdit={() => {
                                    setEditingComment(null);
                                    setEditCommentText('');
                                }}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

const Community = () => {
    const { user } = useAuth();
    const { settings } = useSettings();
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [filter, setFilter] = useState('all'); // all, trending, following

    // Mock data - Replace with actual API calls
    useEffect(() => {
        const mockPosts = [
            {
                id: '1',
                authorId: user?.id,
                authorName: user?.username || 'You',
                authorAvatar: user?.avatarUrl,
                content: 'Just completed the Sorting Showdown challenge! The visualization really helped me understand quicksort better. 🚀',
                imageUrl: null,
                reactions: {
                    'user1': 'fire',
                    'user2': 'like',
                    'user3': 'love',
                },
                comments: [
                    {
                        id: 'c1',
                        authorName: 'Alice',
                        authorAvatar: null,
                        content: 'Great job! That challenge is tough!',
                        createdAt: new Date(Date.now() - 3600000).toISOString(),
                        reactions: {
                            'user1': 'like',
                            'user2': 'fire',
                        },
                    },
                    {
                        id: 'c2',
                        authorName: 'Bob',
                        authorAvatar: null,
                        content: 'I struggled with that one too! Any tips?',
                        createdAt: new Date(Date.now() - 1800000).toISOString(),
                        reactions: {
                            'user3': 'laugh',
                        },
                    }
                ],
                createdAt: new Date(Date.now() - 7200000).toISOString(),
            },
            {
                id: '2',
                authorId: 'user2',
                authorName: 'CodeMaster',
                authorAvatar: null,
                content: 'Who else is excited about the new Algorithm Visualizer? The animations are so smooth! 🎮',
                imageUrl: null,
                reactions: {
                    'user1': 'fire',
                    'user4': 'laugh',
                },
                comments: [
                    {
                        id: 'c3',
                        authorName: 'Charlie',
                        authorAvatar: null,
                        content: 'Absolutely! The N-Queens visualization is mind-blowing! 👑',
                        createdAt: new Date(Date.now() - 10800000).toISOString(),
                        reactions: {
                            'user1': 'love',
                            'user2': 'fire',
                            'user5': 'like',
                        },
                    }
                ],
                createdAt: new Date(Date.now() - 14400000).toISOString(),
            },
            {
                id: '3',
                authorId: 'user3',
                authorName: 'AlgoNinja',
                authorAvatar: null,
                content: 'Pro tip: Try solving the Grid Garden challenge before tackling the CSS Grid Arena. It really helps! 💡',
                imageUrl: null,
                reactions: {
                    'user1': 'like',
                    'user2': 'fire',
                    'user4': 'love',
                    'user5': 'like',
                },
                comments: [],
                createdAt: new Date(Date.now() - 21600000).toISOString(),
            },
        ];
        setPosts(mockPosts);
    }, [user]);

    const handleCreatePost = () => {
        if (!newPostContent.trim()) return;

        const newPost = {
            id: Date.now().toString(),
            authorId: user.id,
            authorName: user.username,
            authorAvatar: user.avatarUrl,
            content: newPostContent,
            imageUrl: null,
            reactions: {},
            comments: [],
            createdAt: new Date().toISOString(),
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
        setShowCreatePost(false);
    };

    const handleReaction = (postId, reactionType) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                const newReactions = { ...post.reactions };
                if (newReactions[user.id] === reactionType) {
                    delete newReactions[user.id];
                } else {
                    newReactions[user.id] = reactionType;
                }
                return { ...post, reactions: newReactions };
            }
            return post;
        }));
    };

    const handleComment = (postId, newComment) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return { ...post, comments: [...(post.comments || []), newComment] };
            }
            return post;
        }));
    };

    const handleCommentReaction = (postId, commentId, reactionType) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                const updatedComments = post.comments.map(comment => {
                    if (comment.id === commentId) {
                        const newReactions = { ...comment.reactions };
                        if (newReactions[user.id] === reactionType) {
                            delete newReactions[user.id];
                        } else {
                            newReactions[user.id] = reactionType;
                        }
                        return { ...comment, reactions: newReactions };
                    }
                    return comment;
                });
                return { ...post, comments: updatedComments };
            }
            return post;
        }));
    };

    const handleDeletePost = (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setPosts(posts.filter(post => post.id !== postId));
        }
    };

    return (
        <div className="community-page">
            <div className="community-container">
                <div className="community-header">
                    <div className="community-header-content">
                        <h1>Community Feed</h1>
                        <p>Connect with fellow algorithm enthusiasts</p>
                    </div>
                    <div className="community-header-actions">
                        <DarkModeToggle />
                        <ThemeIndicator />
                    </div>
                </div>

                <div className="community-filters">
                    <button 
                        className={`filter-btn cursor-target ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Posts
                    </button>
                    <button 
                        className={`filter-btn cursor-target ${filter === 'trending' ? 'active' : ''}`}
                        onClick={() => setFilter('trending')}
                    >
                        🔥 Trending
                    </button>
                    <button 
                        className={`filter-btn cursor-target ${filter === 'following' ? 'active' : ''}`}
                        onClick={() => setFilter('following')}
                    >
                        Following
                    </button>
                </div>

                <div className="create-post-section">
                    {!showCreatePost ? (
                        <div className="create-post-trigger cursor-target" onClick={() => setShowCreatePost(true)}>
                            <img 
                                src={user?.avatarUrl || 'https://via.placeholder.com/50'} 
                                alt={user?.username}
                                className="user-avatar"
                            />
                            <div className="post-placeholder">
                                What's on your mind, {user?.username}?
                            </div>
                        </div>
                    ) : (
                        <motion.div 
                            className="create-post-form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="form-header">
                                <h3>Create Post</h3>
                                <button 
                                    className="close-form-btn cursor-target"
                                    onClick={() => setShowCreatePost(false)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <textarea
                                className="post-textarea"
                                placeholder="Share your thoughts, achievements, or questions..."
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                rows="4"
                                autoFocus
                            />
                            <div className="form-actions">
                                <button className="add-media-btn cursor-target">
                                    <FaImage /> Add Image
                                </button>
                                <button 
                                    className="submit-post-btn cursor-target"
                                    onClick={handleCreatePost}
                                    disabled={!newPostContent.trim()}
                                >
                                    Post
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="posts-feed">
                    <AnimatePresence>
                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onReaction={handleReaction}
                                onComment={handleComment}
                                onCommentReaction={(commentId, reactionType) => handleCommentReaction(post.id, commentId, reactionType)}
                                onDelete={handleDeletePost}
                                currentUser={user}
                            />
                        ))}
                    </AnimatePresence>

                    {posts.length === 0 && (
                        <div className="no-posts">
                            <p>No posts yet. Be the first to share something!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;
