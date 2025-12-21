import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlay, FaRandom, FaCog, FaMapMarkerAlt, FaChartBar } from "react-icons/fa";
import "./RecursiveSortingVisualizer.css";

const RecursiveSortingVisualizer = () => {
  const navigate = useNavigate();
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(16);
  const [algorithm, setAlgorithm] = useState("merge");
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [merging, setMerging] = useState({ left: -1, right: -1 });
  const [pivot, setPivot] = useState(-1);
  const [operations, setOperations] = useState(0);
  const abortRef = useRef(false);

  // Generate random array
  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 200) + 20,
        id: i,
      });
    }
    setArray(newArray);
    setSorted([]);
    setComparing([]);
    setMerging({ left: -1, right: -1 });
    setPivot(-1);
    setOperations(0);
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Merge Sort Implementation
  const mergeSort = async (arr, start, end) => {
    if (start >= end || abortRef.current) return arr;
    
    const mid = Math.floor((start + end) / 2);
    
    // Show division
    setMerging({ left: start, right: mid });
    await sleep(speed);
    
    await mergeSort(arr, start, mid);
    await mergeSort(arr, mid + 1, end);
    
    await merge(arr, start, mid, end);
    
    return arr;
  };

  const merge = async (arr, start, mid, end) => {
    if (abortRef.current) return;
    
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    
    let i = 0, j = 0, k = start;
    
    setMerging({ left: start, right: end });
    
    while (i < left.length && j < right.length) {
      if (abortRef.current) return;
      
      setComparing([start + i, mid + 1 + j]);
      setOperations(prev => prev + 1);
      await sleep(speed);
      
      if (left[i].value <= right[j].value) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      k++;
      setArray([...arr]);
    }
    
    while (i < left.length) {
      arr[k] = left[i];
      i++;
      k++;
      setArray([...arr]);
      await sleep(speed / 2);
    }
    
    while (j < right.length) {
      arr[k] = right[j];
      j++;
      k++;
      setArray([...arr]);
      await sleep(speed / 2);
    }
    
    // Mark as sorted when we've merged the full array
    if (start === 0 && end === arr.length - 1) {
      const sortedIndices = [];
      for (let i = start; i <= end; i++) sortedIndices.push(i);
      setSorted(sortedIndices);
    }
    
    setComparing([]);
  };

  // Quick Sort Implementation
  const quickSort = async (arr, low, high) => {
    if (low < high && !abortRef.current) {
      const pi = await partition(arr, low, high);
      
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
    
    if (low === 0 && high === arr.length - 1) {
      const sortedIndices = [];
      for (let i = 0; i < arr.length; i++) sortedIndices.push(i);
      setSorted(sortedIndices);
    }
    
    return arr;
  };

  const partition = async (arr, low, high) => {
    const pivotVal = arr[high].value;
    setPivot(high);
    setMerging({ left: low, right: high });
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (abortRef.current) return i + 1;
      
      setComparing([j, high]);
      setOperations(prev => prev + 1);
      await sleep(speed);
      
      if (arr[j].value < pivotVal) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(speed / 2);
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setSorted(prev => [...prev, i + 1]);
    
    setComparing([]);
    setPivot(-1);
    
    return i + 1;
  };

  // Heap Sort Implementation
  const heapSort = async (arr) => {
    const n = arr.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }
    
    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      if (abortRef.current) return;
      
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      setSorted(prev => [i, ...prev]);
      await sleep(speed);
      
      await heapify(arr, i, 0);
    }
    
    setSorted(Array.from({ length: n }, (_, i) => i));
  };

  const heapify = async (arr, n, i) => {
    if (abortRef.current) return;
    
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    setComparing([i, left, right].filter(x => x < n));
    setOperations(prev => prev + 1);
    await sleep(speed / 2);
    
    if (left < n && arr[left].value > arr[largest].value) {
      largest = left;
    }
    
    if (right < n && arr[right].value > arr[largest].value) {
      largest = right;
    }
    
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await sleep(speed / 2);
      
      await heapify(arr, n, largest);
    }
    
    setComparing([]);
  };

  const startSort = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    abortRef.current = false;
    setSorted([]);
    setOperations(0);
    
    const arr = [...array];
    
    switch (algorithm) {
      case "merge":
        await mergeSort(arr, 0, arr.length - 1);
        break;
      case "quick":
        await quickSort(arr, 0, arr.length - 1);
        break;
      case "heap":
        await heapSort(arr);
        break;
    }
    
    setComparing([]);
    setMerging({ left: -1, right: -1 });
    setPivot(-1);
    setIsRunning(false);
  };

  const stop = () => {
    abortRef.current = true;
    setIsRunning(false);
  };

  const getBarClass = (index) => {
    let classes = ["bar"];
    
    if (sorted.includes(index)) classes.push("sorted");
    if (comparing.includes(index)) classes.push("comparing");
    if (index === pivot) classes.push("pivot");
    if (index >= merging.left && index <= merging.right && merging.left !== -1) {
      classes.push("in-range");
    }
    
    return classes.join(" ");
  };

  const algorithms = [
    { id: "merge", name: "Merge Sort", complexity: "O(n log n)" },
    { id: "quick", name: "Quick Sort", complexity: "O(n log n) avg" },
    { id: "heap", name: "Heap Sort", complexity: "O(n log n)" },
  ];

  return (
    <div className="recursive-sorting-visualizer">
      {/* Header */}
      <div className="rs-header">
        <button onClick={() => navigate("/visualizer")} className="back-button cursor-target">
          <FaArrowLeft /> Back
        </button>
        <h1>
          <span className="gradient-text">Recursive Sorting</span> Visualizer
        </h1>
        <div className="rs-stats">
          <span className="stat-item">Operations: <strong>{operations}</strong></span>
        </div>
      </div>

      <div className="rs-content">
        {/* Control Panel */}
        <motion.div
          className="rs-control-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3><FaCog className="section-icon" /> Settings</h3>

          <div className="control-group">
            <label>Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isRunning}
              className="select"
            >
              {algorithms.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Array Size: {arraySize}</label>
            <input
              type="range"
              min="8"
              max="32"
              step="4"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Speed: {speed}ms</label>
            <input
              type="range"
              min="20"
              max="300"
              step="20"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="button-group">
            <button
              className="action-btn randomize-btn cursor-target"
              onClick={generateArray}
              disabled={isRunning}
            >
              <FaRandom /> Randomize
            </button>
            {!isRunning ? (
              <button
                className="action-btn sort-btn cursor-target"
                onClick={startSort}
              >
                <FaPlay /> Sort
              </button>
            ) : (
              <button
                className="action-btn stop-btn cursor-target"
                onClick={stop}
              >
                Stop
              </button>
            )}
          </div>

          <div className="legend">
            <h4><FaMapMarkerAlt className="section-icon" /> Legend</h4>
            <div className="legend-item">
              <span className="legend-box comparing"></span> Comparing
            </div>
            <div className="legend-item">
              <span className="legend-box in-range"></span> Current Range
            </div>
            <div className="legend-item">
              <span className="legend-box pivot"></span> Pivot (Quick Sort)
            </div>
            <div className="legend-item">
              <span className="legend-box sorted"></span> Sorted
            </div>
          </div>

          <div className="algorithm-info">
            <h4><FaChartBar className="section-icon" /> {algorithms.find(a => a.id === algorithm)?.name}</h4>
            <p><strong>Time:</strong> {algorithms.find(a => a.id === algorithm)?.complexity}</p>
            <p><strong>Space:</strong> {algorithm === "merge" ? "O(n)" : "O(log n)"}</p>
            
            {algorithm === "merge" && (
              <p className="description">Divides array in half, recursively sorts each half, then merges.</p>
            )}
            {algorithm === "quick" && (
              <p className="description">Picks a pivot, partitions around it, recursively sorts partitions.</p>
            )}
            {algorithm === "heap" && (
              <p className="description">Builds a max heap, repeatedly extracts the maximum element.</p>
            )}
          </div>
        </motion.div>

        {/* Visualization Area */}
        <div className="rs-visualization">
          <div className="bars-container">
            {array.map((item, index) => (
              <motion.div
                key={item.id}
                className={getBarClass(index)}
                style={{ height: `${item.value}px` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                {arraySize <= 20 && (
                  <span className="bar-value">{item.value}</span>
                )}
              </motion.div>
            ))}
          </div>

          <div className="range-indicator">
            {merging.left !== -1 && (
              <div 
                className="range-bar"
                style={{
                  left: `${(merging.left / array.length) * 100}%`,
                  width: `${((merging.right - merging.left + 1) / array.length) * 100}%`
                }}
              >
                Range: [{merging.left}, {merging.right}]
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecursiveSortingVisualizer;
