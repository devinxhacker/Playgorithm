import { useParams, useNavigate } from "react-router-dom";
import SortingVisualizer from "./visualizer/SortingVisualizer";
import PathfindingVisualizer from "./visualizer/PathfindingVisualizer";
import BinarySearchVisualizer from "./visualizer/BinarySearchVisualizer";
import NQueensVisualizer from "./visualizer/NQueensVisualizer";
import RecursionTreeVisualizer from "./visualizer/RecursionTreeVisualizer";
import PrimeNumbersVisualizer from "./visualizer/PrimeNumbersVisualizer";
import PuzzleVisualizer from "./visualizer/PuzzleVisualizer";
import RecursiveSortingVisualizer from "./visualizer/RecursiveSortingVisualizer";
import { FaArrowLeft } from "react-icons/fa";
import "./AlgorithmVisualizerFrame.css";

// Map of native visualizer components - ALL 8 visualizers are now native!
const nativeVisualizers = {
  "sorting": SortingVisualizer,
  "pathfinder": PathfindingVisualizer,
  "binary-search": BinarySearchVisualizer,
  "n-queen": NQueensVisualizer,
  "recursion-tree": RecursionTreeVisualizer,
  "prime-numbers": PrimeNumbersVisualizer,
  "15-puzzle": PuzzleVisualizer,
  "recursive-sorting": RecursiveSortingVisualizer,
};

// No more iframe visualizers needed - all are native now!
const iframeVisualizers = {};

const VisualizerRouter = () => {
  const { visualizerId } = useParams();
  const navigate = useNavigate();

  // Check if it's a native visualizer
  const NativeComponent = nativeVisualizers[visualizerId];
  
  if (NativeComponent) {
    return <NativeComponent />;
  }

  // Fall back to iframe for non-native visualizers
  const iframeInfo = iframeVisualizers[visualizerId];
  
  if (!iframeInfo) {
    return (
      <div className="visualizer-not-found">
        <h1>Visualizer not found</h1>
        <button onClick={() => navigate("/visualizer")} className="back-button">
          <FaArrowLeft /> Back to Visualizers
        </button>
      </div>
    );
  }

  const visualizerUrl = `${import.meta.env.VITE_VISUALIZER_BASE_URL}${iframeInfo.path}`;

  return (
    <div className="visualizer-frame-container">
      <div className="frame-header">
        <button 
          onClick={() => navigate("/visualizer")} 
          className="back-button cursor-target"
        >
          <FaArrowLeft /> Back to Visualizers
        </button>
        <h1 className="visualizer-title">{iframeInfo.name}</h1>
      </div>
      <iframe
        src={visualizerUrl}
        className="visualizer-iframe"
        title={iframeInfo.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default VisualizerRouter;
