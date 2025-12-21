import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaPlay, FaRandom, FaRedo, FaCog, FaChartBar } from "react-icons/fa";
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  heapSort,
} from "../../lib/algorithms/sortingAlgorithms";
import "./SortingVisualizer.css";

// Helper function to generate initial array
const getInitialRects = (count) => {
  const rects = [];
  for (let i = 0; i < count; i++) {
    rects.push({
      width: Math.floor(Math.random() * 200) + 20,
      isSorted: false,
      isSorting: false,
    });
  }
  return rects;
};

// Sleep function for animation
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SortingVisualizer = () => {
  const navigate = useNavigate();
  const [rects, setRects] = useState([]);
  const [rects2, setRects2] = useState([]);
  const [count, setCount] = useState(25);
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [algo1, setAlgo1] = useState(0);
  const [algo2, setAlgo2] = useState(1);
  const [doubles, setDoubles] = useState(false);
  const [comparisons, setComparisons] = useState({ algo1: 0, algo2: 0 });

  const algorithms = [
    { name: "Bubble Sort", fn: bubbleSort, color: "#00d4ff" },
    { name: "Selection Sort", fn: selectionSort, color: "#00ff88" },
    { name: "Insertion Sort", fn: insertionSort, color: "#ff6b35" },
    { name: "Quick Sort", fn: quickSort, color: "#ff0080" },
    { name: "Merge Sort", fn: mergeSort, color: "#9c27b0" },
    { name: "Heap Sort", fn: heapSort, color: "#ffc107" },
  ];

  // Initialize arrays
  useEffect(() => {
    handleRandomize();
  }, [count]);

  const handleRandomize = useCallback(() => {
    const rect = getInitialRects(count);
    const rect2 = rect.map((r) => ({ ...r }));
    setRects(rect);
    setRects2(rect2);
    setComparisons({ algo1: 0, algo2: 0 });
  }, [count]);

  const handleRefresh = () => {
    setRects((prev) =>
      prev.map((r) => ({ ...r, isSorted: false, isSorting: false }))
    );
    setRects2((prev) =>
      prev.map((r) => ({ ...r, isSorted: false, isSorting: false }))
    );
    setComparisons({ algo1: 0, algo2: 0 });
  };

  const animateSort = async (steps, setRectsFunc, algoKey) => {
    const prevRect = algoKey === "algo1" ? [...rects] : [...rects2];
    let compCount = 0;

    for (let i = 0; i < steps.length; i++) {
      if (i !== 0) {
        prevRect[steps[i - 1].xx] = {
          ...prevRect[steps[i - 1].xx],
          isSorting: false,
        };
        prevRect[steps[i - 1].yy] = {
          ...prevRect[steps[i - 1].yy],
          isSorting: false,
        };
      }

      if (steps[i].xx === steps[i].yy) {
        prevRect[steps[i].xx] = {
          ...prevRect[steps[i].xx],
          isSorted: true,
          isSorting: false,
        };
      } else if (steps[i].changed) {
        const recti = { ...prevRect[steps[i].xx], isSorting: true };
        const rectj = { ...prevRect[steps[i].yy], isSorting: true };
        prevRect[steps[i].yy] = recti;
        prevRect[steps[i].xx] = rectj;
        compCount++;
      } else {
        prevRect[steps[i].xx] = { ...prevRect[steps[i].xx], isSorting: true };
        prevRect[steps[i].yy] = { ...prevRect[steps[i].yy], isSorting: true };
        compCount++;
      }

      setRectsFunc([...prevRect]);
      setComparisons((prev) => ({ ...prev, [algoKey]: compCount }));
      await sleep(speed);
    }
  };

  const handleSort = async () => {
    setIsRunning(true);
    setComparisons({ algo1: 0, algo2: 0 });

    const steps1 = algorithms[algo1].fn([...rects]);
    
    if (doubles) {
      const steps2 = algorithms[algo2].fn([...rects2]);
      await Promise.all([
        animateSort(steps1, setRects, "algo1"),
        animateSort(steps2, setRects2, "algo2"),
      ]);
    } else {
      await animateSort(steps1, setRects, "algo1");
    }

    setIsRunning(false);
  };

  const getBarColor = (rect, algoIndex) => {
    if (rect.isSorted) return "#00ff88";
    if (rect.isSorting) return algorithms[algoIndex].color;
    return "rgba(123, 97, 255, 0.6)";
  };

  return (
    <div className="sorting-visualizer">
      {/* Header */}
      <div className="visualizer-header">
        <button
          onClick={() => navigate("/visualizer")}
          className="back-button cursor-target"
        >
          <FaArrowLeft /> Back
        </button>
        <h1>
          <span className="gradient-text">Sorting</span> Visualizer
        </h1>
        <div className="header-stats">
          {doubles && (
            <>
              <span className="stat-badge" style={{ background: algorithms[algo1].color }}>
                {algorithms[algo1].name}: {comparisons.algo1} ops
              </span>
              <span className="stat-badge" style={{ background: algorithms[algo2].color }}>
                {algorithms[algo2].name}: {comparisons.algo2} ops
              </span>
            </>
          )}
        </div>
      </div>

      <div className="visualizer-content">
        {/* Control Panel */}
        <motion.div
          className="control-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3><FaCog className="section-icon" /> Settings</h3>

          <div className="control-group">
            <label>Array Size: {count}</label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Speed: {101 - speed}x</label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={100 - speed + 10}
              onChange={(e) => setSpeed(110 - Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Algorithm 1</label>
            <select
              value={algo1}
              onChange={(e) => setAlgo1(Number(e.target.value))}
              disabled={isRunning}
              className="select"
            >
              {algorithms.map((algo, idx) => (
                <option key={idx} value={idx}>
                  {algo.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group toggle-group">
            <label>Compare Mode</label>
            <button
              className={`toggle-btn ${doubles ? "active" : ""}`}
              onClick={() => setDoubles(!doubles)}
              disabled={isRunning}
            >
              {doubles ? "ON" : "OFF"}
            </button>
          </div>

          {doubles && (
            <motion.div
              className="control-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <label>Algorithm 2</label>
              <select
                value={algo2}
                onChange={(e) => setAlgo2(Number(e.target.value))}
                disabled={isRunning}
                className="select"
              >
                {algorithms.map((algo, idx) => (
                  <option key={idx} value={idx}>
                    {algo.name}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          <div className="button-group">
            <button
              className="action-btn randomize-btn cursor-target"
              onClick={handleRandomize}
              disabled={isRunning}
            >
              <FaRandom /> Randomize
            </button>
            <button
              className="action-btn refresh-btn cursor-target"
              onClick={handleRefresh}
              disabled={isRunning}
            >
              <FaRedo /> Reset
            </button>
            <button
              className="action-btn visualize-btn cursor-target"
              onClick={handleSort}
              disabled={isRunning}
            >
              <FaPlay /> {isRunning ? "Sorting..." : "Visualize"}
            </button>
          </div>
        </motion.div>

        {/* Visualization Area */}
        <div className="visualization-area">
          {/* First Array */}
          <motion.div
            className="array-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="array-label">
              <span
                className="algo-indicator"
                style={{ background: algorithms[algo1].color }}
              />
              {algorithms[algo1].name}
              {!doubles && (
                <span className="comparisons">
                  Operations: {comparisons.algo1}
                </span>
              )}
            </div>
            <div className="bars-container">
              <AnimatePresence>
                {rects.map((rect, idx) => (
                  <motion.div
                    key={idx}
                    className="bar"
                    style={{
                      height: `${rect.width}px`,
                      background: getBarColor(rect, algo1),
                      width: `${Math.max(100 / count - 1, 2)}%`,
                    }}
                    layout
                    transition={{ duration: speed / 1000 }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Second Array (Compare Mode) */}
          {doubles && (
            <motion.div
              className="array-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="array-label">
                <span
                  className="algo-indicator"
                  style={{ background: algorithms[algo2].color }}
                />
                {algorithms[algo2].name}
                <span className="comparisons">
                  Operations: {comparisons.algo2}
                </span>
              </div>
              <div className="bars-container">
                <AnimatePresence>
                  {rects2.map((rect, idx) => (
                    <motion.div
                      key={idx}
                      className="bar"
                      style={{
                        height: `${rect.width}px`,
                        background: getBarColor(rect, algo2),
                        width: `${Math.max(100 / count - 1, 2)}%`,
                      }}
                      layout
                      transition={{ duration: speed / 1000 }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="algo-info-panel">
        <h4><FaChartBar className="section-icon" /> Algorithm Info</h4>
        <div className="info-cards">
          <div className="info-card">
            <h5>{algorithms[algo1].name}</h5>
            <p>
              {algo1 === 0 && "O(n²) - Compares adjacent elements and swaps them"}
              {algo1 === 1 && "O(n²) - Finds minimum element and places at beginning"}
              {algo1 === 2 && "O(n²) - Builds sorted array one element at a time"}
              {algo1 === 3 && "O(n log n) avg - Divide and conquer with pivot"}
              {algo1 === 4 && "O(n log n) - Divide, sort, and merge subarrays"}
              {algo1 === 5 && "O(n log n) - Uses binary heap data structure"}
            </p>
          </div>
          {doubles && (
            <div className="info-card">
              <h5>{algorithms[algo2].name}</h5>
              <p>
                {algo2 === 0 && "O(n²) - Compares adjacent elements and swaps them"}
                {algo2 === 1 && "O(n²) - Finds minimum element and places at beginning"}
                {algo2 === 2 && "O(n²) - Builds sorted array one element at a time"}
                {algo2 === 3 && "O(n log n) avg - Divide and conquer with pivot"}
                {algo2 === 4 && "O(n log n) - Divide, sort, and merge subarrays"}
                {algo2 === 5 && "O(n log n) - Uses binary heap data structure"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
