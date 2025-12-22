import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaPlay, FaRedo, FaCog, FaMapMarkerAlt, FaBook } from "react-icons/fa";
import "./PrimeNumbersVisualizer.css";

const PrimeNumbersVisualizer = () => {
  const navigate = useNavigate();
  const [maxNumber, setMaxNumber] = useState(100);
  const [cells, setCells] = useState([]);
  const [currentPrime, setCurrentPrime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [primeCount, setPrimeCount] = useState(0);
  const [mode, setMode] = useState("sieve"); // sieve or spiral
  const abortRef = useRef(false);

  // Initialize cells
  useEffect(() => {
    initCells();
  }, [maxNumber]);

  const initCells = () => {
    const newCells = [];
    for (let i = 0; i <= maxNumber; i++) {
      newCells.push({
        value: i,
        isPrime: i >= 2,
        isEliminated: i < 2,
        isCurrent: false,
        eliminatedBy: null,
      });
    }
    setCells(newCells);
    setCurrentPrime(0);
    setPrimeCount(0);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const runSieve = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    abortRef.current = false;
    initCells();
    
    const newCells = cells.map(c => ({ ...c }));
    let count = 0;
    
    for (let p = 2; p * p <= maxNumber; p++) {
      if (abortRef.current) break;
      
      if (newCells[p].isPrime) {
        setCurrentPrime(p);
        newCells[p].isCurrent = true;
        setCells([...newCells]);
        await sleep(speed * 2);
        
        // Mark all multiples of p as not prime
        for (let multiple = p * p; multiple <= maxNumber; multiple += p) {
          if (abortRef.current) break;
          
          if (newCells[multiple].isPrime) {
            newCells[multiple].isPrime = false;
            newCells[multiple].isEliminated = true;
            newCells[multiple].eliminatedBy = p;
            setCells([...newCells]);
            await sleep(speed / 2);
          }
        }
        
        newCells[p].isCurrent = false;
      }
    }
    
    // Count primes
    count = newCells.filter(c => c.isPrime).length;
    setPrimeCount(count);
    setCurrentPrime(0);
    setIsRunning(false);
  };

  const stop = () => {
    abortRef.current = true;
    setIsRunning(false);
  };

  const getCellClass = (cell) => {
    if (cell.value < 2) return "cell zero-one";
    if (cell.isCurrent) return "cell current";
    if (cell.isPrime) return "cell prime";
    if (cell.isEliminated) return "cell eliminated";
    return "cell";
  };

  // Calculate grid columns and cell size based on max number to fit all in view
  const getGridConfig = () => {
    if (maxNumber <= 50) return { cols: 10, cellSize: 48, fontSize: 14, gap: 5 };
    if (maxNumber <= 100) return { cols: 10, cellSize: 42, fontSize: 13, gap: 4 };
    if (maxNumber <= 150) return { cols: 15, cellSize: 34, fontSize: 11, gap: 3 };
    if (maxNumber <= 200) return { cols: 16, cellSize: 30, fontSize: 10, gap: 3 };
    if (maxNumber <= 250) return { cols: 17, cellSize: 28, fontSize: 9, gap: 2 };
    return { cols: 20, cellSize: 24, fontSize: 8, gap: 2 };
  };

  const gridConfig = getGridConfig();

  return (
    <div className="prime-numbers-visualizer">
      {/* Header */}
      <div className="pn-header">
        <button onClick={() => navigate("/visualizer")} className="back-button cursor-target">
          <FaArrowLeft /> Back
        </button>
        <h1>
          <span className="gradient-text">Prime Numbers</span> Sieve
        </h1>
        <div className="pn-stats">
          {currentPrime > 0 && (
            <span className="stat-item current-prime">
              Checking: <strong>{currentPrime}</strong>
            </span>
          )}
          <span className="stat-item">
            Primes Found: <strong>{primeCount}</strong>
          </span>
        </div>
      </div>

      <div className="pn-content">
        {/* Control Panel */}
        <motion.div
          className="pn-control-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3><FaCog className="section-icon" /> Settings</h3>

          <div className="control-group">
            <label>Max Number: {maxNumber}</label>
            <input
              type="range"
              min="50"
              max="300"
              step="50"
              value={maxNumber}
              onChange={(e) => setMaxNumber(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Speed: {speed}ms</label>
            <input
              type="range"
              min="20"
              max="200"
              step="20"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="button-group">
            {!isRunning ? (
              <button
                className="action-btn visualize-btn cursor-target"
                onClick={runSieve}
              >
                <FaPlay /> Run Sieve
              </button>
            ) : (
              <button
                className="action-btn stop-btn cursor-target"
                onClick={stop}
              >
                Stop
              </button>
            )}
            <button
              className="action-btn reset-btn cursor-target"
              onClick={initCells}
              disabled={isRunning}
            >
              <FaRedo /> Reset
            </button>
          </div>

          <div className="legend">
            <h4><FaMapMarkerAlt className="section-icon" /> Legend</h4>
            <div className="legend-item">
              <span className="legend-box prime"></span> Prime Number
            </div>
            <div className="legend-item">
              <span className="legend-box current"></span> Current Check
            </div>
            <div className="legend-item">
              <span className="legend-box eliminated"></span> Eliminated
            </div>
            <div className="legend-item">
              <span className="legend-box zero-one"></span> 0 & 1 (Not Prime)
            </div>
          </div>

          <div className="algorithm-info">
            <h4><FaBook className="section-icon" /> Sieve of Eratosthenes</h4>
            <p>Ancient algorithm to find all primes up to a limit.</p>
            <ol>
              <li>Start with 2 (first prime)</li>
              <li>Mark all multiples of 2 as composite</li>
              <li>Move to next unmarked number</li>
              <li>Repeat until √n</li>
            </ol>
            <p className="complexity"><strong>Time:</strong> O(n log log n)</p>
          </div>
        </motion.div>

        {/* Grid Visualization */}
        <div className="pn-grid-container">
          <div 
            className="pn-grid"
            style={{ 
              gridTemplateColumns: `repeat(${gridConfig.cols}, ${gridConfig.cellSize}px)`,
              gap: `${gridConfig.gap}px`
            }}
          >
            <AnimatePresence>
              {cells.map((cell) => (
                <motion.div
                  key={cell.value}
                  className={getCellClass(cell)}
                  style={{
                    width: `${gridConfig.cellSize}px`,
                    height: `${gridConfig.cellSize}px`,
                    fontSize: `${gridConfig.fontSize}px`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: cell.value * 0.001 }}
                  title={cell.eliminatedBy ? `Eliminated by ${cell.eliminatedBy}` : ""}
                >
                  <span className="cell-value">{cell.value}</span>
                  {cell.eliminatedBy && maxNumber <= 150 && (
                    <span className="eliminated-by">÷{cell.eliminatedBy}</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeNumbersVisualizer;
