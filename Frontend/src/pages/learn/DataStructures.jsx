import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaSearch,
  FaClock,
  FaGraduationCap,
  FaPlayCircle,
  FaLayerGroup,
  FaListUl,
  FaDatabase,
  FaCode,
  FaBookOpen,
  FaSitemap,
  FaProjectDiagram
} from 'react-icons/fa';
import { 
  GiSwordman, 
  GiTreeBranch,
  GiStack,
  GiNetworkBars,
  GiCube,
  GiHoneycomb
} from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './LearnPages.css';

const DataStructures = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Structures' },
    { id: 'linear', label: 'Linear' },
    { id: 'tree', label: 'Trees' },
    { id: 'graph', label: 'Graphs' },
    { id: 'hash', label: 'Hash-based' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const dataStructures = [
    // Linear Data Structures
    {
      id: 'array',
      name: 'Array',
      category: 'linear',
      icon: FaLayerGroup,
      color: '#00ff88',
      difficulty: 'beginner',
      operations: {
        access: 'O(1)',
        search: 'O(n)',
        insert: 'O(n)',
        delete: 'O(n)'
      },
      description: 'A collection of elements stored at contiguous memory locations. The most fundamental data structure, providing O(1) random access by index. Foundation for many other structures.',
      keyFeatures: ['Fixed size (static) or dynamic', 'Random access O(1)', 'Cache-friendly', 'Contiguous memory'],
      useCases: ['Storing collections', 'Lookup tables', 'Matrix operations', 'Buffer management']
    },
    {
      id: 'linked-list',
      name: 'Linked List',
      category: 'linear',
      icon: FaListUl,
      color: '#00d4ff',
      difficulty: 'beginner',
      operations: {
        access: 'O(n)',
        search: 'O(n)',
        insert: 'O(1)',
        delete: 'O(1)'
      },
      description: 'A linear collection where each element (node) contains data and a reference to the next node. Enables efficient insertion and deletion without shifting elements.',
      keyFeatures: ['Dynamic size', 'Efficient insert/delete', 'No random access', 'Singly/Doubly linked variants'],
      useCases: ['Implementing stacks/queues', 'Undo functionality', 'Memory allocation', 'Polynomial representation']
    },
    {
      id: 'stack',
      name: 'Stack',
      category: 'linear',
      icon: GiStack,
      color: '#ff0080',
      difficulty: 'beginner',
      operations: {
        push: 'O(1)',
        pop: 'O(1)',
        peek: 'O(1)',
        search: 'O(n)'
      },
      description: 'A LIFO (Last In, First Out) data structure. Elements are added and removed from the same end called the "top". Essential for recursion, expression parsing, and backtracking.',
      keyFeatures: ['LIFO ordering', 'Push/Pop operations', 'Top access only', 'Simple implementation'],
      useCases: ['Function call stack', 'Expression evaluation', 'Undo mechanisms', 'Backtracking algorithms']
    },
    {
      id: 'queue',
      name: 'Queue',
      category: 'linear',
      icon: FaDatabase,
      color: '#ffaa00',
      difficulty: 'beginner',
      operations: {
        enqueue: 'O(1)',
        dequeue: 'O(1)',
        peek: 'O(1)',
        search: 'O(n)'
      },
      description: 'A FIFO (First In, First Out) data structure. Elements are added at the rear and removed from the front. Fundamental for scheduling and breadth-first traversals.',
      keyFeatures: ['FIFO ordering', 'Enqueue/Dequeue operations', 'Front and rear pointers', 'Circular queue variant'],
      useCases: ['Task scheduling', 'BFS traversal', 'Print queue', 'Buffer management']
    },
    {
      id: 'deque',
      name: 'Deque (Double-Ended Queue)',
      category: 'linear',
      icon: FaLayerGroup,
      color: '#9945ff',
      difficulty: 'intermediate',
      operations: {
        'add front/back': 'O(1)',
        'remove front/back': 'O(1)',
        peek: 'O(1)',
        search: 'O(n)'
      },
      description: 'A generalized queue that allows insertion and deletion at both ends. Combines the functionality of stacks and queues in a single data structure.',
      keyFeatures: ['Both-end operations', 'Flexible access', 'Implements stack + queue', 'Can be array or linked list based'],
      useCases: ['Sliding window problems', 'Work stealing algorithms', 'Undo/Redo', 'Palindrome checking']
    },
    // Tree Data Structures
    {
      id: 'binary-tree',
      name: 'Binary Tree',
      category: 'tree',
      icon: GiTreeBranch,
      color: '#00ff88',
      difficulty: 'intermediate',
      operations: {
        access: 'O(n)',
        search: 'O(n)',
        insert: 'O(n)',
        delete: 'O(n)'
      },
      description: 'A hierarchical structure where each node has at most two children (left and right). The foundation for BSTs, heaps, and many advanced tree structures.',
      keyFeatures: ['Hierarchical structure', 'At most 2 children per node', 'Root, internal, and leaf nodes', 'Various traversal methods'],
      useCases: ['Expression trees', 'Decision trees', 'File systems', 'Syntax trees']
    },
    {
      id: 'bst',
      name: 'Binary Search Tree (BST)',
      category: 'tree',
      icon: GiTreeBranch,
      color: '#00d4ff',
      difficulty: 'intermediate',
      operations: {
        access: 'O(log n)*',
        search: 'O(log n)*',
        insert: 'O(log n)*',
        delete: 'O(log n)*'
      },
      description: 'A binary tree where left child < parent < right child. Enables efficient searching, insertion, and deletion. *Average case; worst case O(n) for unbalanced trees.',
      keyFeatures: ['Ordered structure', 'In-order gives sorted sequence', 'Efficient search', 'Can become unbalanced'],
      useCases: ['Database indexing', 'Symbol tables', 'Priority scheduling', 'Auto-complete systems']
    },
    {
      id: 'avl-tree',
      name: 'AVL Tree',
      category: 'tree',
      icon: GiTreeBranch,
      color: '#ff0080',
      difficulty: 'advanced',
      operations: {
        access: 'O(log n)',
        search: 'O(log n)',
        insert: 'O(log n)',
        delete: 'O(log n)'
      },
      description: 'A self-balancing BST where the heights of left and right subtrees differ by at most 1. Uses rotations to maintain balance after insertions and deletions.',
      keyFeatures: ['Guaranteed O(log n) operations', 'Balance factor ≤ 1', 'Rotation operations', 'Strict balancing'],
      useCases: ['Database systems', 'Lookup-intensive applications', 'Memory management', 'Dictionaries']
    },
    {
      id: 'red-black-tree',
      name: 'Red-Black Tree',
      category: 'tree',
      icon: GiTreeBranch,
      color: '#ff4444',
      difficulty: 'advanced',
      operations: {
        access: 'O(log n)',
        search: 'O(log n)',
        insert: 'O(log n)',
        delete: 'O(log n)'
      },
      description: 'A self-balancing BST with an extra bit for color (red or black). Less strictly balanced than AVL but requires fewer rotations, making insertions/deletions faster.',
      keyFeatures: ['Color-based balancing', 'Guaranteed O(log n)', 'Fewer rotations than AVL', 'Used in many libraries'],
      useCases: ['C++ STL map/set', 'Java TreeMap/TreeSet', 'Linux kernel', 'Real-time applications']
    },
    {
      id: 'heap',
      name: 'Heap (Binary Heap)',
      category: 'tree',
      icon: GiTreeBranch,
      color: '#ffaa00',
      difficulty: 'intermediate',
      operations: {
        'find min/max': 'O(1)',
        insert: 'O(log n)',
        'extract min/max': 'O(log n)',
        heapify: 'O(n)'
      },
      description: 'A complete binary tree where parent is always greater (max-heap) or smaller (min-heap) than children. Efficient for priority queue implementation.',
      keyFeatures: ['Complete binary tree', 'Heap property', 'Array representation', 'Efficient priority queue'],
      useCases: ['Priority queues', 'Heap sort', 'Job scheduling', "Dijkstra's algorithm"]
    },
    {
      id: 'trie',
      name: 'Trie (Prefix Tree)',
      category: 'tree',
      icon: FaSitemap,
      color: '#9945ff',
      difficulty: 'intermediate',
      operations: {
        search: 'O(m)',
        insert: 'O(m)',
        delete: 'O(m)',
        'prefix search': 'O(m)'
      },
      description: 'A tree structure for storing strings where each node represents a character. Enables fast prefix-based searches. m = length of the string.',
      keyFeatures: ['Character-based nodes', 'Prefix sharing', 'Fast string operations', 'Space for common prefixes'],
      useCases: ['Autocomplete', 'Spell checkers', 'IP routing', 'Dictionary implementation']
    },
    // Graph Structures
    {
      id: 'graph-adj-list',
      name: 'Graph (Adjacency List)',
      category: 'graph',
      icon: FaProjectDiagram,
      color: '#00ff88',
      difficulty: 'intermediate',
      operations: {
        'add vertex': 'O(1)',
        'add edge': 'O(1)',
        'remove edge': 'O(E)',
        'check edge': 'O(V)'
      },
      description: 'Represents a graph as an array of lists. Each index represents a vertex, and the list contains all adjacent vertices. Space-efficient for sparse graphs.',
      keyFeatures: ['Space O(V + E)', 'Efficient for sparse graphs', 'Easy neighbor iteration', 'Dynamic structure'],
      useCases: ['Social networks', 'Web page links', 'Road networks', 'Recommendation systems']
    },
    {
      id: 'graph-adj-matrix',
      name: 'Graph (Adjacency Matrix)',
      category: 'graph',
      icon: GiHoneycomb,
      color: '#00d4ff',
      difficulty: 'intermediate',
      operations: {
        'add vertex': 'O(V²)',
        'add edge': 'O(1)',
        'remove edge': 'O(1)',
        'check edge': 'O(1)'
      },
      description: 'Represents a graph as a 2D matrix where matrix[i][j] indicates an edge between vertices i and j. O(1) edge lookup but O(V²) space.',
      keyFeatures: ['Space O(V²)', 'O(1) edge check', 'Good for dense graphs', 'Simple implementation'],
      useCases: ['Dense graphs', 'Weighted graphs', 'Floyd-Warshall algorithm', 'Transitive closure']
    },
    // Hash-based Structures
    {
      id: 'hash-table',
      name: 'Hash Table',
      category: 'hash',
      icon: GiCube,
      color: '#00ff88',
      difficulty: 'intermediate',
      operations: {
        search: 'O(1)*',
        insert: 'O(1)*',
        delete: 'O(1)*',
        'worst case': 'O(n)'
      },
      description: 'Uses a hash function to map keys to array indices for O(1) average-case operations. Handles collisions via chaining or open addressing. *Average case.',
      keyFeatures: ['Key-value storage', 'Hash function', 'Collision handling', 'Load factor management'],
      useCases: ['Caching', 'Database indexing', 'Symbol tables', 'Counting frequencies']
    },
    {
      id: 'hash-set',
      name: 'Hash Set',
      category: 'hash',
      icon: GiCube,
      color: '#ff0080',
      difficulty: 'intermediate',
      operations: {
        contains: 'O(1)*',
        add: 'O(1)*',
        remove: 'O(1)*',
        'worst case': 'O(n)'
      },
      description: 'A set implementation using hashing. Stores unique elements with O(1) membership testing. Does not maintain insertion order.',
      keyFeatures: ['Unique elements only', 'No ordering', 'Fast membership test', 'Based on hash table'],
      useCases: ['Removing duplicates', 'Membership testing', 'Set operations', 'Visited tracking']
    },
    // Advanced Structures
    {
      id: 'segment-tree',
      name: 'Segment Tree',
      category: 'advanced',
      icon: GiTreeBranch,
      color: '#ff0080',
      difficulty: 'advanced',
      operations: {
        build: 'O(n)',
        query: 'O(log n)',
        update: 'O(log n)',
        space: 'O(n)'
      },
      description: 'A tree structure for storing intervals/segments. Enables efficient range queries (sum, min, max) and point updates on an array.',
      keyFeatures: ['Range queries', 'Point updates', 'Lazy propagation', 'Binary tree structure'],
      useCases: ['Range sum queries', 'Range minimum queries', 'Computational geometry', 'Competitive programming']
    },
    {
      id: 'fenwick-tree',
      name: 'Fenwick Tree (BIT)',
      category: 'advanced',
      icon: GiTreeBranch,
      color: '#9945ff',
      difficulty: 'advanced',
      operations: {
        build: 'O(n)',
        'prefix sum': 'O(log n)',
        update: 'O(log n)',
        space: 'O(n)'
      },
      description: 'Binary Indexed Tree - a space-efficient structure for cumulative frequency tables. Simpler than segment trees but limited to prefix queries.',
      keyFeatures: ['Compact representation', 'Prefix operations', 'Bit manipulation', 'Less memory than segment tree'],
      useCases: ['Prefix sums', 'Inversion count', 'Dynamic cumulative frequency', 'Competitive programming']
    },
    {
      id: 'union-find',
      name: 'Union-Find (Disjoint Set)',
      category: 'advanced',
      icon: FaProjectDiagram,
      color: '#ffaa00',
      difficulty: 'intermediate',
      operations: {
        find: 'O(α(n))',
        union: 'O(α(n))',
        makeSet: 'O(1)',
        space: 'O(n)'
      },
      description: 'Tracks elements partitioned into disjoint sets. Supports near O(1) operations with path compression and union by rank. α(n) is inverse Ackermann function.',
      keyFeatures: ['Disjoint sets', 'Path compression', 'Union by rank', 'Nearly constant time'],
      useCases: ["Kruskal's MST", 'Cycle detection', 'Connected components', 'Network connectivity']
    },
    {
      id: 'lru-cache',
      name: 'LRU Cache',
      category: 'advanced',
      icon: FaDatabase,
      color: '#00d4ff',
      difficulty: 'intermediate',
      operations: {
        get: 'O(1)',
        put: 'O(1)',
        evict: 'O(1)',
        space: 'O(capacity)'
      },
      description: 'Least Recently Used cache implementation using a hash map + doubly linked list. Evicts least recently accessed items when capacity is exceeded.',
      keyFeatures: ['Fixed capacity', 'O(1) operations', 'Automatic eviction', 'Hash map + linked list'],
      useCases: ['Browser cache', 'Database caching', 'Memory management', 'API rate limiting']
    }
  ];

  const filteredStructures = dataStructures.filter(ds => {
    const matchesCategory = activeCategory === 'all' || ds.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.keyFeatures.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
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
            <FaDatabase />
          </motion.div>
          <h1 className="support-title">Data Structures</h1>
          <p className="support-subtitle">
            Master the building blocks of efficient software. Learn how to organize, store, 
            and access data optimally for any programming challenge.
          </p>
        </motion.div>

        {/* Stats */}
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
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>20+</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Data Structures</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00d4ff', fontFamily: 'Orbitron, monospace' }}>6</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Categories</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff0080', fontFamily: 'Orbitron, monospace' }}>40+</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Visualizations</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffaa00', fontFamily: 'Orbitron, monospace' }}>80+</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Practice Problems</div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ marginBottom: '2rem' }}
        >
          <div className="search-input-wrapper" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
            <FaSearch />
            <input 
              type="text"
              placeholder="Search data structures..."
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

        {/* Data Structure Cards */}
        <motion.div 
          className="topics-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredStructures.map((ds) => (
            <motion.div
              key={ds.id}
              className="algo-detail-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              style={{ '--algo-color': ds.color }}
            >
              <div className="algo-detail-header">
                <div className="algo-detail-icon" style={{ '--algo-color': ds.color }}>
                  <ds.icon />
                </div>
                <div className="algo-detail-title">
                  <h3>{ds.name}</h3>
                  <span style={{ textTransform: 'capitalize' }}>{ds.category}</span>
                </div>
              </div>
              <div className="algo-detail-body">
                <div className="algo-complexity" style={{ flexWrap: 'wrap' }}>
                  {Object.entries(ds.operations).slice(0, 4).map(([op, complexity]) => (
                    <div key={op} className="complexity-item">
                      <div className="label">{op}</div>
                      <div className="value">{complexity}</div>
                    </div>
                  ))}
                </div>
                <p className="algo-description">{ds.description}</p>
                <div className="algo-tags">
                  {ds.keyFeatures.slice(0, 4).map((feature, idx) => (
                    <span key={idx} className="algo-tag">{feature}</span>
                  ))}
                </div>
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  background: 'rgba(0,0,0,0.3)', 
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  <strong style={{ color: '#00ff88' }}>Use cases: </strong>
                  {ds.useCases.join(' • ')}
                </div>
                <motion.button
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: `linear-gradient(135deg, ${ds.color}, ${ds.color}99)`,
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
                  onClick={() => navigate('/visualizers')}
                >
                  <FaPlayCircle /> Visualize & Learn
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredStructures.length === 0 && (
          <motion.div 
            className="support-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '3rem' }}
          >
            <FaDatabase style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No data structures found matching your criteria.</p>
          </motion.div>
        )}

        {/* Learning Path CTA */}
        <motion.div 
          className="learning-path"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ '--path-color': 'linear-gradient(180deg, #00d4ff, #9945ff)', marginTop: '3rem' }}
        >
          <div className="learning-path-header">
            <div className="learning-path-icon" style={{ borderColor: '#00d4ff', color: '#00d4ff' }}>
              <FaGraduationCap />
            </div>
            <div className="learning-path-info">
              <h3>Data Structures Mastery Path</h3>
              <p>
                From arrays to advanced trees, master every data structure you'll need for interviews 
                and real-world programming. Includes hands-on implementations and coding challenges.
              </p>
              <div className="learning-path-meta">
                <span><FaBookOpen /> 40 lessons</span>
                <span><FaClock /> ~30 hours</span>
                <span><FaCode /> 80+ problems</span>
              </div>
            </div>
          </div>
          <motion.button
            className="event-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
          >
            Start Learning Path
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default DataStructures;
