import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlay, FaChessQueen, FaPause, FaCog, FaList, FaBrain } from "react-icons/fa";
import "./NQueensVisualizer.css";

const NQueensVisualizer = () => {
  const navigate = useNavigate();
  const [n, setN] = useState(8);
  const [board, setBoard] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [solutions, setSolutions] = useState([]);
  const [currentSolution, setCurrentSolution] = useState(0);
  const [steps, setSteps] = useState(0);
  const [mode, setMode] = useState("visualize"); // visualize or browse
  const abortRef = useRef(false);

  // Initialize board
  useEffect(() => {
    initBoard();
  }, [n]);

  const initBoard = () => {
    const newBoard = Array(n).fill(null).map(() => Array(n).fill(0));
    setBoard(newBoard);
    setSolutions([]);
    setCurrentSolution(0);
    setSteps(0);
    setMode("visualize");
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const isSafe = (board, row, col) => {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }
    // Check upper left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }
    // Check upper right diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 1) return false;
    }
    return true;
  };

  const solveNQueens = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    abortRef.current = false;
    initBoard();
    
    const foundSolutions = [];
    const newBoard = Array(n).fill(null).map(() => Array(n).fill(0));
    
    const solve = async (row) => {
      if (abortRef.current) return false;
      
      if (row === n) {
        // Found a solution
        foundSolutions.push(newBoard.map(r => [...r]));
        setSolutions([...foundSolutions]);
        return false; // Continue to find more solutions
      }
      
      for (let col = 0; col < n; col++) {
        if (abortRef.current) return false;
        
        setSteps(prev => prev + 1);
        
        // Try placing queen
        newBoard[row][col] = 2; // 2 = trying
        setBoard(newBoard.map(r => [...r]));
        await sleep(speed);
        
        if (isSafe(newBoard, row, col)) {
          newBoard[row][col] = 1; // 1 = queen placed
          setBoard(newBoard.map(r => [...r]));
          await sleep(speed);
          
          await solve(row + 1);
          
          // Backtrack
          if (row < n - 1 || foundSolutions.length === 0) {
            newBoard[row][col] = 0;
            setBoard(newBoard.map(r => [...r]));
          }
        } else {
          newBoard[row][col] = 0;
          setBoard(newBoard.map(r => [...r]));
        }
      }
      
      return false;
    };
    
    await solve(0);
    
    if (foundSolutions.length > 0) {
      setBoard(foundSolutions[0]);
      setMode("browse");
    }
    
    setIsRunning(false);
  };

  const stopSolving = () => {
    abortRef.current = true;
    setIsRunning(false);
  };

  const showSolution = (index) => {
    if (solutions.length > 0 && index >= 0 && index < solutions.length) {
      setCurrentSolution(index);
      setBoard(solutions[index]);
    }
  };

  const getCellClass = (value, row, col) => {
    const isLight = (row + col) % 2 === 0;
    let className = `cell ${isLight ? "light" : "dark"}`;
    
    if (value === 1) className += " queen";
    if (value === 2) className += " trying";
    
    return className;
  };

  return (
    <div className="nqueens-visualizer">
      {/* Header */}
      <div className="nq-header">
        <button onClick={() => navigate("/visualizer")} className="back-button cursor-target">
          <FaArrowLeft /> Back
        </button>
        <h1>
          <span className="gradient-text">N-Queens</span> Visualizer
        </h1>
        <div className="nq-stats">
          <span className="stat-item">Board: <strong>{n}×{n}</strong></span>
          <span className="stat-item">Steps: <strong>{steps}</strong></span>
          <span className="stat-item">Solutions: <strong>{solutions.length}</strong></span>
        </div>
      </div>

      <div className="nq-content">
        {/* Control Panel */}
        <motion.div
          className="nq-control-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3><FaCog className="section-icon" /> Settings</h3>

          <div className="control-group">
            <label>Board Size (N): {n}</label>
            <input
              type="range"
              min="4"
              max="12"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Speed: {speed}ms</label>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="button-group">
            {!isRunning ? (
              <button
                className="action-btn solve-btn cursor-target"
                onClick={solveNQueens}
              >
                <FaPlay /> Solve
              </button>
            ) : (
              <button
                className="action-btn stop-btn cursor-target"
                onClick={stopSolving}
              >
                <FaPause /> Stop
              </button>
            )}
            <button
              className="action-btn reset-btn cursor-target"
              onClick={initBoard}
              disabled={isRunning}
            >
              Reset Board
            </button>
          </div>

          {mode === "browse" && solutions.length > 0 && (
            <div className="solution-browser">
              <h4><FaList className="section-icon" /> Browse Solutions</h4>
              <div className="solution-nav">
                <button
                  onClick={() => showSolution(currentSolution - 1)}
                  disabled={currentSolution === 0}
                  className="nav-btn cursor-target"
                >
                  ←
                </button>
                <span className="solution-counter">
                  {currentSolution + 1} / {solutions.length}
                </span>
                <button
                  onClick={() => showSolution(currentSolution + 1)}
                  disabled={currentSolution === solutions.length - 1}
                  className="nav-btn cursor-target"
                >
                  →
                </button>
              </div>
            </div>
          )}

          <div className="algorithm-info">
            <h4><FaBrain className="section-icon" /> Backtracking</h4>
            <p>Place queens row by row. If a placement is invalid, backtrack and try the next column.</p>
            <p className="complexity"><strong>Time:</strong> O(N!)</p>
          </div>
        </motion.div>

        {/* Chessboard */}
        <div className="nq-board-container">
          <motion.div
            className="chessboard"
            style={{
              gridTemplateColumns: `repeat(${n}, 1fr)`,
              gridTemplateRows: `repeat(${n}, 1fr)`,
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {board.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <motion.div
                  key={`${rowIdx}-${colIdx}`}
                  className={getCellClass(cell, rowIdx, colIdx)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (rowIdx * n + colIdx) * 0.01 }}
                >
                  {cell === 1 && (
                    <motion.div
                      className="queen-piece"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <FaChessQueen />
                    </motion.div>
                  )}
                  {cell === 2 && (
                    <motion.div
                      className="trying-indicator"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      ?
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="board-legend">
            <div className="legend-item">
              <FaChessQueen className="queen-icon" /> Queen Placed
            </div>
            <div className="legend-item">
              <span className="trying-icon">?</span> Trying Position
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NQueensVisualizer;
