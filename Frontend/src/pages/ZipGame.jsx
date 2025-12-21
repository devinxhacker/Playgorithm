import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrophy, FaClock, FaUndo, FaCheckCircle } from "react-icons/fa";
import { GiSwordman } from "react-icons/gi";
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import "./ZipGame.css";

// Pre-defined puzzle set (10 different puzzles)
// null = empty cell (obstacle), numbers = cells to connect
const PUZZLE_SET = [
  {
    grid: [
      [1, null, null, null, null, 10, 11],
      [2, null, 8, 9, null, null, 12],
      [3, null, 7, null, null, null, 13],
      [4, null, 6, null, 17, 16, 14],
      [5, null, null, null, 18, null, 15],
      [null, null, 22, 21, 19, null, null],
      [null, null, 23, 20, null, null, null]
    ],
    size: 7,
    maxNumber: 23
  },
  {
    grid: [
      [null, 1, 2, 3, null, null, null],
      [null, null, null, 4, 5, null, null],
      [null, 12, 11, null, 6, null, null],
      [null, 13, 10, 9, 7, null, null],
      [null, 14, null, 8, null, null, null],
      [null, 15, 16, 17, 18, 19, null],
      [null, null, null, null, null, 20, null]
    ],
    size: 7,
    maxNumber: 20
  },
  {
    grid: [
      [1, 2, null, null, 14, 15, 16],
      [null, 3, null, 13, null, null, 17],
      [null, 4, 12, null, null, null, 18],
      [null, 5, 11, null, 22, 21, 19],
      [null, 6, 10, null, 23, null, 20],
      [null, 7, 9, null, 24, null, null],
      [null, null, 8, null, 25, null, null]
    ],
    size: 7,
    maxNumber: 25
  },
  {
    grid: [
      [null, null, 1, 2, 3, null, null],
      [null, null, null, null, 4, null, null],
      [null, 10, 9, 8, 5, null, null],
      [null, 11, null, 7, 6, null, null],
      [null, 12, null, null, null, null, null],
      [null, 13, 14, 15, 16, 17, null],
      [null, null, null, null, null, 18, null]
    ],
    size: 7,
    maxNumber: 18
  },
  {
    grid: [
      [1, null, null, null, null, null, 19],
      [2, 3, 4, null, 17, 18, 20],
      [null, null, 5, null, 16, null, 21],
      [null, 8, 6, null, 15, null, 22],
      [null, 9, 7, null, 14, null, 23],
      [null, 10, null, 13, null, null, 24],
      [null, 11, 12, null, null, null, 25]
    ],
    size: 7,
    maxNumber: 25
  },
  {
    grid: [
      [null, null, null, 1, 2, null, null, null],
      [null, 8, 7, null, 3, null, 18, null],
      [null, 9, 6, 5, 4, null, 17, null],
      [null, 10, null, null, null, 16, null, null],
      [null, 11, null, 22, 21, null, null, null],
      [null, 12, null, 23, 20, 19, null, null],
      [null, 13, null, 24, null, null, null, null],
      [null, 14, 15, null, null, null, null, null]
    ],
    size: 8,
    maxNumber: 24
  },
  {
    grid: [
      [1, 2, 3, null, null, null, null, null],
      [null, null, 4, null, 14, 15, 16, null],
      [null, 7, 5, null, 13, null, 17, null],
      [null, 8, 6, null, 12, null, 18, null],
      [null, 9, null, 11, null, null, 19, null],
      [null, 10, null, null, null, 22, 20, null],
      [null, null, null, 26, 25, 23, 21, null],
      [null, null, null, 27, 24, null, null, null]
    ],
    size: 8,
    maxNumber: 27
  },
  {
    grid: [
      [null, 1, null, null, null, 16, 17],
      [null, 2, 3, 4, 15, null, 18],
      [null, null, null, 5, 14, null, 19],
      [null, 8, 7, 6, 13, null, 20],
      [null, 9, null, null, 12, null, 21],
      [null, 10, null, null, 11, null, 22],
      [null, null, null, null, null, null, 23]
    ],
    size: 7,
    maxNumber: 23
  },
  {
    grid: [
      [null, null, 1, 2, null, null, null, null],
      [null, 6, null, 3, null, 18, 19, null],
      [null, 7, 5, 4, null, 17, 20, null],
      [null, 8, null, null, 16, null, 21, null],
      [null, 9, null, 15, null, null, 22, null],
      [null, 10, 14, null, null, 25, 23, null],
      [null, 11, 13, null, null, 26, 24, null],
      [null, null, 12, null, null, null, null, null]
    ],
    size: 8,
    maxNumber: 26
  },
  {
    grid: [
      [1, 2, null, null, null, null, 20],
      [null, 3, 4, null, 17, 19, 21],
      [null, null, 5, null, 16, 18, 22],
      [null, 8, 6, null, 15, null, 23],
      [null, 9, 7, null, 14, null, 24],
      [null, 10, null, 13, null, null, 25],
      [null, 11, 12, null, null, null, 26]
    ],
    size: 7,
    maxNumber: 26
  }
];

const ZipGame = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [path, setPath] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxNumber, setMaxNumber] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadRandomPuzzle();
  }, []);

  useEffect(() => {
    let interval;
    if (!isComplete && currentPuzzle) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isComplete, currentPuzzle]);

  const loadRandomPuzzle = () => {
    const randomIndex = Math.floor(Math.random() * PUZZLE_SET.length);
    const puzzle = PUZZLE_SET[randomIndex];
    setCurrentPuzzle(puzzle);
    setMaxNumber(puzzle.maxNumber);
    setPath([]);
    setCurrentNumber(1);
    setIsComplete(false);
    setTimeElapsed(0);
    setIsDragging(false);
  };

  const isAdjacent = (cell1, cell2) => {
    const [r1, c1] = cell1;
    const [r2, c2] = cell2;
    const rowDiff = Math.abs(r1 - r2);
    const colDiff = Math.abs(c1 - c2);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const getNextNumberFromPath = (pathCoords, grid) => {
    if (!grid || pathCoords.length === 0) return 1;
    let expected = 1;
    for (const [row, col] of pathCoords) {
      const value = grid[row][col];
      if (value !== null && value === expected) {
        expected += 1;
      }
    }
    return expected;
  };

  const handleMouseDown = (row, col, value) => {
    if (isComplete) return;
    
    // Can only start from cell 1
    if (value !== 1) return;
    
    setIsDragging(true);
    const startingPath = [[row, col]];
    setPath(startingPath);
    setCurrentNumber(getNextNumberFromPath(startingPath, currentPuzzle.grid));
  };

  const handleMouseEnter = (row, col, value) => {
    if (!isDragging || isComplete || path.length === 0) return;

    const existingIndex = getPathIndex(row, col);
    if (existingIndex >= 0) {
      const trimmedPath = path.slice(0, existingIndex + 1);
      setPath(trimmedPath);
      setCurrentNumber(getNextNumberFromPath(trimmedPath, currentPuzzle.grid));
      return;
    }

    // Check if it's adjacent to the last cell
    const lastCell = path[path.length - 1];
    if (!isAdjacent(lastCell, [row, col])) return;

    // Only allow numbered cells in the next expected order
    if (value !== null && value !== currentNumber) return;

    const newPath = [...path, [row, col]];
    setPath(newPath);

    const nextNum = getNextNumberFromPath(newPath, currentPuzzle.grid);
    setCurrentNumber(nextNum);

    // Check if puzzle is complete: all cells visited AND found all numbered cells in sequence
    const totalCells = currentPuzzle.size * currentPuzzle.size;
    const hasVisitedAllCells = newPath.length === totalCells;
    const hasCompletedSequence = nextNum > maxNumber;
    
    if (hasVisitedAllCells && hasCompletedSequence) {
      setIsComplete(true);
      setStreak(streak + 1);
      setIsDragging(false);
      
      // Save game completion to backend
      const xpReward = Math.min(100, 30 + (streak * 10));
      if (user) {
        gameAPI.completeGame({
          gameId: 'zip-puzzle',
          xpEarned: xpReward,
          won: true
        }).then(response => {
          if (response.data.success) {
            updateUser({ 
              ...user, 
              totalXP: response.data.totalXP,
              level: response.data.level,
              gamesPlayed: response.data.gamesPlayed,
              gamesWon: response.data.gamesWon,
              winRate: response.data.winRate
            });
          }
        }).catch(error => {
          console.error('Failed to save game progress:', error);
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetPuzzle = () => {
    setPath([]);
    setCurrentNumber(1);
    setIsComplete(false);
    setTimeElapsed(0);
    setIsDragging(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isInPath = (row, col) => {
    return path.some(([r, c]) => r === row && c === col);
  };

  const getPathIndex = (row, col) => {
    return path.findIndex(([r, c]) => r === row && c === col);
  };

  if (!currentPuzzle) {
    return <div className="zip-game loading">Loading...</div>;
  }

  return (
    <div className="zip-game">
      <div className="game-header">
        <button onClick={() => navigate("/dashboard")} className="back-button cursor-target">
          <FaArrowLeft /> Back
        </button>
        
        <div className="game-title">
          <GiSwordman className="game-icon" />
          <h1>Zip Game</h1>
        </div>

        <div className="game-stats">
          <div className="stat">
            <FaClock />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <div className="stat">
            <span className="progress-text">
              {path.length}/{currentPuzzle ? currentPuzzle.size * currentPuzzle.size : 0}
            </span>
          </div>
          <div className="stat">
            <span className="number-progress">
              Found: {currentNumber - 1}/{maxNumber}
            </span>
          </div>
          <div className="stat">
            <FaTrophy />
            <span>Streak: {streak}</span>
          </div>
        </div>

        <div className="game-controls">
          <button className="control-btn cursor-target" onClick={resetPuzzle}>
            <FaUndo /> Reset
          </button>
          <button className="control-btn cursor-target" onClick={loadRandomPuzzle}>
            New Puzzle
          </button>
        </div>
      </div>

      <div className="game-container">
        <div className="game-info">
          <h1>Zip Game</h1>
          <p>Drag from 1 to {maxNumber} while visiting ALL {currentPuzzle.size * currentPuzzle.size} cells</p>
          
          <div className="rules-box">
            <h3>How to Play:</h3>
            <ul>
              <li>Click and hold on number 1</li>
              <li>Drag through ALL cells (including empty ones)</li>
              <li>Pass through numbers 1→2→3...→N in order</li>
              <li>Move horizontally or vertically only</li>
              <li>Visit every cell to win!</li>
            </ul>
          </div>

          <div className="current-number">
            <span>Next Number:</span>
            <div className="number-display">{currentNumber}</div>
          </div>
        </div>

        <div className="board-wrapper">
          <div
            className="game-board"
            style={{
              gridTemplateColumns: `repeat(${currentPuzzle.size}, 1fr)`,
              gridTemplateRows: `repeat(${currentPuzzle.size}, 1fr)`,
            }}
          >
            {currentPuzzle.grid.map((row, rowIndex) =>
              row.map((value, colIndex) => {
                const inPath = isInPath(rowIndex, colIndex);
                const pathIdx = getPathIndex(rowIndex, colIndex);
                const isEmpty = value === null;

                return (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={`game-cell ${isEmpty ? "empty-cell" : ""} ${
                      inPath ? "in-path" : ""
                    } ${value === 1 ? "start" : ""} ${
                      value === maxNumber ? "end" : ""
                    } ${value === currentNumber && !inPath ? "next-number" : ""} cursor-target`}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex, value)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex, value)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => {}}
                    onTouchStart={() => handleMouseDown(rowIndex, colIndex, value)}
                    onTouchMove={() => handleMouseEnter(rowIndex, colIndex, value)}
                    onTouchEnd={handleMouseUp}
                    data-row={rowIndex}
                    data-col={colIndex}
                    data-value={value}
                  >
                    {!isEmpty && <span className="cell-number">{value}</span>}
                    {inPath && pathIdx >= 0 && pathIdx < path.length - 1 && (
                      <div className="path-connector" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="victory-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="victory-card"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <FaCheckCircle className="victory-icon" />
              <h2>Puzzle Solved!</h2>
              <p>You completed the puzzle in {formatTime(timeElapsed)}</p>
              <div className="victory-stats">
                <div>
                  <FaTrophy /> Streak: {streak}
                </div>
                <div>
                  <FaClock /> Time: {formatTime(timeElapsed)}
                </div>
              </div>
              <div className="victory-actions">
                <button className="cursor-target" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </button>
                <button className="cursor-target primary" onClick={loadRandomPuzzle}>
                  Next Puzzle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZipGame;
