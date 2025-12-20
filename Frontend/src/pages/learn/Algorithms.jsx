import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaSearch,
  FaClock,
  FaGraduationCap,
  FaPlayCircle,
  FaChartLine,
  FaSortAmountDown,
  FaRandom,
  FaRoute,
  FaNetworkWired,
  FaCubes,
  FaCode,
  FaBrain,
  FaLightbulb,
  FaBookOpen
} from 'react-icons/fa';
import { 
  GiSwordman, 
  GiMaze, 
  GiTreeBranch,
  GiCrystalGrowth,
  GiPathDistance
} from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './LearnPages.css';

const Algorithms = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Algorithms' },
    { id: 'sorting', label: 'Sorting' },
    { id: 'searching', label: 'Searching' },
    { id: 'graph', label: 'Graph' },
    { id: 'dp', label: 'Dynamic Programming' },
    { id: 'greedy', label: 'Greedy' },
    { id: 'divide', label: 'Divide & Conquer' }
  ];

  const algorithms = [
    // Sorting Algorithms
    {
      id: 'bubble-sort',
      name: 'Bubble Sort',
      category: 'sorting',
      icon: FaSortAmountDown,
      color: '#00ff88',
      difficulty: 'beginner',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
      tags: ['comparison', 'in-place', 'stable'],
      useCases: ['Educational purposes', 'Small datasets', 'Nearly sorted arrays']
    },
    {
      id: 'quick-sort',
      name: 'Quick Sort',
      category: 'sorting',
      icon: FaRandom,
      color: '#ff0080',
      difficulty: 'intermediate',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      description: 'An efficient divide-and-conquer algorithm that picks a pivot element and partitions the array around it. Elements smaller than pivot go left, larger go right, then recursively sorts sub-arrays.',
      tags: ['divide-conquer', 'in-place', 'unstable'],
      useCases: ['General purpose sorting', 'Large datasets', 'When average performance matters']
    },
    {
      id: 'merge-sort',
      name: 'Merge Sort',
      category: 'sorting',
      icon: FaCubes,
      color: '#00d4ff',
      difficulty: 'intermediate',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description: 'A stable divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves. Guarantees O(n log n) time complexity in all cases.',
      tags: ['divide-conquer', 'stable', 'external-sort'],
      useCases: ['Linked lists', 'External sorting', 'When stability is required']
    },
    {
      id: 'heap-sort',
      name: 'Heap Sort',
      category: 'sorting',
      icon: GiTreeBranch,
      color: '#9945ff',
      difficulty: 'intermediate',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      description: 'Uses a binary heap data structure to sort elements. First builds a max-heap, then repeatedly extracts the maximum element and rebuilds the heap until sorted.',
      tags: ['heap', 'in-place', 'unstable'],
      useCases: ['Memory constraints', 'Guaranteed O(n log n)', 'Priority queues']
    },
    {
      id: 'insertion-sort',
      name: 'Insertion Sort',
      category: 'sorting',
      icon: FaSortAmountDown,
      color: '#ffaa00',
      difficulty: 'beginner',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Builds the sorted array one element at a time by repeatedly picking the next element and inserting it into its correct position among the previously sorted elements.',
      tags: ['comparison', 'in-place', 'stable', 'adaptive'],
      useCases: ['Small datasets', 'Nearly sorted arrays', 'Online sorting']
    },
    // Searching Algorithms
    {
      id: 'binary-search',
      name: 'Binary Search',
      category: 'searching',
      icon: FaSearch,
      color: '#00ff88',
      difficulty: 'beginner',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      description: 'An efficient search algorithm for sorted arrays. Repeatedly divides the search interval in half, comparing the target with the middle element to determine which half to search next.',
      tags: ['divide-conquer', 'sorted-array', 'efficient'],
      useCases: ['Sorted arrays', 'Database indexing', 'Finding boundaries']
    },
    {
      id: 'linear-search',
      name: 'Linear Search',
      category: 'searching',
      icon: FaRoute,
      color: '#ffaa00',
      difficulty: 'beginner',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'The simplest search algorithm that checks every element in the list until the target is found or the list ends. Works on both sorted and unsorted data.',
      tags: ['sequential', 'unsorted', 'simple'],
      useCases: ['Unsorted data', 'Small datasets', 'Linked lists']
    },
    {
      id: 'jump-search',
      name: 'Jump Search',
      category: 'searching',
      icon: GiPathDistance,
      color: '#00d4ff',
      difficulty: 'intermediate',
      timeComplexity: 'O(√n)',
      spaceComplexity: 'O(1)',
      description: 'Works on sorted arrays by jumping ahead by fixed steps and then performing linear search in the identified block. Optimal jump size is √n.',
      tags: ['sorted-array', 'block-search', 'optimal'],
      useCases: ['Sorted arrays', 'When binary search overhead is too high', 'Systems with slow backward movement']
    },
    // Graph Algorithms
    {
      id: 'bfs',
      name: 'Breadth-First Search (BFS)',
      category: 'graph',
      icon: FaNetworkWired,
      color: '#00ff88',
      difficulty: 'intermediate',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      description: 'Explores all vertices at the current depth before moving to vertices at the next depth level. Uses a queue to track which vertex to visit next. Finds shortest path in unweighted graphs.',
      tags: ['traversal', 'shortest-path', 'level-order'],
      useCases: ['Shortest path (unweighted)', 'Web crawlers', 'Social network analysis']
    },
    {
      id: 'dfs',
      name: 'Depth-First Search (DFS)',
      category: 'graph',
      icon: GiMaze,
      color: '#ff0080',
      difficulty: 'intermediate',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      description: 'Explores as far as possible along each branch before backtracking. Uses a stack (or recursion) to track the path. Essential for topological sorting and cycle detection.',
      tags: ['traversal', 'backtracking', 'recursion'],
      useCases: ['Maze solving', 'Topological sorting', 'Cycle detection']
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      category: 'graph',
      icon: GiPathDistance,
      color: '#00d4ff',
      difficulty: 'advanced',
      timeComplexity: 'O((V+E) log V)',
      spaceComplexity: 'O(V)',
      description: 'Finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights. Uses a priority queue for efficiency.',
      tags: ['shortest-path', 'weighted', 'greedy'],
      useCases: ['GPS navigation', 'Network routing', 'Game pathfinding']
    },
    {
      id: 'bellman-ford',
      name: 'Bellman-Ford Algorithm',
      category: 'graph',
      icon: FaRoute,
      color: '#9945ff',
      difficulty: 'advanced',
      timeComplexity: 'O(V × E)',
      spaceComplexity: 'O(V)',
      description: 'Computes shortest paths from a single source vertex to all other vertices, even with negative edge weights. Can detect negative weight cycles.',
      tags: ['shortest-path', 'negative-weights', 'dynamic'],
      useCases: ['Negative weight edges', 'Currency arbitrage', 'Network protocols']
    },
    {
      id: 'kruskal',
      name: "Kruskal's Algorithm",
      category: 'graph',
      icon: GiTreeBranch,
      color: '#ffaa00',
      difficulty: 'intermediate',
      timeComplexity: 'O(E log E)',
      spaceComplexity: 'O(V)',
      description: 'Finds a minimum spanning tree for a connected weighted graph. Sorts all edges and adds them one by one if they don\'t create a cycle, using Union-Find.',
      tags: ['MST', 'greedy', 'union-find'],
      useCases: ['Network design', 'Cluster analysis', 'Image segmentation']
    },
    // Dynamic Programming
    {
      id: 'fibonacci-dp',
      name: 'Fibonacci (DP)',
      category: 'dp',
      icon: GiCrystalGrowth,
      color: '#00ff88',
      difficulty: 'beginner',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      description: 'Classic introduction to dynamic programming. Stores previously computed Fibonacci numbers to avoid redundant calculations, reducing exponential time to linear.',
      tags: ['memoization', 'tabulation', 'classic'],
      useCases: ['Learning DP', 'Mathematical computations', 'Algorithm interviews']
    },
    {
      id: 'knapsack',
      name: '0/1 Knapsack',
      category: 'dp',
      icon: FaCubes,
      color: '#ff0080',
      difficulty: 'intermediate',
      timeComplexity: 'O(n × W)',
      spaceComplexity: 'O(n × W)',
      description: 'Given weights and values of items, find the maximum value achievable within a weight capacity. Each item can be included at most once.',
      tags: ['optimization', 'subset', 'classic'],
      useCases: ['Resource allocation', 'Investment portfolios', 'Cargo loading']
    },
    {
      id: 'lcs',
      name: 'Longest Common Subsequence',
      category: 'dp',
      icon: FaCode,
      color: '#00d4ff',
      difficulty: 'intermediate',
      timeComplexity: 'O(m × n)',
      spaceComplexity: 'O(m × n)',
      description: 'Finds the longest subsequence common to two sequences. Characters need not be contiguous but must maintain relative order.',
      tags: ['string', 'subsequence', '2D-DP'],
      useCases: ['Diff tools', 'DNA sequence alignment', 'Version control']
    },
    {
      id: 'lis',
      name: 'Longest Increasing Subsequence',
      category: 'dp',
      icon: FaChartLine,
      color: '#9945ff',
      difficulty: 'intermediate',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description: 'Finds the length of the longest subsequence where all elements are in strictly increasing order. Can be solved in O(n log n) using binary search.',
      tags: ['subsequence', 'binary-search', 'optimization'],
      useCases: ['Stock trading', 'Patience sorting', 'Sequence analysis']
    },
    // Greedy Algorithms
    {
      id: 'activity-selection',
      name: 'Activity Selection',
      category: 'greedy',
      icon: FaClock,
      color: '#00ff88',
      difficulty: 'intermediate',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      description: 'Selects maximum number of non-overlapping activities. Sort by finish time and greedily select activities that start after the previous one finishes.',
      tags: ['scheduling', 'interval', 'classic'],
      useCases: ['Meeting room scheduling', 'Task scheduling', 'Resource management']
    },
    {
      id: 'huffman',
      name: 'Huffman Coding',
      category: 'greedy',
      icon: GiTreeBranch,
      color: '#ff0080',
      difficulty: 'advanced',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description: 'Creates optimal prefix-free binary codes for data compression. Builds a tree bottom-up, always combining the two lowest frequency nodes.',
      tags: ['compression', 'tree', 'prefix-code'],
      useCases: ['File compression (ZIP, GZIP)', 'Data transmission', 'Image compression']
    },
    // Divide & Conquer
    {
      id: 'binary-search-dc',
      name: 'Binary Search (D&C)',
      category: 'divide',
      icon: FaSearch,
      color: '#00ff88',
      difficulty: 'beginner',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(log n)',
      description: 'The recursive implementation of binary search, demonstrating the divide and conquer paradigm by splitting the problem into smaller subproblems.',
      tags: ['recursive', 'search', 'classic'],
      useCases: ['Sorted array search', 'Teaching recursion', 'Foundation for other algorithms']
    },
    {
      id: 'strassen',
      name: "Strassen's Matrix Multiplication",
      category: 'divide',
      icon: FaCubes,
      color: '#9945ff',
      difficulty: 'advanced',
      timeComplexity: 'O(n^2.807)',
      spaceComplexity: 'O(n²)',
      description: 'Multiplies two matrices faster than the naive O(n³) algorithm by cleverly reducing the number of recursive multiplications from 8 to 7.',
      tags: ['matrix', 'optimization', 'mathematical'],
      useCases: ['Large matrix computations', 'Scientific computing', 'Machine learning']
    }
  ];

  const filteredAlgorithms = algorithms.filter(algo => {
    const matchesCategory = activeCategory === 'all' || algo.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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
            <FaBrain />
          </motion.div>
          <h1 className="support-title">Algorithms</h1>
          <p className="support-subtitle">
            Master the fundamental algorithms that power modern software. From sorting to graph traversal, 
            learn the techniques that will make you a better programmer.
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
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>25+</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Algorithms</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00d4ff', fontFamily: 'Orbitron, monospace' }}>7</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Categories</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff0080', fontFamily: 'Orbitron, monospace' }}>50+</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Visualizations</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffaa00', fontFamily: 'Orbitron, monospace' }}>100+</div>
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
              placeholder="Search algorithms..."
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

        {/* Algorithm Cards */}
        <motion.div 
          className="topics-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredAlgorithms.map((algo) => (
            <motion.div
              key={algo.id}
              className="algo-detail-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              style={{ '--algo-color': algo.color }}
            >
              <div className="algo-detail-header">
                <div className="algo-detail-icon" style={{ '--algo-color': algo.color }}>
                  <algo.icon />
                </div>
                <div className="algo-detail-title">
                  <h3>{algo.name}</h3>
                  <span style={{ textTransform: 'capitalize' }}>{algo.category.replace('dp', 'Dynamic Programming')}</span>
                </div>
              </div>
              <div className="algo-detail-body">
                <div className="algo-complexity">
                  <div className="complexity-item">
                    <div className="label">Time</div>
                    <div className="value">{algo.timeComplexity}</div>
                  </div>
                  <div className="complexity-item">
                    <div className="label">Space</div>
                    <div className="value">{algo.spaceComplexity}</div>
                  </div>
                  <div className="complexity-item">
                    <div className="label">Level</div>
                    <div className="value" style={{ 
                      color: algo.difficulty === 'beginner' ? '#00ff88' : 
                             algo.difficulty === 'intermediate' ? '#ffaa00' : '#ff0080',
                      textTransform: 'capitalize'
                    }}>
                      {algo.difficulty}
                    </div>
                  </div>
                </div>
                <p className="algo-description">{algo.description}</p>
                <div className="algo-tags">
                  {algo.tags.map((tag, idx) => (
                    <span key={idx} className="algo-tag">{tag}</span>
                  ))}
                </div>
                <motion.button
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: `linear-gradient(135deg, ${algo.color}, ${algo.color}99)`,
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

        {filteredAlgorithms.length === 0 && (
          <motion.div 
            className="support-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '3rem' }}
          >
            <FaBrain style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No algorithms found matching your criteria.</p>
          </motion.div>
        )}

        {/* Learning Path CTA */}
        <motion.div 
          className="learning-path"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ '--path-color': 'linear-gradient(180deg, #00ff88, #00d4ff)', marginTop: '3rem' }}
        >
          <div className="learning-path-header">
            <div className="learning-path-icon">
              <FaGraduationCap />
            </div>
            <div className="learning-path-info">
              <h3>Complete Algorithm Mastery Path</h3>
              <p>
                Follow our structured learning path to go from beginner to algorithm expert. 
                Includes theory, visualizations, practice problems, and coding challenges.
              </p>
              <div className="learning-path-meta">
                <span><FaBookOpen /> 50 lessons</span>
                <span><FaClock /> ~40 hours</span>
                <span><FaCode /> 100+ problems</span>
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

export default Algorithms;
