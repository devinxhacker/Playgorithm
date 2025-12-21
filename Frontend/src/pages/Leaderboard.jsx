import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { leaderboardAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaTrophy, FaMedal, FaCrown, FaArrowLeft, FaGamepad, FaChartLine, FaUsers, FaStar } from "react-icons/fa";
import "./Leaderboard.css";

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.getGlobalLeaderboard(50);
      setLeaderboard(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="rank-icon gold" />;
    if (rank === 2) return <FaMedal className="rank-icon silver" />;
    if (rank === 3) return <FaMedal className="rank-icon bronze" />;
    return <span className="rank-number">#{rank}</span>;
  };

  const getTotalXP = () => {
    return leaderboard.reduce((sum, entry) => sum + (entry.totalXP || 0), 0);
  };

  const getTotalGames = () => {
    return leaderboard.reduce((sum, entry) => sum + (entry.gamesPlayed || 0), 0);
  };

  if (loading) {
    return (
      <div className="leaderboard-loading">
        <div className="spinner"></div>
        <p>Loading Leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      {/* Header Section */}
      <motion.header 
        className="leaderboard-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        
        <div className="header-content">
          <div className="header-badge">
            <FaTrophy className="header-icon" />
          </div>
          <h1>Global Leaderboard</h1>
          <p>Compete with players worldwide and climb the ranks!</p>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{leaderboard.length}</span>
              <span className="stat-label">Players</span>
            </div>
          </div>
          <div className="stat-card">
            <FaStar className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{getTotalXP().toLocaleString()}</span>
              <span className="stat-label">Total XP</span>
            </div>
          </div>
          <div className="stat-card">
            <FaGamepad className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{getTotalGames().toLocaleString()}</span>
              <span className="stat-label">Games Played</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <motion.div 
          className="podium-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="podium">
            {/* 2nd Place */}
            <div className="podium-item second">
              <div className="podium-avatar">
                {leaderboard[1]?.avatarUrl ? (
                  <img src={leaderboard[1].avatarUrl} alt={leaderboard[1].username} />
                ) : (
                  leaderboard[1]?.username.charAt(0).toUpperCase()
                )}
              </div>
              <FaMedal className="podium-medal silver" />
              <span className="podium-name">{leaderboard[1]?.fullName || leaderboard[1]?.username}</span>
              <span className="podium-xp">{leaderboard[1]?.totalXP.toLocaleString()} XP</span>
              <div className="podium-stand second-stand">2</div>
            </div>

            {/* 1st Place */}
            <div className="podium-item first">
              <div className="podium-avatar crown">
                {leaderboard[0]?.avatarUrl ? (
                  <img src={leaderboard[0].avatarUrl} alt={leaderboard[0].username} />
                ) : (
                  leaderboard[0]?.username.charAt(0).toUpperCase()
                )}
              </div>
              <FaCrown className="podium-medal gold" />
              <span className="podium-name">{leaderboard[0]?.fullName || leaderboard[0]?.username}</span>
              <span className="podium-xp">{leaderboard[0]?.totalXP.toLocaleString()} XP</span>
              <div className="podium-stand first-stand">1</div>
            </div>

            {/* 3rd Place */}
            <div className="podium-item third">
              <div className="podium-avatar">
                {leaderboard[2]?.avatarUrl ? (
                  <img src={leaderboard[2].avatarUrl} alt={leaderboard[2].username} />
                ) : (
                  leaderboard[2]?.username.charAt(0).toUpperCase()
                )}
              </div>
              <FaMedal className="podium-medal bronze" />
              <span className="podium-name">{leaderboard[2]?.fullName || leaderboard[2]?.username}</span>
              <span className="podium-xp">{leaderboard[2]?.totalXP.toLocaleString()} XP</span>
              <div className="podium-stand third-stand">3</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard Table */}
      <motion.div 
        className="leaderboard-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="leaderboard-table">
          <div className="table-header">
            <div>Rank</div>
            <div>Player</div>
            <div>Total XP</div>
            <div>Level</div>
            <div>Games</div>
            <div>Win Rate</div>
          </div>

          {leaderboard.slice(3).map((entry, index) => (
            <motion.div
              key={entry.id}
              className={`table-row ${user && entry.username === user.username ? "current-user" : ""}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.03 }}
            >
              <div className="rank-cell">{getRankIcon(entry.rank)}</div>
              <div className="player-cell">
                <div className="player-avatar">
                  {entry.avatarUrl ? (
                    <img src={entry.avatarUrl} alt={entry.username} />
                  ) : (
                    entry.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="player-info">
                  <span className="player-name">{entry.fullName || entry.username}</span>
                  <span className="player-username">@{entry.username}</span>
                </div>
              </div>
              <div className="xp-cell">
                <FaStar className="xp-icon" />
                {entry.totalXP.toLocaleString()}
              </div>
              <div className="level-cell">
                <span className="level-badge">Lvl {entry.level}</span>
              </div>
              <div className="games-cell">
                <FaGamepad /> {entry.gamesPlayed}
              </div>
              <div className="winrate-cell">
                <FaChartLine /> {(entry.winRate || 0).toFixed(1)}%
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="no-data">
            <FaTrophy className="no-data-icon" />
            <p>No leaderboard data available yet.</p>
            <span>Start playing to earn XP and claim your spot!</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;
