import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gameAPI, userAPI, ratingAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import SettingsModal from "../components/Settings/SettingsModal";
import RatingModal from "../components/RatingModal/RatingModal";
import CommentsModal from "../components/CommentsModal/CommentsModal";
import {
  FaGamepad,
  FaTrophy,
  FaChartLine,
  FaClock,
  FaCode,
  FaPlay,
  FaShieldAlt,
  FaUser,
  FaCog,
  FaStar,
  FaComment,
} from "react-icons/fa";
import Footer from "../components/common/Footer";
import featuredEventArt from "../assets/images/featured-event-art.jpeg";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [games, setGames] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [rankData, setRankData] = useState({ rank: null, totalUsers: 0 });
  const [gameRatings, setGameRatings] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, [selectedCategory]);

  const loadDashboardData = async () => {
    try {
      const gamesResponse = await gameAPI.getAllGames();
      let filteredGames = gamesResponse.data;

      if (selectedCategory !== "ALL") {
        filteredGames = filteredGames.filter(
          (game) => game.category === selectedCategory
        );
      }

      setGames(filteredGames);

      // Fetch ratings for all games
      const ratingsPromises = filteredGames.map(game => 
        ratingAPI.getGameRatingStats(game.id)
          .then(res => ({ gameId: game.id, stats: res.data }))
          .catch(() => ({ gameId: game.id, stats: { averageRating: 0, totalRatings: 0 } }))
      );
      const ratingsResults = await Promise.all(ratingsPromises);
      const ratingsMap = {};
      ratingsResults.forEach(r => {
        ratingsMap[r.gameId] = r.stats;
      });
      setGameRatings(ratingsMap);

      const sessionsResponse = await gameAPI.getUserSessions();
      setSessions(sessionsResponse.data);
      
      // Fetch user's global rank
      try {
        const rankResponse = await userAPI.getUserRank();
        setRankData(rankResponse.data);
      } catch (rankError) {
        console.error("Error loading rank:", rankError);
      }
      
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
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <div className="dashboard-header">
        <div className="user-profile" onClick={() => setShowSettings(true)} style={{ cursor: 'pointer' }}>
          <div className="avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              user.username?.charAt(0).toUpperCase() || 'U'
            )}
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
          <button onClick={() => setShowSettings(true)} className="profile-button cursor-target">
            <FaCog /> Settings
          </button>
          <button onClick={() => navigate("/community")} className="community-button cursor-target">
            💬 Community
          </button>
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

      <div className="dashboard-hero">
        <div className="hero-content">
          <h1><span className="hero-highlight">Master Algorithms</span> through Play</h1>
          <p>Level up your coding skills with interactive challenges and competitive arenas.</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="h-value">{games.length}</span>
              <span className="h-label">Active Arenas</span>
            </div>
            <div className="hero-stat">
              <span className="h-value">{user.totalXP || 0}</span>
              <span className="h-label">Your XP</span>
            </div>
            <div 
              className="hero-stat clickable" 
              onClick={() => navigate("/leaderboard")}
              style={{ cursor: 'pointer' }}
              title="View Leaderboard"
            >
              <span className="h-value">#{rankData.rank || "—"}</span>
              <span className="h-label">Global Rank{rankData.totalUsers > 0 ? ` / ${rankData.totalUsers}` : ""} 🏆</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-container">
            <img src={featuredEventArt} alt="Featured Event" className="hero-image" />
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn cursor-target ${selectedCategory === category ? "active" : ""
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, translateY: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="game-card-image-placeholder">
                {game.imageUrl ? (
                  <img src={game.imageUrl} alt={game.name} className="game-card-image" />
                ) : (
                  <span>{game.name} Art</span>
                )}
                {/* Rating Badge */}
                {gameRatings[game.id] && gameRatings[game.id].averageRating > 0 && (
                  <div className="game-rating-badge">
                    <FaStar className="rating-star" />
                    <span>{gameRatings[game.id].averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="game-card-content">
                <div className="game-card-header">
                  <h3>
                    {game.name}
                    {game.name === "Sorting Showdown" && (
                      <span className="special-badge">🎮 LIVE</span>
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
                    <span>{Math.floor(game.timeLimit / 60)}m</span>
                  </div>
                  <div className="meta-item">
                    <FaTrophy />
                    <span>{game.xpReward} XP</span>
                  </div>
                  <div className="meta-item">
                    <FaCode />
                    <span>{game.testCases.length} Lvls</span>
                  </div>
                </div>
                <button
                  className="play-button cursor-target"
                  onClick={() => handlePlayGame(game.id, game.name)}
                >
                  <FaPlay /> Enter Arena
                </button>
                <div className="game-actions">
                  <button
                    className="action-button rate-button cursor-target"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGame(game);
                      setShowRatingModal(true);
                    }}
                  >
                    <FaStar /> Rate
                  </button>
                  <button
                    className="action-button comment-button cursor-target"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGame(game);
                      setShowCommentsModal(true);
                    }}
                  >
                    <FaComment /> Comments
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="no-games">
            <p>No games found in this category</p>
          </div>
        )}
      </div>

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setSelectedGame(null);
        }}
        game={selectedGame}
      />

      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => {
          setShowCommentsModal(false);
          setSelectedGame(null);
        }}
        game={selectedGame}
      />

      {/* Footer */}
      <div className="dashboard-footer-wrapper">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
