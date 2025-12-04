import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaGamepad,
  FaShieldAlt,
  FaChartLine,
  FaSync,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
  FaSave,
  FaSignOutAlt,
  FaArrowLeft,
  FaSearch,
  FaTools,
} from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/ui/LoadingScreen';
import './AdminDashboard.css';

const blankGameForm = {
  name: '',
  description: '',
  category: 'SORTING',
  difficulty: 'EASY',
  xpReward: 500,
  timeLimit: 300,
  problemStatement: '',
  primaryLanguage: 'javascript',
  primaryStarterCode: '',
  supportedLanguagesText: 'cpp,java,python3,javascript',
  isActive: true,
  testCases: [
    { input: '', expectedOutput: '', points: 10, isHidden: false },
  ],
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [gameForm, setGameForm] = useState(blankGameForm);
  const [editingGameId, setEditingGameId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingGame, setSavingGame] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, usersRes, gamesRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getGames(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setGames(gamesRes.data);
    } catch (error) {
      showNotification('error', error.response?.data || 'Failed to load admin data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredUsers = users.filter((item) => {
    if (!userSearch.trim()) return true;
    const needle = userSearch.toLowerCase();
    return (
      item.username.toLowerCase().includes(needle) ||
      item.email.toLowerCase().includes(needle)
    );
  });

  const isUserAdmin = (roles) => roles?.includes('ROLE_ADMIN');

  const handleToggleAdmin = async (selectedUser) => {
    const updatedRoles = isUserAdmin(selectedUser.roles)
      ? selectedUser.roles.filter((role) => role !== 'ROLE_ADMIN')
      : [...selectedUser.roles, 'ROLE_ADMIN'];

    try {
      const response = await adminAPI.updateUser(selectedUser.id, { roles: updatedRoles });
      updateUserState(response.data);
      showNotification('success', `Updated roles for @${selectedUser.username}`);
    } catch (error) {
      showNotification('error', error.response?.data || 'Unable to update roles');
    }
  };

  const handleToggleActive = async (selectedUser) => {
    try {
      const response = await adminAPI.updateUser(selectedUser.id, { isActive: !selectedUser.isActive });
      updateUserState(response.data);
      showNotification('success', `${selectedUser.username} is now ${response.data.isActive ? 'active' : 'inactive'}`);
    } catch (error) {
      showNotification('error', error.response?.data || 'Unable to update status');
    }
  };

  const handleDeleteUser = async (selectedUser) => {
    if (!window.confirm(`Delete user @${selectedUser.username}? This cannot be undone.`)) {
      return;
    }

    try {
      await adminAPI.deleteUser(selectedUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      showNotification('success', `Deleted @${selectedUser.username}`);
    } catch (error) {
      showNotification('error', error.response?.data || 'Unable to delete user');
    }
  };

  const updateUserState = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleEditGame = (game) => {
    setEditingGameId(game.id);
    setGameForm({
      name: game.name,
      description: game.description,
      category: game.category,
      difficulty: game.difficulty,
      xpReward: game.xpReward,
      timeLimit: game.timeLimit,
      problemStatement: game.problemStatement,
      primaryLanguage: game.supportedLanguages?.[0] || 'javascript',
      primaryStarterCode: game.starterCodeTemplates?.[game.supportedLanguages?.[0]] || '',
      supportedLanguagesText: game.supportedLanguages?.join(', ') || '',
      isActive: game.isActive,
      testCases: (game.testCases || []).map((test) => ({
        input: test.input || '',
        expectedOutput: test.expectedOutput || '',
        points: test.points ?? 10,
        isHidden: Boolean(test.isHidden),
      })),
    });
    setActiveTab('games');
  };

  const handleGameFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setGameForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    setGameForm((prev) => {
      const updated = [...prev.testCases];
      let parsedValue = value;
      if (field === 'points') {
        parsedValue = Number(value);
      }
      if (field === 'isHidden') {
        parsedValue = Boolean(value);
      }
      updated[index] = { ...updated[index], [field]: parsedValue };
      return { ...prev, testCases: updated };
    });
  };

  const addTestCase = () => {
    setGameForm((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', points: 10, isHidden: false }],
    }));
  };

  const removeTestCase = (index) => {
    setGameForm((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, idx) => idx !== index),
    }));
  };

  const resetGameForm = () => {
    setEditingGameId(null);
    setGameForm(blankGameForm);
  };

  const handleGameSubmit = async (event) => {
    event.preventDefault();
    setSavingGame(true);

    const payload = {
      name: gameForm.name,
      description: gameForm.description,
      category: gameForm.category,
      difficulty: gameForm.difficulty,
      xpReward: Number(gameForm.xpReward),
      timeLimit: Number(gameForm.timeLimit),
      problemStatement: gameForm.problemStatement,
      primaryLanguage: gameForm.primaryLanguage,
      primaryStarterCode: gameForm.primaryStarterCode,
      supportedLanguages: gameForm.supportedLanguagesText
        .split(',')
        .map((lang) => lang.trim().toLowerCase())
        .filter(Boolean),
      isActive: gameForm.isActive,
      testCases: gameForm.testCases.map((test) => ({
        input: test.input,
        expectedOutput: test.expectedOutput,
        points: Number(test.points) || 0,
        isHidden: Boolean(test.isHidden),
      })),
    };

    try {
      const response = editingGameId
        ? await adminAPI.updateGame(editingGameId, payload)
        : await adminAPI.createGame(payload);

      if (editingGameId) {
        setGames((prev) => prev.map((game) => (game.id === response.data.id ? response.data : game)));
        showNotification('success', `Updated ${response.data.name}`);
      } else {
        setGames((prev) => [response.data, ...prev]);
        showNotification('success', `Created new game ${response.data.name}`);
      }
      resetGameForm();
      fetchAdminData();
    } catch (error) {
      showNotification('error', error.response?.data || 'Unable to save game');
    } finally {
      setSavingGame(false);
    }
  };

  const handleToggleGameStatus = async (game) => {
    try {
      const response = await adminAPI.updateGameStatus(game.id, !game.isActive);
      setGames((prev) => prev.map((item) => (item.id === game.id ? response.data : item)));
      showNotification('success', `${game.name} is now ${response.data.isActive ? 'active' : 'inactive'}`);
    } catch (error) {
      showNotification('error', error.response?.data || 'Unable to update game status');
    }
  };

  const handleDeleteGame = async (game) => {
    if (!window.confirm(`Delete ${game.name}?`)) {
      return;
    }
    try {
      await adminAPI.deleteGame(game.id);
      setGames((prev) => prev.filter((item) => item.id !== game.id));
      showNotification('success', `Deleted ${game.name}`);
    } catch (error) {
      showNotification('error', error.response?.data || 'Unable to delete game');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-aurora aurora-one" />
      <div className="admin-aurora aurora-two" />
      <div className="admin-aurora aurora-three" />
      <div className="admin-glass-noise" />
      <div className="admin-grid-overlay" />
      <header className="admin-header">
        <div>
          <p className="admin-pill">Admin Mode</p>
          <h1>Welcome back, {user?.fullName || user?.username}</h1>
          <p>Monitor system vitals, onboard new challenges, and guide the Playgorithm community.</p>
        </div>
        <div className="admin-header-actions">
          <button className="ghost-button cursor-target" onClick={fetchAdminData} disabled={refreshing}>
            <FaSync /> {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="ghost-button cursor-target" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Player View
          </button>
          <button className="danger-button cursor-target" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="admin-tab-bar">
        {['overview', 'users', 'games'].map((tab) => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <FaChartLine />}
            {tab === 'users' && <FaUsers />}
            {tab === 'games' && <FaTools />}
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      {notification && (
        <div className={`admin-notice ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <section className="admin-content">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && stats && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="overview-grid"
            >
              <div className="overview-card">
                <FaUsers />
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
                <small>{stats.activeUsers} active, {stats.adminUsers} admins</small>
              </div>
              <div className="overview-card">
                <FaGamepad />
                <h3>Games Online</h3>
                <p>{stats.totalGames}</p>
                <small>{stats.activeGames} currently active</small>
              </div>
              <div className="overview-card">
                <FaShieldAlt />
                <h3>Sessions Recorded</h3>
                <p>{stats.totalSessions}</p>
                <small>{stats.totalLeaderboardEntries} leaderboard entries</small>
              </div>
              <div className="overview-card">
                <FaChartLine />
                <h3>Recent Admin Activity</h3>
                <p>{new Date().toLocaleDateString()}</p>
                <small>Stay vigilant, commander.</small>
              </div>

              <div className="recent-users">
                <h3>Newest Recruits</h3>
                <ul>
                  {stats.recentUsers?.map((entry) => (
                    <li key={entry.id}>
                      <span>
                        @{entry.username}
                        <small>{entry.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Player'}</small>
                      </span>
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="spotlight-games">
                <h3>Spotlight Challenges</h3>
                <ul>
                  {stats.spotlightGames?.map((game) => (
                    <li key={game.id}>
                      <div>
                        <strong>{game.name}</strong>
                        <small>{game.category}</small>
                      </div>
                      <span className={game.isActive ? 'badge-active' : 'badge-inactive'}>
                        {game.isActive ? 'Active' : 'Offline'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="users-panel"
            >
              <div className="panel-header">
                <div>
                  <h3>User Management</h3>
                  <p>Promote guardians, deactivate rogues, and keep the realm tidy.</p>
                </div>
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search by username or email"
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                  />
                </div>
              </div>

              <div className="user-table">
                <div className="table-header">
                  <span>User</span>
                  <span>Roles</span>
                  <span>Status</span>
                  <span>XP</span>
                  <span>Actions</span>
                </div>
                {filteredUsers.map((item) => (
                  <div key={item.id} className="table-row">
                    <span>
                      <strong>@{item.username}</strong>
                      <small>{item.email}</small>
                    </span>
                    <span>
                      {item.roles?.map((role) => (
                        <span key={role} className="role-pill">{role.replace('ROLE_', '')}</span>
                      ))}
                    </span>
                    <span className={item.isActive ? 'status active' : 'status inactive'}>
                      {item.isActive ? 'Active' : 'Suspended'}
                    </span>
                    <span>{item.totalXP} XP</span>
                    <span className="row-actions">
                      <button onClick={() => handleToggleAdmin(item)} className="ghost-button cursor-target">
                        {isUserAdmin(item.roles) ? 'Remove Admin' : 'Promote Admin'}
                      </button>
                      <button onClick={() => handleToggleActive(item)} className="ghost-button cursor-target">
                        {item.isActive ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button onClick={() => handleDeleteUser(item)} className="danger-button cursor-target">
                        <FaTrash />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="games-panel"
            >
              <div className="panel-header">
                <div>
                  <h3>Game Operations</h3>
                  <p>Craft new arenas, edit parameters, and toggle availability in real-time.</p>
                </div>
                <div className="games-actions">
                  <button className="ghost-button cursor-target" onClick={resetGameForm}>
                    <FaPlus /> New Game
                  </button>
                </div>
              </div>

              <div className="games-content">
                <form className="game-form" onSubmit={handleGameSubmit}>
                  <h4>{editingGameId ? 'Edit Game' : 'Create New Game'}</h4>
                  <label>
                    Name
                    <input name="name" value={gameForm.name} onChange={handleGameFieldChange} required />
                  </label>
                  <label>
                    Description
                    <textarea name="description" value={gameForm.description} onChange={handleGameFieldChange} required rows={3} />
                  </label>

                  <div className="grid-2">
                    <label>
                      Category
                      <select name="category" value={gameForm.category} onChange={handleGameFieldChange}>
                        <option value="SORTING">Sorting</option>
                        <option value="SEARCHING">Searching</option>
                        <option value="GRAPH">Graph</option>
                        <option value="DYNAMIC_PROGRAMMING">Dynamic Programming</option>
                        <option value="CODE_GOLF">Code Golf</option>
                        <option value="DEBUGGING">Speed Debugging</option>
                        <option value="CSS_FLEXBOX">CSS Flexbox</option>
                      </select>
                    </label>
                    <label>
                      Difficulty
                      <select name="difficulty" value={gameForm.difficulty} onChange={handleGameFieldChange}>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid-2">
                    <label>
                      XP Reward
                      <input type="number" name="xpReward" value={gameForm.xpReward} onChange={handleGameFieldChange} />
                    </label>
                    <label>
                      Time Limit (sec)
                      <input type="number" name="timeLimit" value={gameForm.timeLimit} onChange={handleGameFieldChange} />
                    </label>
                  </div>

                  <label>
                    Problem Statement
                    <textarea name="problemStatement" value={gameForm.problemStatement} onChange={handleGameFieldChange} rows={4} />
                  </label>

                  <div className="grid-2">
                    <label>
                      Primary Language
                      <select name="primaryLanguage" value={gameForm.primaryLanguage} onChange={handleGameFieldChange}>
                        <option value="javascript">JavaScript</option>
                        <option value="python3">Python 3</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                      </select>
                    </label>
                    <label>
                      Supported Languages
                      <input
                        name="supportedLanguagesText"
                        value={gameForm.supportedLanguagesText}
                        onChange={handleGameFieldChange}
                        placeholder="cpp, java, python3"
                      />
                    </label>
                  </div>

                  <label>
                    Starter Code (Primary language)
                    <textarea name="primaryStarterCode" value={gameForm.primaryStarterCode} onChange={handleGameFieldChange} rows={4} />
                  </label>

                  <div className="testcase-header">
                    <h5>Test Cases</h5>
                    <button type="button" className="ghost-button cursor-target" onClick={addTestCase}>
                      <FaPlus /> Add Test Case
                    </button>
                  </div>

                  {gameForm.testCases.map((test, index) => (
                    <div key={`test-${index}`} className="testcase-card">
                      <div className="grid-2">
                        <label>
                          Input
                          <textarea
                            value={test.input}
                            onChange={(event) => handleTestCaseChange(index, 'input', event.target.value)}
                            rows={2}
                          />
                        </label>
                        <label>
                          Expected Output
                          <textarea
                            value={test.expectedOutput}
                            onChange={(event) => handleTestCaseChange(index, 'expectedOutput', event.target.value)}
                            rows={2}
                          />
                        </label>
                      </div>
                      <div className="grid-3">
                        <label>
                          Points
                          <input
                            type="number"
                            value={test.points}
                            onChange={(event) => handleTestCaseChange(index, 'points', event.target.value)}
                          />
                        </label>
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            checked={test.isHidden}
                            onChange={(event) => handleTestCaseChange(index, 'isHidden', event.target.checked)}
                          />
                          Hidden
                        </label>
                        <button type="button" className="danger-button cursor-target" onClick={() => removeTestCase(index)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="checkbox">
                    <input type="checkbox" name="isActive" checked={gameForm.isActive} onChange={handleGameFieldChange} />
                    Game is active
                  </label>

                  <button type="submit" className="admin-primary cursor-target" disabled={savingGame}>
                    <FaSave /> {savingGame ? 'Saving...' : editingGameId ? 'Update Game' : 'Create Game'}
                  </button>
                </form>

                <div className="game-list">
                  <h4>Existing Games</h4>
                  <ul>
                    {games.map((game) => (
                      <li key={game.id}>
                        <div>
                          <strong>{game.name}</strong>
                          <small>{game.category} • {game.difficulty}</small>
                        </div>
                        <div className="row-actions">
                          <button className="ghost-button cursor-target" onClick={() => handleEditGame(game)}>
                            Edit
                          </button>
                          <button className="ghost-button cursor-target" onClick={() => handleToggleGameStatus(game)}>
                            {game.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="danger-button cursor-target" onClick={() => handleDeleteGame(game)}>
                            <FaTrash />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default AdminDashboard;
