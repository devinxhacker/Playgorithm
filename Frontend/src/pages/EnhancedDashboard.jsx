import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  FaFire,
  FaStar,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaPalette,
  FaWallet,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaCheckCircle,
} from "react-icons/fa";
import WelcomeCard from "../components/Dashboard/WelcomeCard";
import MetricCard from "../components/Dashboard/MetricCard";
import QuickActionCard from "../components/Dashboard/QuickActionCard";
import DashboardNav from "../components/Dashboard/DashboardNav";
import ThemeSelector from "../components/Settings/ThemeSelector";
import TypographySelector from "../components/Settings/TypographySelector";

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [games, setGames] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [settingsTab, setSettingsTab] = useState("appearance");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    soundEffects: true,
    autoSave: true,
    showHints: true,
  });

  useEffect(() => {
    loadDashboardData();
  }, [selectedCategory]);

  const loadDashboardData = async () => {
    try {
      const gamesResponse = await gameAPI.getAllGames();
      let filteredGames = gamesResponse.data;

      // Add static games
      const staticGames = [
        {
          id: 'flexbox-arena',
          name: 'Flexbox Arena',
          description: 'Master CSS Flexbox through interactive challenges!',
          difficulty: 'MEDIUM',
          category: 'CSS_FLEXBOX',
          xpReward: 750,
          timeLimit: 1800,
          isActive: true,
          testCases: new Array(8).fill(null)
        },
        {
          id: 'tictactoe-arena',
          name: 'Tic-Tac-Toe Arena',
          description: 'Challenge the AI with strategic gameplay!',
          difficulty: 'EASY',
          category: 'GRAPH',
          xpReward: 500,
          timeLimit: 600,
          isActive: true,
          testCases: new Array(1).fill(null)
        },
        {
          id: 'queens-arena',
          name: 'Queens Arena',
          description: 'Master the N-Queens problem with backtracking!',
          difficulty: 'MEDIUM',
          category: 'GRAPH',
          xpReward: 1000,
          timeLimit: 1200,
          isActive: true,
          testCases: new Array(3).fill(null)
        },
        {
          id: 'zip-game',
          name: 'Zip Game',
          description: 'Connect numbers through adjacent cells!',
          difficulty: 'EASY',
          category: 'GRAPH',
          xpReward: 400,
          timeLimit: 300,
          isActive: true,
          testCases: new Array(10).fill(null)
        },
        {
          id: 'grid-arena',
          name: 'Grid Arena',
          description: 'Master CSS Grid layout - 28 levels!',
          difficulty: 'MEDIUM',
          category: 'CSS_FLEXBOX',
          xpReward: 1500,
          timeLimit: 3600,
          isActive: true,
          testCases: new Array(28).fill(null)
        },
        {
          id: 'missionaries-arena',
          name: 'Missionaries & Cannibals',
          description: 'Solve the classic river-crossing puzzle!',
          difficulty: 'MEDIUM',
          category: 'GRAPH',
          xpReward: 1200,
          timeLimit: 900,
          isActive: true,
          testCases: new Array(11).fill(null)
        },
      ];

      filteredGames = [...filteredGames, ...staticGames];

      if (selectedCategory !== "ALL") {
        filteredGames = filteredGames.filter(
          (game) => game.category === selectedCategory
        );
      }

      setGames(filteredGames);
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
    const gameRoutes = {
      "Sorting Showdown": "/game/sorting-showdown",
      "Flexbox Arena": "/game/flexbox-arena",
      "Tic-Tac-Toe Arena": "/game/tictactoe-arena",
      "Queens Arena": "/game/queens-arena",
      "Zip Game": "/game/zip-game",
      "Grid Arena": "/game/grid-arena",
      "Speed Debugging: Bug Hunt": "/game/speed-debugging",
      "Missionaries & Cannibals": "/game/missionaries-arena",
    };

    navigate(gameRoutes[gameName] || `/game/${gameId}`);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ label, name, value, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <span style={{ color: 'var(--color-text)' }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange({
          target: { name, type: 'checkbox', checked: !value }
        })}
      >
        {value ? (
          <FaToggleOn className="text-2xl" style={{ color: 'var(--color-accent)' }} />
        ) : (
          <FaToggleOff className="text-2xl" style={{ color: 'var(--color-textSecondary)' }} />
        )}
      </button>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cta"></div>
        <p className="mt-4 text-text">Loading user data...</p>
      </div>
    );
  }

  if (loading && activeTab === 'games') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cta"></div>
        <p className="mt-4 text-text">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-panel/40 backdrop-blur-sm border-b border-cta/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
              className="cursor-pointer"
            >
              <h1 className="text-2xl font-bold text-cta font-display">
                PLAYGORITHM
              </h1>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-panel/40 border border-cta/20 text-text hover:border-cta/40 transition-all"
              >
                <FaBell />
              </motion.button>

              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/admin")}
                  className="px-6 py-3 rounded-xl bg-cta text-background font-semibold flex items-center gap-2 shadow-lg hover:shadow-cta/50 transition-all"
                >
                  <FaShieldAlt /> Admin Panel
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="px-6 py-3 rounded-xl bg-panel/40 border border-cta/20 text-text font-semibold flex items-center gap-2 hover:border-cta/40 transition-all"
              >
                <FaSignOutAlt /> Logout
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WelcomeCard user={user} />

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Games Played"
                  value={user.gamesPlayed || 0}
                  change={12}
                  isPositive={true}
                  icon={<FaGamepad />}
                  index={0}
                />
                <MetricCard
                  title="Total XP"
                  value={user.totalXP || 0}
                  change={25}
                  isPositive={true}
                  icon={<FaFire />}
                  index={1}
                />
                <MetricCard
                  title="Win Rate"
                  value={`${(user.winRate || 0).toFixed(1)}%`}
                  change={5}
                  isPositive={true}
                  icon={<FaTrophy />}
                  index={2}
                />
                <MetricCard
                  title="Current Level"
                  value={user.level || 1}
                  change={1}
                  isPositive={true}
                  icon={<FaStar />}
                  index={3}
                />
              </div>

              {/* Quick Actions */}
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <QuickActionCard
                  title="Play New Game"
                  description="Start a new challenge and earn XP"
                  icon={<FaPlay />}
                  linkTo="#"
                  index={0}
                />
                <QuickActionCard
                  title="View Leaderboard"
                  description="See how you rank against others"
                  icon={<FaTrophy />}
                  linkTo="/leaderboard"
                  index={1}
                />
                <QuickActionCard
                  title="Track Progress"
                  description="Monitor your learning journey"
                  icon={<FaChartLine />}
                  linkTo="#"
                  index={2}
                />
              </div>
            </motion.div>
          )}

          {/* Games Tab */}
          {activeTab === "games" && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                Available Games
              </h2>

              {/* Category Filter */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-300`}
                    style={{
                      background: selectedCategory === category 
                        ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
                        : 'var(--color-panel)',
                      color: selectedCategory === category ? 'white' : 'var(--color-textSecondary)',
                      border: `1px solid ${selectedCategory === category ? 'transparent' : 'var(--color-border)'}`,
                    }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.replace("_", " ")}
                  </button>
                ))}
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="game-card rounded-xl p-6 cursor-pointer"
                    style={{
                      background: 'var(--color-panel)',
                      border: '1px solid var(--color-border)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={() => handlePlayGame(game.id, game.name)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                        {game.name}
                      </h3>
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          game.difficulty === 'EASY' ? 'bg-green-500/20 text-green-500' :
                          game.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {game.difficulty}
                      </span>
                    </div>

                    <p className="text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                      {game.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1" style={{ color: 'var(--color-textSecondary)' }}>
                          <FaClock />
                          <span>{Math.floor(game.timeLimit / 60)} mins</span>
                        </div>
                        <div className="flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
                          <FaTrophy />
                          <span>{game.xpReward} XP</span>
                        </div>
                      </div>
                      <button 
                        className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                          color: 'white'
                        }}
                      >
                        <FaPlay /> Play
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                  Your Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <div className="md:col-span-1">
                    <div 
                      className="rounded-xl p-6 text-center"
                      style={{
                        background: 'var(--color-panel)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div 
                        className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl font-bold mb-4"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                          color: 'white'
                        }}
                      >
                        {(user?.fullName || user?.username)?.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                        {user?.fullName || user?.username}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                        @{user?.username}
                      </p>
                      <div 
                        className="px-4 py-2 rounded-full inline-block"
                        style={{
                          background: 'var(--color-accent)',
                          color: 'white',
                          fontWeight: '600'
                        }}
                      >
                        Level {user?.level || 1}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="md:col-span-2">
                    <div 
                      className="rounded-xl p-6"
                      style={{
                        background: 'var(--color-panel)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                        Statistics
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-lg" style={{ background: 'var(--color-background)' }}>
                          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                            {user?.gamesPlayed || 0}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                            Games Played
                          </div>
                        </div>
                        <div className="text-center p-4 rounded-lg" style={{ background: 'var(--color-background)' }}>
                          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
                            {user?.gamesWon || 0}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                            Games Won
                          </div>
                        </div>
                        <div className="text-center p-4 rounded-lg" style={{ background: 'var(--color-background)' }}>
                          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>
                            {user?.totalXP || 0}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                            Total XP
                          </div>
                        </div>
                        <div className="text-center p-4 rounded-lg" style={{ background: 'var(--color-background)' }}>
                          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-info)' }}>
                            {(user?.winRate || 0).toFixed(1)}%
                          </div>
                          <div className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                            Win Rate
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                  Settings
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Settings Nav */}
                  <div className="lg:col-span-1">
                    <div 
                      className="rounded-xl p-4 sticky top-24"
                      style={{
                        background: 'var(--color-panel)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <nav className="flex flex-col gap-2">
                        {[
                          { id: 'appearance', label: 'Appearance', icon: <FaPalette /> },
                          { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
                          { id: 'account', label: 'Account', icon: <FaUser /> },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setSettingsTab(tab.id)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300"
                            style={{
                              background: settingsTab === tab.id ? 'var(--color-primary)' : 'transparent',
                              color: settingsTab === tab.id ? 'white' : 'var(--color-textSecondary)',
                            }}
                          >
                            {tab.icon}
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>

                  {/* Settings Content */}
                  <div className="lg:col-span-3">
                    <div 
                      className="rounded-xl p-8"
                      style={{
                        background: 'var(--color-panel)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {saveSuccess && (
                        <div className="mb-6 bg-green-500/20 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg flex items-center">
                          <FaCheckCircle className="mr-2" /> Your settings have been saved successfully.
                        </div>
                      )}

                      {settingsTab === 'appearance' && (
                        <div>
                          <ThemeSelector />
                          <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
                            <TypographySelector />
                          </div>
                        </div>
                      )}

                      {settingsTab === 'notifications' && (
                        <div>
                          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                            Notification Preferences
                          </h3>
                          <ToggleSwitch
                            label="Email Notifications"
                            name="emailNotifications"
                            value={settings.emailNotifications}
                            onChange={(e) => setSettings({...settings, [e.target.name]: e.target.checked})}
                          />
                          <ToggleSwitch
                            label="Sound Effects"
                            name="soundEffects"
                            value={settings.soundEffects}
                            onChange={(e) => setSettings({...settings, [e.target.name]: e.target.checked})}
                          />
                          <ToggleSwitch
                            label="Auto Save Progress"
                            name="autoSave"
                            value={settings.autoSave}
                            onChange={(e) => setSettings({...settings, [e.target.name]: e.target.checked})}
                          />
                          <ToggleSwitch
                            label="Show Hints"
                            name="showHints"
                            value={settings.showHints}
                            onChange={(e) => setSettings({...settings, [e.target.name]: e.target.checked})}
                          />
                        </div>
                      )}

                      {settingsTab === 'account' && (
                        <div>
                          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                            Account Information
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textSecondary)' }}>
                                Username
                              </label>
                              <input
                                type="text"
                                value={user?.username || ''}
                                disabled
                                className="w-full px-4 py-3 rounded-lg"
                                style={{
                                  background: 'var(--color-background)',
                                  border: '1px solid var(--color-border)',
                                  color: 'var(--color-text)',
                                  opacity: 0.7
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textSecondary)' }}>
                                Email
                              </label>
                              <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 rounded-lg"
                                style={{
                                  background: 'var(--color-background)',
                                  border: '1px solid var(--color-border)',
                                  color: 'var(--color-text)',
                                  opacity: 0.7
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Save Button */}
                      <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <button
                          onClick={handleSaveSettings}
                          disabled={isSaving}
                          className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                          style={{
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                            color: 'white',
                            opacity: isSaving ? 0.7 : 1
                          }}
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave /> Save Settings
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
