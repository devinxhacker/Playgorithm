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
  FaShieldAlt,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
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

      // Add Tic-Tac-Toe Arena as a static game
      const ticTacToeArena = {
        id: 'tictactoe-arena',
        name: 'Tic-Tac-Toe Arena',
        description: 'Challenge the AI in a classic game of Tic-Tac-Toe with strategic gameplay!',
        difficulty: 'EASY',
        category: 'GRAPH',
        xpReward: 500,
        timeLimit: 600, // 10 minutes
        isActive: true,
        testCases: new Array(1).fill(null) // 1 game
      };

      // Add Queens Arena as a static game
      const queensArena = {
        id: 'queens-arena',
        name: 'Queens Arena',
        description: 'Master the classic N-Queens problem with beautiful visuals and learn backtracking!',
        difficulty: 'MEDIUM',
        category: 'GRAPH',
        xpReward: 1000,
        timeLimit: 1200, // 20 minutes
        isActive: true,
        testCases: new Array(3).fill(null) // 3 difficulty levels
      };

      // Add Zip Game (LinkedIn-style path puzzle)
      const zipGame = {
        id: 'zip-game',
        name: 'Zip Game',
        description: 'Connect numbers 1 to N by moving through adjacent cells. New puzzle every time!',
        difficulty: 'EASY',
        category: 'GRAPH',
        xpReward: 400,
        timeLimit: 300,
        isActive: true,
        testCases: new Array(10).fill(null)
      };

      // Add Grid Arena (CSS Grid learning game)
      const gridArena = {
        id: 'grid-arena',
        name: 'Grid Arena',
        description: 'Master CSS Grid layout by growing your carrot garden! 28 levels of grid mastery.',
        difficulty: 'MEDIUM',
        category: 'CSS_FLEXBOX',
        xpReward: 1500,
        timeLimit: 3600,
        isActive: true,
        testCases: new Array(28).fill(null)
      };

      // Add Missionaries & Cannibals Arena (Classic AI puzzle)
      const missionariesArena = {
        id: 'missionaries-arena',
        name: 'Missionaries & Cannibals',
        description: 'Solve the classic river-crossing puzzle! Learn constraint satisfaction and state-space search.',
        difficulty: 'MEDIUM',
        category: 'GRAPH',
        xpReward: 1200,
        timeLimit: 900,
        isActive: true,
        testCases: new Array(11).fill(null) // 11 optimal moves
      };

      // Add Algorithm Visualizer Hub
      const algorithmVisualizer = {
        id: 'algorithm-visualizer',
        name: 'Algorithm Visualizer',
        description: 'Explore 8 interactive algorithm visualizations: sorting, pathfinding, recursion, and more!',
        difficulty: 'MEDIUM',
        category: 'ALL',
        xpReward: 2000,
        timeLimit: 0, // No time limit
        isActive: true,
        testCases: new Array(8).fill(null) // 8 visualizers
      };

      // Add Chess Arena
      const chessArena = {
        id: 'chess-arena',
        name: 'Chess Arena',
        description: 'Play chess against AI with Minimax algorithm! Learn mode explains alpha-beta pruning.',
        difficulty: 'HARD',
        category: 'GRAPH',
        xpReward: 2500,
        timeLimit: 0,
        isActive: true,
        testCases: new Array(3).fill(null) // 3 difficulty levels
      };

      filteredGames = [...filteredGames, flexboxArena, ticTacToeArena, queensArena, zipGame, gridArena, missionariesArena, algorithmVisualizer, chessArena];

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
    "DEBUGGING",
    "CSS_FLEXBOX",
  ];

  const handlePlayGame = (gameId, gameName) => {
    // Check for special games with custom routes
    if (gameName === "Sorting Showdown") {
      navigate("/game/sorting-showdown");
    } else if (gameName === "Flexbox Arena") {
      navigate("/game/flexbox-arena");
    } else if (gameName === "Tic-Tac-Toe Arena") {
      navigate("/game/tictactoe-arena");
    } else if (gameName === "Queens Arena") {
      navigate("/game/queens-arena");
    } else if (gameName === "Zip Game") {
      navigate("/game/zip-game");
    } else if (gameName === "Grid Arena") {
      navigate("/game/grid-arena");
    } else if (gameName === "Speed Debugging: Bug Hunt") {
      navigate("/game/speed-debugging");
    } else if (gameName === "Missionaries & Cannibals") {
      navigate("/game/missionaries-arena");
    } else if (gameName === "Algorithm Visualizer") {
      navigate("/visualizer");
    } else if (gameName === "Chess Arena") {
      navigate("/game/chess-arena");
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
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="admin-link-button cursor-target"
            >
              <FaShieldAlt /> Admin Panel
            </button>
          )}
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
