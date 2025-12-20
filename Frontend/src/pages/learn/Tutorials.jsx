import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaSearch,
  FaClock,
  FaGraduationCap,
  FaPlayCircle,
  FaVideo,
  FaCode,
  FaBookOpen,
  FaRocket,
  FaLightbulb,
  FaStar,
  FaChartLine,
  FaGamepad,
  FaBrain,
  FaUsers,
  FaCheckCircle
} from 'react-icons/fa';
import { 
  GiSwordman, 
  GiTreeBranch,
  GiPathDistance,
  GiPuzzle
} from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './LearnPages.css';

const Tutorials = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Tutorials' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'video', label: 'Video' },
    { id: 'interactive', label: 'Interactive' }
  ];

  const featuredPaths = [
    {
      id: 'complete-beginner',
      title: 'Complete Beginner Path',
      description: 'Start from zero and build a solid foundation in programming and algorithms',
      icon: FaRocket,
      color: '#00ff88',
      colorEnd: '#00d4ff',
      lessons: 25,
      duration: '15 hours',
      students: '12,450',
      topics: ['Variables & Types', 'Control Flow', 'Functions', 'Arrays', 'Basic Algorithms']
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      description: 'Master the patterns and techniques used in technical interviews at top companies',
      icon: FaBrain,
      color: '#ff0080',
      colorEnd: '#9945ff',
      lessons: 40,
      duration: '30 hours',
      students: '8,920',
      topics: ['Problem Patterns', 'Time Optimization', 'Space Optimization', 'System Design Basics']
    },
    {
      id: 'competitive',
      title: 'Competitive Programming',
      description: 'Level up your skills for coding competitions and algorithm battles',
      icon: FaGamepad,
      color: '#ffaa00',
      colorEnd: '#ff4444',
      lessons: 35,
      duration: '25 hours',
      students: '5,670',
      topics: ['Advanced DP', 'Graph Theory', 'Number Theory', 'Computational Geometry']
    }
  ];

  const tutorials = [
    // Beginner Tutorials
    {
      id: 'intro-algorithms',
      title: 'Introduction to Algorithms',
      description: 'What are algorithms? Learn the fundamental concepts, why they matter, and how to analyze their efficiency using Big O notation.',
      category: 'beginner',
      type: 'interactive',
      icon: FaLightbulb,
      color: '#00ff88',
      duration: '45 min',
      lessons: 5,
      rating: 4.9,
      students: 15420
    },
    {
      id: 'arrays-basics',
      title: 'Arrays: The Foundation',
      description: 'Master array operations, understand memory layout, and learn common patterns like two-pointer and sliding window techniques.',
      category: 'beginner',
      type: 'interactive',
      icon: FaCode,
      color: '#00d4ff',
      duration: '1 hour',
      lessons: 6,
      rating: 4.8,
      students: 12890
    },
    {
      id: 'sorting-visual',
      title: 'Sorting Algorithms Visualized',
      description: 'See sorting algorithms in action! Watch how Bubble, Selection, Insertion, Merge, and Quick Sort organize data step by step.',
      category: 'beginner',
      type: 'video',
      icon: FaVideo,
      color: '#ff0080',
      duration: '50 min',
      lessons: 8,
      rating: 4.9,
      students: 18560
    },
    {
      id: 'recursion-101',
      title: 'Recursion Demystified',
      description: 'Understand how recursive thinking works. Learn the base case, recursive case, and how to trace through recursive calls.',
      category: 'beginner',
      type: 'interactive',
      icon: GiTreeBranch,
      color: '#9945ff',
      duration: '1.5 hours',
      lessons: 7,
      rating: 4.7,
      students: 11230
    },
    // Intermediate Tutorials
    {
      id: 'binary-search-master',
      title: 'Binary Search Mastery',
      description: 'Go beyond basic binary search. Learn variations for finding boundaries, rotated arrays, and how to apply it to complex problems.',
      category: 'intermediate',
      type: 'interactive',
      icon: FaSearch,
      color: '#00ff88',
      duration: '2 hours',
      lessons: 10,
      rating: 4.9,
      students: 9870
    },
    {
      id: 'linked-list-deep',
      title: 'Linked Lists Deep Dive',
      description: 'From singly linked to doubly linked and circular lists. Master pointer manipulation, reversal, cycle detection, and merge techniques.',
      category: 'intermediate',
      type: 'video',
      icon: FaCode,
      color: '#00d4ff',
      duration: '2.5 hours',
      lessons: 12,
      rating: 4.8,
      students: 8450
    },
    {
      id: 'trees-traversal',
      title: 'Tree Traversals & BST',
      description: 'Master in-order, pre-order, post-order, and level-order traversals. Build and balance binary search trees.',
      category: 'intermediate',
      type: 'interactive',
      icon: GiTreeBranch,
      color: '#ffaa00',
      duration: '3 hours',
      lessons: 15,
      rating: 4.8,
      students: 7890
    },
    {
      id: 'graph-basics',
      title: 'Graph Theory Fundamentals',
      description: 'Learn graph representations, BFS, DFS, and their applications. Solve maze problems and find connected components.',
      category: 'intermediate',
      type: 'interactive',
      icon: GiPathDistance,
      color: '#ff0080',
      duration: '4 hours',
      lessons: 18,
      rating: 4.9,
      students: 10230
    },
    {
      id: 'hash-tables',
      title: 'Hash Tables & Hashing',
      description: 'Understand hash functions, collision resolution, and implement your own hash map. Solve problems using constant-time lookups.',
      category: 'intermediate',
      type: 'video',
      icon: FaCode,
      color: '#9945ff',
      duration: '2 hours',
      lessons: 8,
      rating: 4.7,
      students: 6540
    },
    // Advanced Tutorials
    {
      id: 'dp-complete',
      title: 'Dynamic Programming Complete Guide',
      description: 'From memoization to tabulation, learn to identify DP problems, define states, and optimize solutions. 20+ classic problems explained.',
      category: 'advanced',
      type: 'interactive',
      icon: FaBrain,
      color: '#00ff88',
      duration: '8 hours',
      lessons: 25,
      rating: 4.9,
      students: 8970
    },
    {
      id: 'graph-advanced',
      title: 'Advanced Graph Algorithms',
      description: 'Dijkstra, Bellman-Ford, Floyd-Warshall, Topological Sort, and more. Master shortest paths, MST, and network flow.',
      category: 'advanced',
      type: 'video',
      icon: GiPathDistance,
      color: '#ff0080',
      duration: '6 hours',
      lessons: 20,
      rating: 4.8,
      students: 5670
    },
    {
      id: 'segment-trees',
      title: 'Segment Trees & Range Queries',
      description: 'Build efficient segment trees for range sum, min, max queries. Learn lazy propagation for range updates.',
      category: 'advanced',
      type: 'interactive',
      icon: GiTreeBranch,
      color: '#9945ff',
      duration: '4 hours',
      lessons: 12,
      rating: 4.7,
      students: 3450
    },
    {
      id: 'string-algorithms',
      title: 'String Algorithms',
      description: 'KMP pattern matching, Rabin-Karp, Z-algorithm, suffix arrays, and tries. Solve complex string manipulation problems.',
      category: 'advanced',
      type: 'interactive',
      icon: FaCode,
      color: '#00d4ff',
      duration: '5 hours',
      lessons: 15,
      rating: 4.8,
      students: 4120
    },
    {
      id: 'backtracking',
      title: 'Backtracking & Pruning',
      description: 'Solve N-Queens, Sudoku, and permutation problems. Learn when to backtrack and how to prune search spaces efficiently.',
      category: 'advanced',
      type: 'video',
      icon: GiPuzzle,
      color: '#ffaa00',
      duration: '3.5 hours',
      lessons: 10,
      rating: 4.9,
      students: 6780
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    let matchesCategory = activeCategory === 'all';
    if (activeCategory === 'video') matchesCategory = tutorial.type === 'video';
    else if (activeCategory === 'interactive') matchesCategory = tutorial.type === 'interactive';
    else if (activeCategory !== 'all') matchesCategory = tutorial.category === activeCategory;
    
    const matchesSearch = searchQuery === '' || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
            <FaGraduationCap />
          </motion.div>
          <h1 className="support-title">Tutorials</h1>
          <p className="support-subtitle">
            Learn algorithms and data structures through interactive lessons, video tutorials, 
            and hands-on practice. From beginner basics to competition-level techniques.
          </p>
        </motion.div>

        {/* Featured Learning Paths */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="support-section-title">Featured Learning Paths</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {featuredPaths.map((path, index) => (
              <motion.div
                key={path.id}
                className="learning-path"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                style={{ 
                  '--path-color': `linear-gradient(180deg, ${path.color}, ${path.colorEnd})`,
                  cursor: 'pointer'
                }}
              >
                <div className="learning-path-header">
                  <div className="learning-path-icon" style={{ borderColor: path.color, color: path.color }}>
                    <path.icon />
                  </div>
                  <div className="learning-path-info">
                    <h3>{path.title}</h3>
                    <p>{path.description}</p>
                    <div className="learning-path-meta">
                      <span><FaBookOpen /> {path.lessons} lessons</span>
                      <span><FaClock /> {path.duration}</span>
                      <span><FaUsers /> {path.students}</span>
                    </div>
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem', 
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {path.topics.map((topic, idx) => (
                    <span key={idx} style={{
                      padding: '0.3rem 0.7rem',
                      background: `${path.color}20`,
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      color: path.color
                    }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ marginTop: '3rem', marginBottom: '2rem' }}
        >
          <h2 className="support-section-title">All Tutorials</h2>
          <div className="search-input-wrapper" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
            <FaSearch />
            <input 
              type="text"
              placeholder="Search tutorials..."
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
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tutorial Cards */}
        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTutorials.map((tutorial) => (
            <motion.div
              key={tutorial.id}
              className="tutorial-card"
              variants={itemVariants}
              style={{
                '--tutorial-color': tutorial.color,
                '--tutorial-color-end': tutorial.color + '80'
              }}
            >
              <div className="tutorial-card-image" style={{
                background: `linear-gradient(135deg, ${tutorial.color}40, ${tutorial.color}20)`
              }}>
                <tutorial.icon />
                <span className={`tutorial-badge ${tutorial.type}`}>
                  {tutorial.type === 'video' ? 'Video' : 'Interactive'}
                </span>
              </div>
              <div className="tutorial-card-content">
                <div className="tutorial-card-meta">
                  <span className="tutorial-card-category" style={{ 
                    background: `${tutorial.color}30`,
                    color: tutorial.color
                  }}>
                    {tutorial.category}
                  </span>
                  <span className="tutorial-card-duration">
                    <FaClock /> {tutorial.duration}
                  </span>
                </div>
                <h4>{tutorial.title}</h4>
                <p>{tutorial.description}</p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ffaa00' }}>
                      <FaStar /> {tutorial.rating}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                      {tutorial.students.toLocaleString()} students
                    </span>
                  </div>
                  <span style={{ 
                    color: 'rgba(255,255,255,0.6)', 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <FaBookOpen /> {tutorial.lessons} lessons
                  </span>
                </div>
                <motion.button
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: `linear-gradient(135deg, ${tutorial.color}, ${tutorial.color}99)`,
                    border: 'none',
                    borderRadius: '10px',
                    color: '#0a0a0a',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tutorial.type === 'video' ? <FaPlayCircle /> : <FaCode />}
                  {tutorial.type === 'video' ? 'Watch Now' : 'Start Learning'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredTutorials.length === 0 && (
          <motion.div 
            className="support-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '3rem' }}
          >
            <FaGraduationCap style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No tutorials found matching your criteria.</p>
          </motion.div>
        )}

        {/* Progress Tracker CTA */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <h3 className="support-card-title" style={{ justifyContent: 'center' }}>
            <FaChartLine /> Track Your Progress
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Create an account to track your learning progress, earn completion badges, 
            and pick up right where you left off.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              className="event-cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              Sign Up Free
            </motion.button>
            <motion.button
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '2px solid #00ff88',
                borderRadius: '10px',
                color: '#00ff88',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              whileHover={{ scale: 1.05, background: 'rgba(0,255,136,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              Already have an account? Log in
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tutorials;
