import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaPlay, FaRandom, FaCog, FaMapMarkerAlt, FaChartLine, FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./BinarySearchVisualizer.css";

const BinarySearchVisualizer = () => {
  const navigate = useNavigate();
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState(null);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const [message, setMessage] = useState("Click 'Search' to begin binary search");
  const [arraySize, setArraySize] = useState(15);
  const [customTarget, setCustomTarget] = useState("");

  // Generate sorted array
  const generateArray = () => {
    const arr = [];
    let current = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < arraySize; i++) {
      arr.push(current);
      current += Math.floor(Math.random() * 10) + 1;
    }
    setArray(arr);
    const randomTarget = arr[Math.floor(Math.random() * arr.length)];
    setTarget(randomTarget);
    setCustomTarget(randomTarget.toString());
    resetSearch();
  };

  const resetSearch = () => {
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFound(null);
    setComparisons(0);
    setIsSearching(false);
    setMessage("Click 'Search' to begin binary search");
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const binarySearch = async () => {
    if (isSearching) return;
    
    const searchTarget = parseInt(customTarget);
    if (isNaN(searchTarget)) {
      setMessage("Please enter a valid number");
      return;
    }
    
    setTarget(searchTarget);
    setIsSearching(true);
    setFound(null);
    setComparisons(0);
    
    let l = 0;
    let r = array.length - 1;
    let count = 0;

    setLeft(l);
    setRight(r);
    setMessage(`Searching for ${searchTarget}...`);
    await sleep(speed);

    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      setMid(m);
      count++;
      setComparisons(count);
      
      setMessage(`Comparing: array[${m}] = ${array[m]} with target ${searchTarget}`);
      await sleep(speed);

      if (array[m] === searchTarget) {
        setFound(m);
        setMessage(`Found ${searchTarget} at index ${m}! (${count} comparisons)`);
        setIsSearching(false);
        return;
      } else if (array[m] < searchTarget) {
        setMessage(`${array[m]} < ${searchTarget}, searching right half`);
        l = m + 1;
        setLeft(l);
      } else {
        setMessage(`${array[m]} > ${searchTarget}, searching left half`);
        r = m - 1;
        setRight(r);
      }
      
      await sleep(speed / 2);
    }

    setFound(-1);
    setMessage(`${searchTarget} not found in the array (${count} comparisons)`);
    setIsSearching(false);
  };

  const getElementClass = (index) => {
    if (found === index) return "element found";
    if (found === -1 && !isSearching) return "element not-found";
    if (index === mid) return "element mid";
    if (index >= left && index <= right && left !== -1) return "element in-range";
    if (left !== -1) return "element out-range";
    return "element";
  };

  return (
    <div className="binary-search-visualizer">
      {/* Header */}
      <div className="bs-header">
        <button onClick={() => navigate("/visualizer")} className="back-button cursor-target">
          <FaArrowLeft /> Back
        </button>
        <h1>
          <span className="gradient-text">Binary Search</span> Visualizer
        </h1>
        <div className="bs-stats">
          <span className="stat-item">Target: <strong>{target}</strong></span>
          <span className="stat-item">Comparisons: <strong>{comparisons}</strong></span>
        </div>
      </div>

      <div className="bs-content">
        {/* Control Panel */}
        <motion.div
          className="bs-control-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3><FaCog className="section-icon" /> Settings</h3>

          <div className="control-group">
            <label>Array Size: {arraySize}</label>
            <input
              type="range"
              min="5"
              max="25"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isSearching}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Speed: {speed}ms</label>
            <input
              type="range"
              min="100"
              max="1500"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isSearching}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Target Value</label>
            <input
              type="number"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              disabled={isSearching}
              className="target-input"
              placeholder="Enter target..."
            />
          </div>

          <div className="button-group">
            <button
              className="action-btn randomize-btn cursor-target"
              onClick={generateArray}
              disabled={isSearching}
            >
              <FaRandom /> New Array
            </button>
            <button
              className="action-btn search-btn cursor-target"
              onClick={binarySearch}
              disabled={isSearching}
            >
              <FaPlay /> {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="legend">
            <h4><FaMapMarkerAlt className="section-icon" /> Legend</h4>
            <div className="legend-item">
              <span className="legend-box search-range"></span> Search Range
            </div>
            <div className="legend-item">
              <span className="legend-box mid-point"></span> Mid Point
            </div>
            <div className="legend-item">
              <span className="legend-box found-item"></span> Found
            </div>
            <div className="legend-item">
              <span className="legend-box eliminated"></span> Eliminated
            </div>
          </div>

          <div className="complexity-info">
            <h4><FaChartLine className="section-icon" /> Complexity</h4>
            <p><strong>Time:</strong> O(log n)</p>
            <p><strong>Space:</strong> O(1)</p>
            <p><strong>Max Steps:</strong> ⌈log₂({arraySize})⌉ = {Math.ceil(Math.log2(arraySize))}</p>
          </div>
        </motion.div>

        {/* Visualization Area */}
        <div className="bs-visualization">
          <div className="message-box">
            <p>{message}</p>
          </div>

          <div className="array-container">
            <div className="index-row">
              {array.map((_, index) => (
                <div key={`idx-${index}`} className="index-label">
                  {index}
                </div>
              ))}
            </div>
            
            <div className="elements-row">
              <AnimatePresence>
                {array.map((value, index) => (
                  <motion.div
                    key={index}
                    className={getElementClass(index)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {value}
                    {index === left && left !== -1 && (
                      <span className="pointer left-pointer">L</span>
                    )}
                    {index === right && right !== -1 && (
                      <span className="pointer right-pointer">R</span>
                    )}
                    {index === mid && mid !== -1 && (
                      <span className="pointer mid-pointer">M</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="algorithm-explanation">
            <h4><FaSearch className="section-icon" /> How Binary Search Works</h4>
            <ol>
              <li>Start with the entire sorted array</li>
              <li>Find the middle element</li>
              <li>If middle = target, we're done!</li>
              <li>If middle &lt; target, search right half</li>
              <li>If middle &gt; target, search left half</li>
              <li>Repeat until found or range is empty</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;
