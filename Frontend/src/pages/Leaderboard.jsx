import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { leaderboardAPI } from "../services/api";
import { FaTrophy, FaMedal, FaCrown } from "react-icons/fa";
import "./Leaderboard.css";

const Leaderboard = () => {
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
      <div className="leaderboard-header">
        <FaTrophy className="header-icon" />
        <h1>Global Leaderboard</h1>
        <p>Top players across all games</p>
      </div>

      <div className="leaderboard-container">
        <div className="leaderboard-table">
          <div className="table-header">
            <div>Rank</div>
            <div>Player</div>
            <div>Total XP</div>
            <div>Level</div>
          </div>

          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.id}
              className={`table-row ${index < 3 ? "top-three" : ""}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="rank-cell">{getRankIcon(index + 1)}</div>
              <div className="player-cell">
                <div className="player-avatar">
                  {entry.username.charAt(0).toUpperCase()}
                </div>
                <span className="player-name">{entry.username}</span>
              </div>
              <div className="xp-cell">{entry.totalXP.toLocaleString()} XP</div>
              <div className="level-cell">
                Level {Math.floor(entry.totalXP / 100) + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="no-data">
            <p>No leaderboard data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
