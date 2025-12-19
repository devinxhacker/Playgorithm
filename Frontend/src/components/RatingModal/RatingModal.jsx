import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar } from 'react-icons/fa';
import { ratingAPI } from '../../services/api';
import './RatingModal.css';

const RatingModal = ({ isOpen, onClose, game }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen && game) {
            fetchRatingStats();
        }
    }, [isOpen, game]);

    const fetchRatingStats = async () => {
        try {
            const response = await ratingAPI.getGameRatingStats(game.id);
            setStats(response.data);
            setRating(response.data.userRating || 0);
        } catch (error) {
            console.error('Failed to fetch rating stats:', error);
        }
    };

    const handleSubmitRating = async () => {
        if (rating === 0) {
            setMessage('Please select a rating');
            return;
        }

        setLoading(true);
        try {
            await ratingAPI.rateGame(game.id, rating);
            setMessage('Rating submitted successfully!');
            await fetchRatingStats();
            setTimeout(() => {
                onClose();
                setMessage('');
            }, 1500);
        } catch (error) {
            setMessage('Failed to submit rating');
            console.error('Rating error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRating = async () => {
        setLoading(true);
        try {
            await ratingAPI.deleteRating(game.id);
            setRating(0);
            setMessage('Rating removed successfully!');
            await fetchRatingStats();
            setTimeout(() => {
                setMessage('');
            }, 1500);
        } catch (error) {
            setMessage('Failed to remove rating');
            console.error('Delete rating error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !game) return null;

    const getPercentage = (count) => {
        if (!stats || stats.totalRatings === 0) return 0;
        return Math.round((count / stats.totalRatings) * 100);
    };

    return (
        <AnimatePresence>
            <motion.div
                className="rating-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="rating-modal"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="rating-close-btn cursor-target" onClick={onClose}>
                        <FaTimes />
                    </button>

                    <div className="rating-modal-header">
                        <h2>Rate {game.name}</h2>
                        <p>Share your experience with other players</p>
                    </div>

                    <div className="rating-modal-content">
                        {stats && (
                            <div className="rating-stats-section">
                                <div className="average-rating">
                                    <div className="average-number">{stats.averageRating.toFixed(1)}</div>
                                    <div className="average-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={star <= Math.round(stats.averageRating) ? 'filled' : ''}
                                            />
                                        ))}
                                    </div>
                                    <div className="total-ratings">{stats.totalRatings} ratings</div>
                                </div>

                                <div className="rating-distribution">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = stats.distribution[
                                            star === 5 ? 'fiveStars' :
                                            star === 4 ? 'fourStars' :
                                            star === 3 ? 'threeStars' :
                                            star === 2 ? 'twoStars' : 'oneStar'
                                        ];
                                        return (
                                            <div key={star} className="distribution-row">
                                                <span className="star-label">{star} <FaStar /></span>
                                                <div className="distribution-bar">
                                                    <div
                                                        className="distribution-fill"
                                                        style={{ width: `${getPercentage(count)}%` }}
                                                    />
                                                </div>
                                                <span className="distribution-count">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="your-rating-section">
                            <h3>Your Rating</h3>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`star cursor-target ${
                                            star <= (hoverRating || rating) ? 'filled' : ''
                                        }`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="rating-text">
                                    {rating === 1 && 'Poor'}
                                    {rating === 2 && 'Fair'}
                                    {rating === 3 && 'Good'}
                                    {rating === 4 && 'Very Good'}
                                    {rating === 5 && 'Excellent'}
                                </p>
                            )}
                        </div>

                        {message && (
                            <div className={`rating-message ${message.includes('success') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}

                        <div className="rating-actions">
                            <button
                                className="rating-submit-btn cursor-target"
                                onClick={handleSubmitRating}
                                disabled={loading || rating === 0}
                            >
                                {loading ? 'Submitting...' : stats?.userRating ? 'Update Rating' : 'Submit Rating'}
                            </button>
                            {stats?.userRating && (
                                <button
                                    className="rating-delete-btn cursor-target"
                                    onClick={handleDeleteRating}
                                    disabled={loading}
                                >
                                    Remove Rating
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RatingModal;
