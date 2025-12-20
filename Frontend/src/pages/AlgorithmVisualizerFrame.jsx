import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./AlgorithmVisualizerFrame.css";

const AlgorithmVisualizerFrame = () => {
  const { visualizerId } = useParams();
  const navigate = useNavigate();

  // Disable the main Playgorithm cursor on this page to avoid conflict with iframe cursor
  useEffect(() => {
    // Hide the main TargetCursor wrapper
    const mainCursor = document.querySelector('.target-cursor-wrapper');
    if (mainCursor) {
      mainCursor.style.display = 'none';
    }

    // Restore default cursor
    document.body.style.cursor = 'auto';

    // Cleanup: restore cursor when leaving this page
    return () => {
      if (mainCursor) {
        mainCursor.style.display = '';
      }
      document.body.style.cursor = '';
    };
  }, []);

  // Map visualizer IDs to their paths and display names
  const visualizerInfo = {
    "sorting": { path: "/sorting", name: "Sorting Algorithms" },
    "recursive-sorting": { path: "/recursive-sorting", name: "Recursive Sorting" },
    "pathfinder": { path: "/pathfinder", name: "Pathfinding Algorithms" },
    "binary-search": { path: "/binary-search", name: "Binary Search" },
    "n-queen": { path: "/n-queen", name: "N-Queens Problem" },
    "recursion-tree": { path: "/recursion-tree", name: "Recursion Tree" },
    "prime-numbers": { path: "/prime-numbers", name: "Prime Numbers" },
    "15-puzzle": { path: "/15-puzzle", name: "15-Puzzle Solver" },
  };

  const currentVisualizer = visualizerInfo[visualizerId] || { path: "", name: "Algorithm Visualizer" };
  // AlgorithmVisualizer runs on port 3001 (configured in next.config.mjs)
  const visualizerUrl = `${import.meta.env.VITE_VISUALIZER_BASE_URL}${currentVisualizer.path}`;

  return (
    <div className="visualizer-frame-container">
      <div className="frame-header">
        <button 
          onClick={() => navigate("/visualizer")} 
          className="back-button cursor-target"
        >
          <FaArrowLeft /> Back to Visualizers
        </button>
        <h1 className="visualizer-title">{currentVisualizer.name}</h1>
      </div>
      <iframe
        src={visualizerUrl}
        className="visualizer-iframe"
        title={currentVisualizer.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default AlgorithmVisualizerFrame;
