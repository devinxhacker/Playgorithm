import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, 
  FaPlay, 
  FaSort, 
  FaRoute, 
  FaSearch, 
  FaChessQueen,
  FaTree,
  FaPuzzlePiece,
  FaCalculator,
  FaLayerGroup
} from "react-icons/fa";
import "./AlgorithmVisualizerHub.css";

const AlgorithmVisualizerHub = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const visualizers = [
    {
      id: "sorting",
      name: "Sorting Algorithms",
      description: "Compare Bubble, Selection, Insertion, Quick, Merge, and Heap sort algorithms side by side with beautiful animations",
      difficulty: "EASY",
      category: "SORTING",
      icon: FaSort,
      color: "#ff6b35",
      features: ["6 Algorithms", "Compare Mode", "Speed Control"],
      native: true,
    },
    {
      id: "pathfinder",
      name: "Pathfinding Algorithms",
      description: "Explore Dijkstra, A*, BFS, and DFS pathfinding algorithms with maze generation and interactive wall placement",
      difficulty: "MEDIUM",
      category: "GRAPH",
      icon: FaRoute,
      color: "#00d4ff",
      features: ["4 Algorithms", "Maze Generator", "Interactive Grid"],
      native: true,
    },
    {
      id: "binary-search",
      name: "Binary Search",
      description: "Interactive binary search visualization with step-by-step execution and comparison counter",
      difficulty: "EASY",
      category: "SEARCHING",
      icon: FaSearch,
      color: "#4caf50",
      features: ["Step by Step", "Visual Comparison", "Custom Arrays"],
      native: true,
    },
    {
      id: "n-queen",
      name: "N-Queens Problem",
      description: "Solve the classic N-Queens problem with backtracking visualization and solution animation",
      difficulty: "HARD",
      category: "BACKTRACKING",
      icon: FaChessQueen,
      color: "#ff0080",
      features: ["Backtracking", "Multiple Solutions", "Board Sizes"],
      native: true,
    },
    {
      id: "recursion-tree",
      name: "Recursion Tree",
      description: "Visualize recursion trees for Fibonacci, factorial, and other recursive functions",
      difficulty: "MEDIUM",
      category: "RECURSION",
      icon: FaTree,
      color: "#00ff88",
      features: ["Fibonacci", "Tree Animation", "Call Stack"],
      native: true,
    },
    {
      id: "15-puzzle",
      name: "15-Puzzle Solver",
      description: "Watch AI solve the classic 15-puzzle using A* search algorithm with heuristic visualization",
      difficulty: "MEDIUM",
      category: "PUZZLE",
      icon: FaPuzzlePiece,
      color: "#2196f3",
      features: ["A* Search", "Heuristics", "Step Counter"],
      native: true,
    },
    {
      id: "prime-numbers",
      name: "Prime Numbers",
      description: "Visualize prime number patterns with the Sieve of Eratosthenes algorithm",
      difficulty: "EASY",
      category: "MATHEMATICS",
      icon: FaCalculator,
      color: "#9c27b0",
      features: ["Sieve Algorithm", "Pattern Viz", "Performance"],
      native: true,
    },
    {
      id: "recursive-sorting",
      name: "Recursive Sorting",
      description: "Watch merge sort and quick sort break down problems recursively with tree visualization",
      difficulty: "MEDIUM",
      category: "SORTING",
      icon: FaLayerGroup,
      color: "#ffc107",
      features: ["Merge Sort", "Quick Sort", "Divide & Conquer"],
      native: true,
    },
  ];

  const handlePlayVisualizer = (visualizerId) => {
    navigate(`/visualizer/${visualizerId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="visualizer-hub">
      {/* Animated Background */}
      <div className="hub-bg-effects">
        <div className="bg-gradient-orb orb-1"></div>
        <div className="bg-gradient-orb orb-2"></div>
        <div className="bg-gradient-orb orb-3"></div>
      </div>

      {/* Header */}
      <div className="hub-header">
        <button onClick={() => navigate("/dashboard")} className="back-button cursor-target">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <motion.div 
          className="hub-title-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>
            <span className="title-algo">Algorithm</span>
            <span className="title-viz">Visualizer</span>
          </h1>
          <p>Master algorithms through interactive, animated visualizations</p>
          <div className="hub-stats">
            <div className="hub-stat">
              <span className="stat-number">8</span>
              <span className="stat-label">Visualizers</span>
            </div>
            <div className="hub-stat">
              <span className="stat-number">15+</span>
              <span className="stat-label">Algorithms</span>
            </div>
            <div className="hub-stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Learning</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Visualizer Cards */}
      <motion.div 
        className="visualizers-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {visualizers.map((visualizer) => {
          const IconComponent = visualizer.icon;
          return (
            <motion.div
              key={visualizer.id}
              className={`visualizer-card ${hoveredCard === visualizer.id ? "hovered" : ""}`}
              variants={cardVariants}
              onMouseEnter={() => setHoveredCard(visualizer.id)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              {/* Card Glow Effect */}
              <div 
                className="card-glow" 
                style={{ background: `radial-gradient(circle, ${visualizer.color}30 0%, transparent 70%)` }}
              />
              
              {/* Icon Section */}
              <div 
                className="card-icon-section"
                style={{ background: `${visualizer.color}15` }}
              >
                <IconComponent 
                  size={50} 
                  style={{ color: visualizer.color }}
                  className="card-icon"
                />
              </div>

              {/* Content */}
              <div className="card-content">
                <div className="card-header">
                  <h3>{visualizer.name}</h3>
                  <span className={`badge ${visualizer.difficulty.toLowerCase()}`}>
                    {visualizer.difficulty}
                  </span>
                </div>
                
                <p className="card-description">{visualizer.description}</p>
                
                <div className="card-features">
                  {visualizer.features.map((feature, i) => (
                    <span 
                      key={i} 
                      className="feature-tag" 
                      style={{ borderColor: `${visualizer.color}50`, color: visualizer.color }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="card-footer">
                  <span 
                    className="category-tag"
                    style={{ 
                      background: `${visualizer.color}20`,
                      color: visualizer.color,
                      borderColor: `${visualizer.color}40`
                    }}
                  >
                    {visualizer.category}
                  </span>
                  <button
                    className="play-button cursor-target"
                    onClick={() => handlePlayVisualizer(visualizer.id)}
                    style={{ background: `linear-gradient(135deg, ${visualizer.color} 0%, ${visualizer.color}cc 100%)` }}
                  >
                    <FaPlay /> Explore
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AlgorithmVisualizerHub;
