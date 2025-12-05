import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import "./AlgorithmVisualizerHub.css";

const AlgorithmVisualizerHub = () => {
  const navigate = useNavigate();

  const visualizers = [
    {
      id: "sorting",
      name: "Sorting Algorithms",
      description: "Visualize bubble sort, merge sort, quick sort, and more sorting algorithms in action",
      difficulty: "EASY",
      category: "SORTING",
    },
    {
      id: "recursive-sorting",
      name: "Recursive Sorting",
      description: "Watch recursive sorting algorithms like merge sort and quick sort break down problems",
      difficulty: "MEDIUM",
      category: "SORTING",
    },
    {
      id: "pathfinder",
      name: "Pathfinding Algorithms",
      description: "Explore A*, Dijkstra, BFS, DFS and other pathfinding algorithms on a grid",
      difficulty: "MEDIUM",
      category: "GRAPH",
    },
    {
      id: "binary-search",
      name: "Binary Search",
      description: "Interactive binary search visualization with step-by-step execution",
      difficulty: "EASY",
      category: "SEARCHING",
    },
    {
      id: "n-queen",
      name: "N-Queens Problem",
      description: "Solve the classic N-Queens problem with backtracking visualization",
      difficulty: "HARD",
      category: "BACKTRACKING",
    },
    {
      id: "recursion-tree",
      name: "Recursion Tree",
      description: "Visualize recursion trees for Fibonacci, factorial, and binary search trees",
      difficulty: "MEDIUM",
      category: "RECURSION",
    },
    {
      id: "prime-numbers",
      name: "Prime Numbers",
      description: "Visualize prime number patterns with the Sieve of Eratosthenes",
      difficulty: "EASY",
      category: "MATHEMATICS",
    },
    {
      id: "15-puzzle",
      name: "15-Puzzle Solver",
      description: "Watch AI solve the classic 15-puzzle using A* search algorithm",
      difficulty: "MEDIUM",
      category: "PUZZLE",
    },
  ];

  const handlePlayVisualizer = (visualizerId) => {
    navigate(`/visualizer/${visualizerId}`);
  };

  return (
    <div className="visualizer-hub">
      <div className="hub-header">
        <button onClick={() => navigate("/dashboard")} className="back-button cursor-target">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="hub-title-section">
          <h1>Algorithm Visualizer</h1>
          <p>Explore and understand algorithms through interactive visualizations</p>
        </div>
      </div>

      <div className="visualizers-grid">
        {visualizers.map((visualizer) => (
          <motion.div
            key={visualizer.id}
            className="visualizer-card cursor-target"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
          >
            <div className="visualizer-card-header">
              <h3>{visualizer.name}</h3>
              <span className={`badge ${visualizer.difficulty.toLowerCase()}`}>
                {visualizer.difficulty}
              </span>
            </div>
            <p className="visualizer-description">{visualizer.description}</p>
            <div className="visualizer-category">
              <span className="category-tag">{visualizer.category}</span>
            </div>
            <button
              className="play-button cursor-target"
              onClick={() => handlePlayVisualizer(visualizer.id)}
            >
              <FaPlay /> Visualize
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmVisualizerHub;
