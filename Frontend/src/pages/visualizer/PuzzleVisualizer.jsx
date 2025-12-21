import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaPlay, FaRandom, FaUndo, FaSlidersH, FaRobot, FaBookOpen, FaTrophy } from "react-icons/fa";
import "./PuzzleVisualizer.css";

// Solved state
const SOLVED_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

// Check if puzzle is solvable
const isSolvable = (tiles) => {
  let inversions = 0;
  const flatTiles = tiles.filter(t => t !== 0);
  
  for (let i = 0; i < flatTiles.length; i++) {
    for (let j = i + 1; j < flatTiles.length; j++) {
      if (flatTiles[i] > flatTiles[j]) inversions++;
    }
  }
  
  const emptyRow = Math.floor(tiles.indexOf(0) / 4);
  // For 4x4: solvable if (inversions + row of blank from bottom) is odd
  return (inversions + (3 - emptyRow)) % 2 === 1;
};

// Generate a random solvable puzzle
const generatePuzzle = () => {
  let tiles;
  do {
    tiles = [...SOLVED_STATE].sort(() => Math.random() - 0.5);
  } while (!isSolvable(tiles) || arraysEqual(tiles, SOLVED_STATE));
  return tiles;
};

const arraysEqual = (a, b) => a.every((val, idx) => val === b[idx]);

// Get possible moves
const getValidMoves = (tiles) => {
  const emptyIndex = tiles.indexOf(0);
  const row = Math.floor(emptyIndex / 4);
  const col = emptyIndex % 4;
  const moves = [];
  
  if (row > 0) moves.push(emptyIndex - 4); // up
  if (row < 3) moves.push(emptyIndex + 4); // down
  if (col > 0) moves.push(emptyIndex - 1); // left
  if (col < 3) moves.push(emptyIndex + 1); // right
  
  return moves;
};

// Manhattan distance heuristic
const manhattanDistance = (tiles) => {
  let distance = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] !== 0) {
      const currentRow = Math.floor(i / 4);
      const currentCol = i % 4;
      const targetRow = Math.floor((tiles[i] - 1) / 4);
      const targetCol = (tiles[i] - 1) % 4;
      distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
    }
  }
  return distance;
};

// A* Solver
const solvePuzzle = (initialTiles) => {
  const startState = [...initialTiles];
  const goalState = SOLVED_STATE;
  
  if (arraysEqual(startState, goalState)) return [];
  
  const openSet = [{ tiles: startState, g: 0, h: manhattanDistance(startState), path: [] }];
  const closedSet = new Set();
  
  while (openSet.length > 0) {
    // Sort by f = g + h
    openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));
    const current = openSet.shift();
    
    const stateKey = current.tiles.join(',');
    if (closedSet.has(stateKey)) continue;
    closedSet.add(stateKey);
    
    if (arraysEqual(current.tiles, goalState)) {
      return current.path;
    }
    
    // Limit search to prevent browser freeze
    if (closedSet.size > 100000) {
      console.log("Search limit reached");
      return null;
    }
    
    const emptyIndex = current.tiles.indexOf(0);
    const validMoves = getValidMoves(current.tiles);
    
    for (const moveIndex of validMoves) {
      const newTiles = [...current.tiles];
      [newTiles[emptyIndex], newTiles[moveIndex]] = [newTiles[moveIndex], newTiles[emptyIndex]];
      
      const newStateKey = newTiles.join(',');
      if (!closedSet.has(newStateKey)) {
        openSet.push({
          tiles: newTiles,
          g: current.g + 1,
          h: manhattanDistance(newTiles),
          path: [...current.path, moveIndex],
        });
      }
    }
  }
  
  return null; // No solution found
};

const PuzzleVisualizer = () => {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState(SOLVED_STATE);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [speed, setSpeed] = useState(300);
  const [isSolved, setIsSolved] = useState(true);
  const [message, setMessage] = useState("Click 'Shuffle' to start a new puzzle");
  const abortRef = useRef(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const shuffle = () => {
    const newTiles = generatePuzzle();
    setTiles(newTiles);
    setMoveCount(0);
    setIsSolved(false);
    setMessage("Click on a tile adjacent to the empty space to move it, or click 'Solve' to watch the AI");
  };

  const handleTileClick = (index) => {
    if (isRunning || isSolved) return;
    
    const emptyIndex = tiles.indexOf(0);
    const validMoves = getValidMoves(tiles);
    
    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoveCount(prev => prev + 1);
      
      if (arraysEqual(newTiles, SOLVED_STATE)) {
        setIsSolved(true);
        setMessage(`Congratulations! Solved in ${moveCount + 1} moves!`);
      }
    }
  };

  const solve = async () => {
    if (isRunning || isSolved) return;
    
    setIsRunning(true);
    setIsSolving(true);
    setMessage("AI is solving the puzzle using A* algorithm...");
    abortRef.current = false;
    
    // Run solver in a timeout to not block UI
    await sleep(100);
    
    const solution = solvePuzzle(tiles);
    
    if (!solution) {
      setMessage("Could not find solution (puzzle too complex)");
      setIsRunning(false);
      setIsSolving(false);
      return;
    }
    
    setMessage(`Found solution in ${solution.length} moves! Animating...`);
    
    let currentTiles = [...tiles];
    
    for (let i = 0; i < solution.length; i++) {
      if (abortRef.current) break;
      
      const moveIndex = solution[i];
      const emptyIndex = currentTiles.indexOf(0);
      
      [currentTiles[emptyIndex], currentTiles[moveIndex]] = [currentTiles[moveIndex], currentTiles[emptyIndex]];
      setTiles([...currentTiles]);
      setMoveCount(i + 1);
      
      await sleep(speed);
    }
    
    if (!abortRef.current) {
      setIsSolved(true);
      setMessage(`Puzzle solved in ${solution.length} moves!`);
    }
    
    setIsRunning(false);
    setIsSolving(false);
  };

  const reset = () => {
    abortRef.current = true;
    setTiles(SOLVED_STATE);
    setMoveCount(0);
    setIsSolved(true);
    setIsRunning(false);
    setIsSolving(false);
    setMessage("Click 'Shuffle' to start a new puzzle");
  };

  const getTileClass = (value, index) => {
    if (value === 0) return "tile empty";
    
    // Check if tile is in correct position
    const isCorrect = value === index + 1;
    return `tile ${isCorrect ? "correct" : ""} ${value % 2 === 0 ? "even" : "odd"}`;
  };

  const isMovable = (index) => {
    if (isRunning || isSolved) return false;
    const validMoves = getValidMoves(tiles);
    return validMoves.includes(index);
  };

  return (
    <div className="puzzle-visualizer">
      {/* Header */}
      <div className="pz-header">
        <button onClick={() => navigate("/visualizer")} className="back-button cursor-target">
          <FaArrowLeft /> Back
        </button>
        <h1>
          <span className="gradient-text">15-Puzzle</span> Solver
        </h1>
        <div className="pz-stats">
          <span className="stat-item">Moves: <strong>{moveCount}</strong></span>
        </div>
      </div>

      <div className="pz-content">
        {/* Control Panel */}
        <motion.div
          className="pz-control-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3><FaSlidersH className="section-icon" /> Controls</h3>

          <div className="control-group">
            <label>Animation Speed: {speed}ms</label>
            <input
              type="range"
              min="100"
              max="800"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="button-group">
            <button
              className="action-btn shuffle-btn cursor-target"
              onClick={shuffle}
              disabled={isRunning}
            >
              <FaRandom /> Shuffle
            </button>
            <button
              className="action-btn solve-btn cursor-target"
              onClick={solve}
              disabled={isRunning || isSolved}
            >
              <FaPlay /> {isSolving ? "Solving..." : "Solve (A*)"}
            </button>
            <button
              className="action-btn reset-btn cursor-target"
              onClick={reset}
            >
              <FaUndo /> Reset
            </button>
          </div>

          <div className="algorithm-info">
            <h4><FaRobot className="section-icon" /> A* Algorithm</h4>
            <p>Uses Manhattan Distance heuristic to find the optimal solution path.</p>
            <p className="formula">f(n) = g(n) + h(n)</p>
            <ul>
              <li>g(n) = moves so far</li>
              <li>h(n) = Manhattan distance</li>
            </ul>
          </div>

          <div className="instructions">
            <h4><FaBookOpen className="section-icon" /> How to Play</h4>
            <ol>
              <li>Click 'Shuffle' to scramble</li>
              <li>Click tiles to move them</li>
              <li>Arrange 1-15 in order</li>
              <li>Or click 'Solve' to watch AI</li>
            </ol>
          </div>
        </motion.div>

        {/* Puzzle Board */}
        <div className="pz-board-container">
          <div className="message-box">
            <p>{message}</p>
          </div>

          <motion.div
            className="puzzle-board"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <AnimatePresence mode="popLayout">
              {tiles.map((value, index) => (
                <motion.div
                  key={value}
                  layout
                  className={`${getTileClass(value, index)} ${isMovable(index) ? "movable" : ""}`}
                  onClick={() => handleTileClick(index)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    layout: { duration: 0.2 }
                  }}
                >
                  {value !== 0 && value}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {isSolved && tiles !== SOLVED_STATE && (
            <motion.div 
              className="solved-overlay"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FaTrophy className="trophy-icon" /> Solved!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleVisualizer;
