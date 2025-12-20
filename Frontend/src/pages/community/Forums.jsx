import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaComments,
  FaCode,
  FaTrophy,
  FaLightbulb,
  FaGraduationCap,
  FaBug,
  FaRocket,
  FaUsers,
  FaEye,
  FaReply,
  FaClock,
  FaFire,
  FaSearch,
  FaPlusCircle
} from 'react-icons/fa';
import { GiSwordman, GiPodium, GiPuzzle, GiArtificialIntelligence } from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './CommunityPages.css';

const Forums = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const forumCategories = [
    {
      id: 'algorithms',
      icon: FaCode,
      title: 'Algorithms & Data Structures',
      description: 'Discuss sorting, searching, graphs, trees, and more',
      threads: 1247,
      posts: 8934,
      color: '#00ff88'
    },
    {
      id: 'challenges',
      icon: FaTrophy,
      title: 'Challenge Discussions',
      description: 'Share solutions, strategies, and tips for challenges',
      threads: 892,
      posts: 5621,
      color: '#ffaa00'
    },
    {
      id: 'help',
      icon: FaLightbulb,
      title: 'Help & Support',
      description: 'Get help from the community on coding problems',
      threads: 2156,
      posts: 12847,
      color: '#00d4ff'
    },
    {
      id: 'learning',
      icon: FaGraduationCap,
      title: 'Learning Resources',
      description: 'Share tutorials, courses, and study materials',
      threads: 543,
      posts: 2891,
      color: '#9945ff'
    },
    {
      id: 'bugs',
      icon: FaBug,
      title: 'Bug Reports',
      description: 'Report platform bugs and track fixes',
      threads: 234,
      posts: 876,
      color: '#ff4444'
    },
    {
      id: 'showcase',
      icon: FaRocket,
      title: 'Project Showcase',
      description: 'Show off your projects and get feedback',
      threads: 678,
      posts: 4532,
      color: '#ff0080'
    }
  ];

  const recentThreads = [
    {
      id: 1,
      title: 'Best approach for solving the "Graph Gladiator" challenge?',
      author: 'AlgoMaster99',
      avatar: 'A',
      category: 'Challenge Discussions',
      categoryColor: '#ffaa00',
      replies: 23,
      views: 456,
      lastActivity: '2 hours ago',
      isHot: true
    },
    {
      id: 2,
      title: 'Understanding Time Complexity: A Visual Guide',
      author: 'CodeNinja',
      avatar: 'C',
      category: 'Learning Resources',
      categoryColor: '#9945ff',
      replies: 45,
      views: 1234,
      lastActivity: '4 hours ago',
      isHot: true
    },
    {
      id: 3,
      title: 'Quick Sort vs Merge Sort - Which one should I use?',
      author: 'SortingWizard',
      avatar: 'S',
      category: 'Algorithms & Data Structures',
      categoryColor: '#00ff88',
      replies: 67,
      views: 2341,
      lastActivity: '5 hours ago',
      isHot: true
    },
    {
      id: 4,
      title: 'New to Playgorithm - Where should I start?',
      author: 'FreshCoder',
      avatar: 'F',
      category: 'Help & Support',
      categoryColor: '#00d4ff',
      replies: 12,
      views: 234,
      lastActivity: '6 hours ago',
      isHot: false
    },
    {
      id: 5,
      title: 'Built a pathfinding visualizer using what I learned here!',
      author: 'VisualizerPro',
      avatar: 'V',
      category: 'Project Showcase',
      categoryColor: '#ff0080',
      replies: 34,
      views: 567,
      lastActivity: '8 hours ago',
      isHot: false
    },
    {
      id: 6,
      title: 'Dynamic Programming explained with real-world examples',
      author: 'DPGuru',
      avatar: 'D',
      category: 'Learning Resources',
      categoryColor: '#9945ff',
      replies: 89,
      views: 3456,
      lastActivity: '10 hours ago',
      isHot: true
    },
    {
      id: 7,
      title: 'Issue with leaderboard not updating after wins',
      author: 'BugHunter',
      avatar: 'B',
      category: 'Bug Reports',
      categoryColor: '#ff4444',
      replies: 5,
      views: 123,
      lastActivity: '12 hours ago',
      isHot: false
    },
    {
      id: 8,
      title: 'Tips for winning Algorithm Battles consistently',
      author: 'BattleChamp',
      avatar: 'B',
      category: 'Challenge Discussions',
      categoryColor: '#ffaa00',
      replies: 56,
      views: 1890,
      lastActivity: '1 day ago',
      isHot: true
    }
  ];

  const filters = [
    { id: 'all', label: 'All Threads', icon: FaComments },
    { id: 'hot', label: 'Hot', icon: FaFire },
    { id: 'recent', label: 'Recent', icon: FaClock },
    { id: 'unanswered', label: 'Unanswered', icon: FaLightbulb }
  ];

  const filteredThreads = recentThreads.filter(thread => {
    const matchesSearch = searchQuery === '' || 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'hot') return matchesSearch && thread.isHot;
    if (activeFilter === 'unanswered') return matchesSearch && thread.replies === 0;
    return matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="support-page">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="support-nav">
        <div className="container">
          <div className="nav-brand" onClick={() => navigate('/')}>
            <GiSwordman className="brand-icon" />
            <span>Playgorithm</span>
          </div>
          <button className="nav-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
        </div>
      </nav>

      <div className="support-container">
        {/* Header */}
        <motion.div 
          className="support-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="support-header-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaComments />
          </motion.div>
          <h1 className="support-title">Community Forums</h1>
          <p className="support-subtitle">
            Connect with fellow algorithm enthusiasts, share knowledge, ask questions, 
            and level up together. Join the conversation!
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            flexWrap: 'wrap',
            gap: '1.5rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>5,750</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Total Threads</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00d4ff', fontFamily: 'Orbitron, monospace' }}>35,701</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Total Posts</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff0080', fontFamily: 'Orbitron, monospace' }}>12,450</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Members</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffaa00', fontFamily: 'Orbitron, monospace' }}>234</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Online Now</div>
          </div>
        </motion.div>

        {/* Forum Categories */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="support-section-title">Browse Categories</h2>
          <motion.div 
            className="forum-categories"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {forumCategories.map((category) => (
              <motion.div
                key={category.id}
                className="forum-category-card"
                variants={itemVariants}
                style={{ '--category-color': category.color }}
                whileHover={{ y: -5 }}
              >
                <div className="forum-category-header">
                  <div className="forum-category-icon" style={{ '--category-color': category.color }}>
                    <category.icon />
                  </div>
                  <div className="forum-category-info">
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </div>
                </div>
                <div className="forum-category-stats">
                  <div className="forum-stat">
                    <FaComments />
                    <span>{category.threads.toLocaleString()} threads</span>
                  </div>
                  <div className="forum-stat">
                    <FaReply />
                    <span>{category.posts.toLocaleString()} posts</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Recent Threads */}
        <motion.div 
          className="support-section recent-threads"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 className="support-section-title" style={{ margin: 0, borderBottom: 'none' }}>Recent Discussions</h2>
            <motion.button
              className="event-cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FaPlusCircle /> New Thread
            </motion.button>
          </div>

          {/* Search & Filters */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="search-input-wrapper" style={{ maxWidth: '400px', marginBottom: '1rem' }}>
              <FaSearch />
              <input 
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 45px',
                  background: 'rgba(15, 15, 15, 0.9)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '25px',
                  color: '#ffffff',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <div className="filter-tabs">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <filter.icon /> {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Thread List */}
          <motion.div 
            className="thread-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredThreads.map((thread) => (
              <motion.div
                key={thread.id}
                className="thread-item"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <div className="thread-avatar">{thread.avatar}</div>
                <div className="thread-content">
                  <div className="thread-title">
                    {thread.isHot && <FaFire style={{ color: '#ff4444', marginRight: '8px' }} />}
                    {thread.title}
                  </div>
                  <div className="thread-meta">
                    <span className="thread-category" style={{ background: `${thread.categoryColor}20`, color: thread.categoryColor }}>
                      {thread.category}
                    </span>
                    <span>by {thread.author}</span>
                    <span>• {thread.lastActivity}</span>
                  </div>
                </div>
                <div className="thread-stats">
                  <span><FaReply /> {thread.replies}</span>
                  <span><FaEye /> {thread.views}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredThreads.length === 0 && (
            <div className="support-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <FaComments style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }} />
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>No threads found matching your criteria.</p>
            </div>
          )}
        </motion.div>

        {/* Join CTA */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <h3 className="support-card-title" style={{ justifyContent: 'center' }}>
            <FaUsers /> Join the Conversation
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Sign up or log in to participate in discussions, ask questions, and help fellow coders on their algorithm journey.
          </p>
          <motion.button
            className="event-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Forums;
