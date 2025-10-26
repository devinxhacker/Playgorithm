import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gameAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FaGamepad,
  FaTrophy,
  FaChartLine,
  FaClock,
  FaCode,
  FaPlay,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [games, setGames] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedCategory]);

  const loadDashboardData = async () => {
    try {
      const gamesResponse = await gameAPI.getAllGames();
      let filteredGames = gamesResponse.data;

      // Add Flexbox Arena as a static game
      const flexboxArena = {
        id: 'flexbox-arena',
        name: 'Flexbox Arena',
        description: 'Master CSS Flexbox through interactive challenges and warrior battles!',
        difficulty: 'MEDIUM',
        category: 'CSS_FLEXBOX',
        xpReward: 750,
        timeLimit: 1800, // 30 minutes
        isActive: true,
        testCases: new Array(8).fill(null) // 8 levels
      };

      filteredGames = [...filteredGames, flexboxArena];

      if (selectedCategory !== "ALL") {
        filteredGames = filteredGames.filter(
          (game) => game.category === selectedCategory
        );
      }

      setGames(filteredGames);

      const sessionsResponse = await gameAPI.getUserSessions();
      setSessions(sessionsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setLoading(false);
    }
  };

  const categories = [
    "ALL",
    "SORTING",
    "SEARCHING",
    "GRAPH",
    "DYNAMIC_PROGRAMMING",
    "CODE_GOLF",
    "SPEED_TYPING",
    "CSS_FLEXBOX",
  ];

  const handlePlayGame = (gameId, gameName) => {
    // Check for special games with custom routes
    if (gameName === "Sorting Showdown") {
      navigate("/game/sorting-showdown");
    } else if (gameName === "Flexbox Arena") {
      navigate("/game/flexbox-arena");
    } else {
      navigate(`/game/${gameId}`);
    }
  };

  // Check if user data is loaded
  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-profile">
          <div className="avatar">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <h2>{user.fullName || user.username}</h2>
            <p>@{user.username}</p>
          </div>
        </div>
        <div className="user-stats">
          <div className="stat-card">
            <FaTrophy className="stat-icon" />
            <div>
              <div className="stat-value">Level {user.level || 1}</div>
              <div className="stat-label">{user.totalXP || 0} XP</div>
            </div>
          </div>
          <div className="stat-card">
            <FaGamepad className="stat-icon" />
            <div>
              <div className="stat-value">{user.gamesPlayed || 0}</div>
              <div className="stat-label">Games Played</div>
            </div>
          </div>
          <div className="stat-card">
            <FaChartLine className="stat-icon" />
            <div>
              <div className="stat-value">{(user.winRate || 0).toFixed(1)}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
          </div>
          <button onClick={logout} className="logout-button cursor-target">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn cursor-target ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <motion.div
              key={game.id}
              className="game-card cursor-target"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <div className="game-card-header">
                <h3>
                  {game.name}
                  {game.name === "Sorting Showdown" && (
                    <span className="special-badge">🎮 INTERACTIVE</span>
                  )}
                </h3>
                <span className={`badge ${game.difficulty.toLowerCase()}`}>
                  {game.difficulty}
                </span>
              </div>
              <p className="game-description">{game.description}</p>
              <div className="game-meta">
                <div className="meta-item">
                  <FaClock />
                  <span>{Math.floor(game.timeLimit / 60)} mins</span>
                </div>
                <div className="meta-item">
                  <FaTrophy />
                  <span>{game.xpReward} XP</span>
                </div>
                <div className="meta-item">
                  <FaCode />
                  <span>{game.testCases.length} levels</span>
                </div>
              </div>
              <button
                className="play-button cursor-target"
                onClick={() => handlePlayGame(game.id, game.name)}
              >
                <FaPlay /> Play Now
              </button>
            </motion.div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="no-games">
            <p>No games found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
