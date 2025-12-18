import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaCrown, 
  FaLightbulb, 
  FaUndo, 
  FaTrophy, 
  FaClock, 
  FaArrowLeft, 
  FaBook,
  FaPlay,
  FaGraduationCap,
  FaBrain,
  FaForward
} from "react-icons/fa";
import { GiSwordman } from "react-icons/gi";
import { SparklesCore } from '../components/ui/sparkles';
import warriorImage from '../assets/images/warrior-tic-tac-toe.png';
import "./QueensArena.css";

const QueensArena = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("menu");
  const [boardSize, setBoardSize] = useState(4);
  const [board, setBoard] = useState([]);
  const [queens, setQueens] = useState([]);
  const [conflicts, setConflicts] = useState(new Set());
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [validPositions, setValidPositions] = useState(new Set());
  const [learnStep, setLearnStep] = useState(0);
  const [combo, setCombo] = useState(0);
  const [difficulty, setDifficulty] = useState("beginner");

  const learnSteps = [
    {
      title: "Welcome to N-Queens Problem",
      description: "The N-Queens puzzle is a classic problem in computer science. Place N queens on an N×N chessboard so that no two queens attack each other."
    },
    {
      title: "Queen Attack Rules",
      description: "A queen can attack any piece in the same row, column, or diagonal. Understanding these attack patterns is crucial for solving the puzzle."
    },
    {
      title: "Place Your First Queen",
      description: "Click any cell to place your first queen. The top-left corner is often a good starting position for learning."
    },
    {
      title: "Avoid Conflicts",
      description: "Place the second queen where it won't be attacked. Use the hint system to see valid positions if needed."
    },
    {
      title: "Backtracking Strategy",
      description: "If you get stuck, remove queens and try different positions. This trial-and-error approach is called backtracking."
    }
  ];

  useEffect(() => {
    let interval;
    if (mode === "play") {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    initializeBoard();
  }, [boardSize]);

  const initializeBoard = () => {
    const newBoard = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(false));
    console.log('Initializing board:', boardSize, 'x', boardSize);
    setBoard(newBoard);
    setQueens([]);
    setConflicts(new Set());
    setMoves(0);
    setTimeElapsed(0);
    setCombo(0);
  };

  const startGame = (size, diff) => {
    setBoardSize(size);
    setDifficulty(diff);
    setMode("play");
    setScore(0);
    initializeBoard();
  };

  const startLearn = () => {
    setBoardSize(4);
    setMode("learn");
    setLearnStep(0);
    initializeBoard();
  };

  const isUnderAttack = (row, col, currentQueens) => {
    for (const [qRow, qCol] of currentQueens) {
      if (qRow === row || qCol === col) return true;
      if (Math.abs(qRow - row) === Math.abs(qCol - col)) return true;
    }
    return false;
  };

  const calculateValidPositions = (currentQueens) => {
    const valid = new Set();
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (!isUnderAttack(row, col, currentQueens)) {
          valid.add(`${row}-${col}`);
        }
      }
    }
    return valid;
  };

  const handleCellClick = (row, col) => {
    if (mode !== "play" && mode !== "learn") return;

    const queenIndex = queens.findIndex(([r, c]) => r === row && c === col);

    if (queenIndex !== -1) {
      const newQueens = queens.filter((_, i) => i !== queenIndex);
      setQueens(newQueens);
      updateConflicts(newQueens);
      setCombo(0);
    } else {
      if (isUnderAttack(row, col, queens)) {
        setConflicts(new Set([`${row}-${col}`]));
        setTimeout(() => setConflicts(new Set()), 500);
        setCombo(0);
        return;
      }

      const newQueens = [...queens, [row, col]];
      setQueens(newQueens);
      setMoves(moves + 1);
      updateConflicts(newQueens);
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      const comboBonus = newCombo * 10;
      setScore(score + 100 + comboBonus);

      if (newQueens.length === boardSize) {
        const timeBonus = Math.max(0, 300 - timeElapsed) * 10;
        const finalScore = score + 100 + comboBonus + timeBonus;
        setScore(finalScore);
        setMode("completed");
      }

      if (mode === "learn" && newQueens.length === learnStep + 1) {
        setTimeout(() => {
          if (learnStep < learnSteps.length - 1) {
            setLearnStep(learnStep + 1);
          }
        }, 500);
      }
    }
  };

  const updateConflicts = (currentQueens) => {
    const newConflicts = new Set();
    for (let i = 0; i < currentQueens.length; i++) {
      for (let j = i + 1; j < currentQueens.length; j++) {
        const [r1, c1] = currentQueens[i];
        const [r2, c2] = currentQueens[j];
        if (
          r1 === r2 ||
          c1 === c2 ||
          Math.abs(r1 - r2) === Math.abs(c1 - c2)
        ) {
          newConflicts.add(`${r1}-${c1}`);
          newConflicts.add(`${r2}-${c2}`);
        }
      }
    }
    setConflicts(newConflicts);
  };

  const toggleHints = () => {
    if (!showHints) {
      setValidPositions(calculateValidPositions(queens));
    }
    setShowHints(!showHints);
  };

  const resetGame = () => {
    initializeBoard();
    if (mode === "completed") {
      setMode("play");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderCell = (row, col) => {
    const hasQueen = queens.some(([r, c]) => r === row && c === col);
    const isConflict = conflicts.has(`${row}-${col}`);
    const isValid = showHints && validPositions.has(`${row}-${col}`) && !hasQueen;
    const isDark = (row + col) % 2 === 1;

    return (
      <motion.div
        key={`${row}-${col}`}
        className={`chess-cell ${isDark ? "dark" : "light"} ${
          isConflict ? "conflict" : ""
        } ${isValid ? "valid-hint" : ""} cursor-target`}
        onClick={() => handleCellClick(row, col)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {hasQueen && (
            <motion.div
              className="queen-piece"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <FaCrown />
            </motion.div>
          )}
        </AnimatePresence>
        {isValid && <div className="hint-dot" />}
      </motion.div>
    );
  };

  if (mode === "menu") {
    return (
      <div className="queens-arena" style={{ background: '#000000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          <SparklesCore
            id="queensparticlesfullpage"
            background="transparent"
            minSize={1}
            maxSize={3}
            particleDensity={150}
            particleColor="#FFFFFF"
          />
        </div>
        <div className="arena-header">
          <button onClick={() => navigate("/dashboard")} className="back-button cursor-target">
            <FaArrowLeft /> Back to Dashboard
          </button>
          <div className="arena-title">
            <GiSwordman className="arena-icon" />
            <h1>Queens Arena</h1>
          </div>
        </div>

        <div className="menu-container">
          <motion.div
            className="menu-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ position: 'relative', zIndex: 20 }}
          >
            <h2>Choose Your Path</h2>
            <p className="menu-subtitle">Master the N-Queens problem through learning or challenge yourself!</p>

            <div className="menu-layout">
              <div className="warrior-image-container">
                <img src={warriorImage} alt="Queens Warrior" className="warrior-image" />
              </div>

              <div className="mode-cards">
                <motion.div
                  className="mode-card learn-card cursor-target"
                  onClick={startLearn}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                <div className="mode-icon">
                  <FaGraduationCap />
                </div>
                <h3>Learn Mode</h3>
                <p>Understand the N-Queens algorithm, backtracking strategy, and perfect placement techniques step-by-step</p>
                <div className="mode-features">
                  <span><FaLightbulb /> Interactive Tutorial</span>
                  <span><FaBrain /> Algorithm Visualization</span>
                  <span><FaTrophy /> Strategic Insights</span>
                </div>
              </motion.div>

              <motion.div
                className="mode-card play-card cursor-target"
                onClick={() => setMode("difficulty-select")}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mode-icon">
                  <FaPlay />
                </div>
                <h3>Play Mode</h3>
                <p>Challenge yourself with different board sizes and test your strategic thinking</p>
                <div className="mode-features">
                  <span><FaCrown /> Multiple Difficulties</span>
                  <span><FaClock /> Timed Challenges</span>
                  <span><FaTrophy /> Score Tracking</span>
                </div>
              </motion.div>
              </div>
            </div>

            <motion.button
              className="learn-algorithm-btn cursor-target"
              onClick={() => setMode("algorithm-learn")}
              whileHover={{ scale: 1.05 }}
            >
              <FaBook /> Learn the Algorithm
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (mode === "difficulty-select") {
    return (
      <div className="queens-arena">
        <div className="arena-header">
          <button onClick={() => setMode("menu")} className="back-button cursor-target">
            <FaArrowLeft /> Back to Menu
          </button>
          <div className="arena-title">
            <GiSwordman className="arena-icon" />
            <h1>Select Difficulty</h1>
          </div>
        </div>

        <div className="menu-container">
          <motion.div
            className="difficulty-selection"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Choose Your Challenge</h2>
            <div className="difficulty-cards">
              <motion.div
                className="difficulty-card easy cursor-target"
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => startGame(4, "beginner")}
              >
                <div className="difficulty-icon">
                  <FaCrown />
                </div>
                <h3>Beginner</h3>
                <p>4×4 Board</p>
                <span className="xp-badge">+500 XP</span>
              </motion.div>

              <motion.div
                className="difficulty-card medium cursor-target"
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => startGame(6, "intermediate")}
              >
                <div className="difficulty-icon">
                  <FaCrown />
                  <FaCrown />
                </div>
                <h3>Intermediate</h3>
                <p>6×6 Board</p>
                <span className="xp-badge">+1000 XP</span>
              </motion.div>

              <motion.div
                className="difficulty-card hard cursor-target"
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => startGame(8, "expert")}
              >
                <div className="difficulty-icon">
                  <FaCrown />
                  <FaCrown />
                  <FaCrown />
                </div>
                <h3>Expert</h3>
                <p>8×8 Board</p>
                <span className="xp-badge">+2000 XP</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (mode === "algorithm-learn") {
    return (
      <div className="queens-arena learn-algorithm-mode">
        <div className="arena-header">
          <button className="back-button cursor-target" onClick={() => setMode("menu")}>
            <FaArrowLeft /> Back to Menu
          </button>
          <div className="arena-title">
            <FaBook className="arena-icon" />
            <h1>N-Queens Algorithm</h1>
          </div>
        </div>
        
        <div className="learn-container">
          <motion.div
            className="learn-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="learn-three-column">
              <div className="learn-section compact">
                <div>
                  <h2><FaTrophy /> The Problem</h2>
                  <p>
                    The N-Queens puzzle is a classic problem in computer science. Place N chess queens 
                    on an N×N chessboard so that no two queens threaten each other.
                  </p>
                </div>
                
                <div>
                  <h2><FaCrown /> Queen Attack Rules</h2>
                  <ul>
                    <li><strong>Horizontal:</strong> Queens attack all pieces in the same row</li>
                    <li><strong>Vertical:</strong> Queens attack all pieces in the same column</li>
                    <li><strong>Diagonal:</strong> Queens attack all pieces on both diagonals</li>
                  </ul>
                </div>

                <div>
                  <h2><FaLightbulb /> Strategy Tips</h2>
                  <ul>
                    <li><strong>Start Simple:</strong> Begin with 4×4 board</li>
                    <li><strong>Row by Row:</strong> Place one queen per row</li>
                    <li><strong>Use Hints:</strong> Enable hints for valid positions</li>
                    <li><strong>Backtrack:</strong> Remove queens if stuck</li>
                  </ul>
                </div>

                <div>
                  <h2><FaPlay /> Complexity</h2>
                  <ul>
                    <li><strong>Time:</strong> O(N!) - Try all possibilities</li>
                    <li><strong>Space:</strong> O(N²) - Board representation</li>
                    <li><strong>4×4:</strong> 2 solutions</li>
                    <li><strong>8×8:</strong> 92 solutions</li>
                  </ul>
                </div>
              </div>

              <div className="learn-section algorithm-section">
                <h2><FaBrain /> The Backtracking Algorithm</h2>
                <div className="algorithm-box">
                  <pre>{`function solveNQueens(n):
    board = empty n×n board
    return placeQueen(board, 0)

function placeQueen(board, row):
    if row == n:
        return true  // All queens placed!
    
    for col in 0 to n-1:
        if isSafe(board, row, col):
            board[row][col] = QUEEN
            if placeQueen(board, row + 1):
                return true
            board[row][col] = EMPTY  // Backtrack
    return false

function isSafe(board, row, col):
    for i in 0 to row-1:
        if board[i][col] == QUEEN:
            return false
        if col-(row-i) >= 0 and board[i][col-(row-i)] == QUEEN:
            return false
        if col+(row-i) < n and board[i][col+(row-i)] == QUEEN:
            return false
    return true`}</pre>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <button className="start-playing-btn cursor-target" onClick={() => setMode("menu")}>
                    <FaPlay /> Start Playing Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (mode === "learn") {
    const step = learnSteps[learnStep];
    
    return (
      <div className="queens-arena learn-mode">
        <div className="arena-header">
          <button onClick={() => setMode("menu")} className="back-button cursor-target">
            <FaArrowLeft /> Back to Menu
          </button>
          <div className="arena-title">
            <FaGraduationCap className="arena-icon" />
            <h1>Learn Mode</h1>
          </div>
          <div className="learn-progress">
            Step {learnStep + 1} / {learnSteps.length}
          </div>
        </div>

        <div className="learn-container">
          <div className="learn-content-wrapper">
            <motion.div
              className="explanation-panel"
              key={learnStep}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2>{step.title}</h2>
              <p>{step.description}</p>

              {learnStep === 1 && (
                <div className="strategy-box">
                  <h4>Attack Patterns:</h4>
                  <ul>
                    <li><strong>Row:</strong> All cells in the same horizontal line</li>
                    <li><strong>Column:</strong> All cells in the same vertical line</li>
                    <li><strong>Diagonal:</strong> All cells on both diagonal lines</li>
                  </ul>
                </div>
              )}

              {learnStep === 4 && (
                <div className="algorithm-box">
                  <h4>Backtracking Process:</h4>
                  <ul>
                    <li>Place a queen in a valid position</li>
                    <li>Try to place the next queen</li>
                    <li>If no valid position exists, remove the previous queen</li>
                    <li>Try a different position for that queen</li>
                  </ul>
                </div>
              )}
            </motion.div>

            <div className="board-container">
              <div
                className="chess-board"
                style={{
                  gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                  gridTemplateRows: `repeat(${boardSize}, 1fr)`,
                }}
              >
                {board.map((row, rowIndex) =>
                  row.map((_, colIndex) => renderCell(rowIndex, colIndex))
                )}
              </div>
            </div>
          </div>

          <div className="learn-navigation">
            <button
              onClick={() => setLearnStep(Math.max(0, learnStep - 1))}
              disabled={learnStep === 0}
              className="nav-btn cursor-target"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (learnStep === learnSteps.length - 1) {
                  setMode("difficulty-select");
                } else {
                  setLearnStep(learnStep + 1);
                }
              }}
              className="nav-btn primary cursor-target"
            >
              {learnStep === learnSteps.length - 1 ? "Start Playing" : "Next"} <FaForward />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="queens-arena play-mode">
      <div className="arena-header">
        <button onClick={() => setMode("menu")} className="back-button cursor-target">
          <FaArrowLeft /> Menu
        </button>

        <div className="game-stats">
          <div className="stat">
            <FaTrophy />
            <span>{score}</span>
          </div>
          <div className="stat">
            <FaClock />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <div className="stat">
            <FaCrown />
            <span>{queens.length}/{boardSize}</span>
          </div>
        </div>

        <div className="game-controls">
          <button className="control-btn cursor-target" onClick={toggleHints}>
            <FaLightbulb /> {showHints ? "Hide" : "Show"} Hints
          </button>
          <button className="control-btn cursor-target" onClick={resetGame}>
            <FaUndo /> Reset
          </button>
        </div>
      </div>

      {combo > 1 && (
        <motion.div
          className="combo-indicator"
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0 }}
        >
          <FaTrophy /> {combo}x Combo! +{combo * 10}
        </motion.div>
      )}

      <div className="game-board-container">
        {board.length > 0 ? (
          <div
            className="chess-board"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
              gridTemplateRows: `repeat(${boardSize}, 1fr)`,
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((_, colIndex) => renderCell(rowIndex, colIndex))
            )}
          </div>
        ) : (
          <div style={{ color: 'white', fontSize: '2rem' }}>Loading board...</div>
        )}
      </div>

      <AnimatePresence>
        {mode === "completed" && (
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
              <FaTrophy className="victory-icon" />
              <h2>Victory!</h2>
              <p>You solved the {boardSize}×{boardSize} Queens puzzle!</p>
              <div className="victory-stats">
                <div><FaTrophy /> Score: {score}</div>
                <div><FaClock /> Time: {formatTime(timeElapsed)}</div>
                <div><FaCrown /> Moves: {moves}</div>
              </div>
              <div className="victory-actions">
                <button className="cursor-target" onClick={() => setMode("menu")}>
                  Back to Menu
                </button>
                <button className="cursor-target" onClick={resetGame}>
                  Play Again
                </button>
                {boardSize < 8 && (
                  <button className="cursor-target" onClick={() => startGame(boardSize + 2, difficulty)}>
                    Next Level
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QueensArena;
