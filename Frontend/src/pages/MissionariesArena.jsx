import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaPlay, 
  FaGraduationCap, 
  FaBrain,
  FaTrophy,
  FaLightbulb,
  FaUndo,
  FaClock,
  FaForward,
  FaBook
} from "react-icons/fa";
import { GiSwordman, GiBoatFishing } from "react-icons/gi";
import { SparklesCore } from '../components/ui/sparkles';
import warriorImage from '../assets/images/warrior-tic-tac-toe.png';
import "./MissionariesArena.css";

const MissionariesArena = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("menu");
  const [leftBank, setLeftBank] = useState({ missionaries: 3, cannibals: 3 });
  const [rightBank, setRightBank] = useState({ missionaries: 0, cannibals: 0 });
  const [boatPosition, setBoatPosition] = useState("left");
  const [boatPassengers, setBoatPassengers] = useState({ missionaries: 0, cannibals: 0 });
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [learnStep, setLearnStep] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [score, setScore] = useState(0);
  const [optimalMoves] = useState(11);

  const learnSteps = [
    {
      title: "Welcome to Missionaries and Cannibals",
      description: "This is a classic river-crossing puzzle that teaches constraint satisfaction, state-space search, and problem-solving strategies. Your goal is to move everyone across the river safely."
    },
    {
      title: "The Rules",
      description: "You have 3 missionaries and 3 cannibals on the left bank. The boat can carry at most 2 people. If cannibals outnumber missionaries on either bank, the missionaries will be eaten!"
    },
    {
      title: "Boat Mechanics",
      description: "Click on missionaries or cannibals to load them into the boat (max 2). The boat must have at least 1 person to cross. Click 'Cross River' to move the boat to the other side."
    },
    {
      title: "Safety Constraint",
      description: "The critical rule: On each bank, missionaries must never be outnumbered by cannibals (unless there are 0 missionaries on that bank). This is a constraint satisfaction problem!"
    },
    {
      title: "Strategy Tips",
      description: "Think ahead! Some moves may seem safe but lead to dead ends. The optimal solution requires 11 moves. Use the hint system if you get stuck."
    }
  ];

  useEffect(() => {
    let interval;
    if (mode === "play" && !gameOver && !victory) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, gameOver, victory]);

  const checkSafety = (bank) => {
    if (bank.missionaries === 0) return true;
    return bank.missionaries >= bank.cannibals;
  };

  const isValidState = (left, right) => {
    return checkSafety(left) && checkSafety(right);
  };

  const loadPassenger = (type) => {
    console.log("Loading passenger:", type);
    
    if (boatPassengers.missionaries + boatPassengers.cannibals >= 2) {
      showError("Boat is full! Maximum 2 passengers.");
      return;
    }

    const currentBank = boatPosition === "left" ? leftBank : rightBank;
    const key = type === "missionary" ? "missionaries" : "cannibals";
    
    if (currentBank[key] <= 0) {
      showError(`No ${type} available on this bank!`);
      return;
    }

    const newBoat = { ...boatPassengers, [key]: boatPassengers[key] + 1 };
    setBoatPassengers(newBoat);

    if (boatPosition === "left") {
      setLeftBank({ ...leftBank, [key]: leftBank[key] - 1 });
    } else {
      setRightBank({ ...rightBank, [key]: rightBank[key] - 1 });
    }
    
    console.log("Boat passengers after loading:", newBoat);
  };

  const unloadPassenger = (type) => {
    const key = type === "missionary" ? "missionaries" : "cannibals";
    
    if (boatPassengers[key] <= 0) return;

    const newBoat = { ...boatPassengers, [key]: boatPassengers[key] - 1 };
    setBoatPassengers(newBoat);

    if (boatPosition === "left") {
      setLeftBank({ ...leftBank, [key]: leftBank[key] + 1 });
    } else {
      setRightBank({ ...rightBank, [key]: rightBank[key] + 1 });
    }
  };

  const crossRiver = () => {
    const totalPassengers = boatPassengers.missionaries + boatPassengers.cannibals;
    
    if (totalPassengers === 0) {
      showError("Boat must have at least 1 passenger!");
      return;
    }

    const newPosition = boatPosition === "left" ? "right" : "left";
    let newLeft = { ...leftBank };
    let newRight = { ...rightBank };

    if (newPosition === "right") {
      newRight.missionaries += boatPassengers.missionaries;
      newRight.cannibals += boatPassengers.cannibals;
    } else {
      newLeft.missionaries += boatPassengers.missionaries;
      newLeft.cannibals += boatPassengers.cannibals;
    }

    if (!isValidState(newLeft, newRight)) {
      showError("Invalid move! Missionaries would be outnumbered!");
      
      if (boatPosition === "left") {
        setLeftBank({ 
          missionaries: leftBank.missionaries + boatPassengers.missionaries,
          cannibals: leftBank.cannibals + boatPassengers.cannibals
        });
      } else {
        setRightBank({ 
          missionaries: rightBank.missionaries + boatPassengers.missionaries,
          cannibals: rightBank.cannibals + boatPassengers.cannibals
        });
      }
      setBoatPassengers({ missionaries: 0, cannibals: 0 });
      setGameOver(true);
      return;
    }

    setLeftBank(newLeft);
    setRightBank(newRight);
    setBoatPosition(newPosition);
    setBoatPassengers({ missionaries: 0, cannibals: 0 });
    setMoves(moves + 1);

    if (newRight.missionaries === 3 && newRight.cannibals === 3) {
      setVictory(true);
      const timeBonus = Math.max(0, 300 - timeElapsed) * 5;
      const moveBonus = Math.max(0, (20 - moves) * 50);
      const optimalBonus = moves === optimalMoves ? 500 : 0;
      const finalScore = 1000 + timeBonus + moveBonus + optimalBonus;
      setScore(finalScore);
    }

    if (mode === "learn" && moves + 1 === learnStep + 1 && learnStep < learnSteps.length - 1) {
      setTimeout(() => setLearnStep(learnStep + 1), 1000);
    }
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const resetGame = () => {
    setLeftBank({ missionaries: 3, cannibals: 3 });
    setRightBank({ missionaries: 0, cannibals: 0 });
    setBoatPosition("left");
    setBoatPassengers({ missionaries: 0, cannibals: 0 });
    setMoves(0);
    setTimeElapsed(0);
    setGameOver(false);
    setVictory(false);
    setErrorMessage("");
    setScore(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getHint = () => {
    const hints = [
      "Start by sending 2 cannibals across",
      "Bring 1 cannibal back",
      "Send 2 cannibals across again",
      "Bring 1 cannibal back",
      "Send 2 missionaries across",
      "Bring 1 missionary and 1 cannibal back",
      "Send 2 missionaries across",
      "Bring 1 cannibal back",
      "Send 2 cannibals across",
      "Bring 1 cannibal back",
      "Send 2 cannibals across - Victory!"
    ];
    return hints[Math.min(moves, hints.length - 1)];
  };

  const renderPeople = (count, type, location, clickable = false) => {
    return Array(count).fill(null).map((_, index) => (
      <motion.div
        key={`${type}-${location}-${index}`}
        className={`person ${type} ${clickable ? 'clickable cursor-target' : ''}`}
        onClick={() => clickable && loadPassenger(type)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={clickable ? { scale: 1.1, y: -5 } : {}}
        whileTap={clickable ? { scale: 0.9 } : {}}
        transition={{ delay: index * 0.1 }}
      >
        <img 
          src={type === "missionary" ? "/missionary.png" : "/cannibal.png"} 
          alt={type}
          className="person-image"
        />
      </motion.div>
    ));
  };

  if (mode === "menu") {
    return (
      <div className="missionaries-arena" style={{ background: '#000000', position: 'relative', overflow: 'hidden' }}>
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
            id="missionariesparticlesfullpage"
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
            <h1>Missionaries & Cannibals</h1>
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
            <p className="menu-subtitle">Master the classic river-crossing puzzle through learning or challenge yourself!</p>

            <div className="menu-layout">
              <div className="warrior-image-container">
                <img src={warriorImage} alt="Missionaries Warrior" className="warrior-image" />
              </div>

              <div className="mode-cards">
                <motion.div
                  className="mode-card learn-card cursor-target"
                  onClick={() => {
                    setMode("learn");
                    setLearnStep(0);
                    resetGame();
                  }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                <div className="mode-icon">
                  <FaGraduationCap />
                </div>
                <h3>Learn Mode</h3>
                <p>Understand constraint satisfaction, state-space search, and optimal problem-solving strategies step-by-step</p>
                <div className="mode-features">
                  <span><FaLightbulb /> Interactive Tutorial</span>
                  <span><FaBrain /> Algorithm Visualization</span>
                  <span><FaTrophy /> Strategic Insights</span>
                </div>
              </motion.div>

              <motion.div
                className="mode-card play-card cursor-target"
                onClick={() => {
                  setMode("play");
                  resetGame();
                }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mode-icon">
                  <FaPlay />
                </div>
                <h3>Play Mode</h3>
                <p>Challenge yourself to solve the puzzle in the optimal 11 moves and test your strategic thinking</p>
                <div className="mode-features">
                  <span><GiBoatFishing /> River Crossing</span>
                  <span><FaClock /> Timed Challenge</span>
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

  if (mode === "algorithm-learn") {
    return (
      <div className="missionaries-arena learn-algorithm-mode">
        <div className="arena-header">
          <button className="back-button cursor-target" onClick={() => setMode("menu")}>
            <FaArrowLeft /> Back to Menu
          </button>
          <div className="arena-title">
            <FaBook className="arena-icon" />
            <h1>Missionaries & Cannibals Algorithm</h1>
          </div>
        </div>
        
        <div className="learn-container">
          <motion.div
            className="learn-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="learn-two-column">
              <div className="learn-section">
                <h2><FaTrophy /> The Problem</h2>
                <p>
                  Three missionaries and three cannibals must cross a river using a boat that can carry at most two people. 
                  If cannibals ever outnumber missionaries on either bank, the missionaries will be eaten.
                </p>
                
                <h2><GiBoatFishing /> Constraints</h2>
                <ul>
                  <li><strong>Boat Capacity:</strong> Maximum 2 people per trip</li>
                  <li><strong>Boat Requirement:</strong> At least 1 person must be in the boat</li>
                  <li><strong>Safety Rule:</strong> Missionaries ≥ Cannibals on each bank (or 0 missionaries)</li>
                  <li><strong>Goal:</strong> Move everyone to the right bank</li>
                </ul>

                <h2><FaLightbulb /> Solution Strategy</h2>
                <ul>
                  <li><strong>State Representation:</strong> (M_left, C_left, Boat_position)</li>
                  <li><strong>Initial State:</strong> (3, 3, left)</li>
                  <li><strong>Goal State:</strong> (0, 0, right)</li>
                  <li><strong>Optimal Solution:</strong> 11 moves</li>
                </ul>

                <h2><FaBrain /> Key Insights</h2>
                <ul>
                  <li>This is a <strong>constraint satisfaction problem</strong></li>
                  <li>Uses <strong>breadth-first search</strong> for optimal solution</li>
                  <li>Requires <strong>backtracking</strong> when constraints violated</li>
                  <li>State-space has 32 possible states, only 16 are safe</li>
                </ul>
              </div>

              <div className="learn-section algorithm-section">
                <h2><FaBrain /> The Search Algorithm</h2>
                <div className="algorithm-box">
                  <pre>{`function solveMissionariesCannibals():
    initial = State(3, 3, "left")
    goal = State(0, 0, "right")
    queue = [initial]
    visited = set()
    
    while queue not empty:
        current = queue.dequeue()
        
        if current == goal:
            return current.path
        
        if current in visited:
            continue
        visited.add(current)
        
        for move in getPossibleMoves(current):
            next = applyMove(current, move)
            if isSafe(next):
                queue.enqueue(next)
    
    return "No solution"

function isSafe(state):
    left_m, left_c = state.left
    right_m, right_c = state.right
    
    // Check left bank
    if left_m > 0 and left_m < left_c:
        return false
    
    // Check right bank
    if right_m > 0 and right_m < right_c:
        return false
    
    return true

function getPossibleMoves(state):
    moves = []
    if state.boat == "left":
        // Try all combinations: 
        // 1M, 2M, 1C, 2C, 1M1C
        for m in [0, 1, 2]:
            for c in [0, 1, 2]:
                if 1 <= m+c <= 2:
                    moves.append((m, c))
    return moves`}</pre>
                </div>
                
                <div className="optimal-solution">
                  <h3>Optimal 11-Move Solution:</h3>
                  <ol>
                    <li>2 Cannibals cross →</li>
                    <li>← 1 Cannibal returns</li>
                    <li>2 Cannibals cross →</li>
                    <li>← 1 Cannibal returns</li>
                    <li>2 Missionaries cross →</li>
                    <li>← 1 Missionary + 1 Cannibal return</li>
                    <li>2 Missionaries cross →</li>
                    <li>← 1 Cannibal returns</li>
                    <li>2 Cannibals cross →</li>
                    <li>← 1 Cannibal returns</li>
                    <li>2 Cannibals cross → VICTORY!</li>
                  </ol>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
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
      <div className="missionaries-arena learn-mode">
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

        <div className="learn-container-interactive">
          <motion.div
            className="explanation-panel"
            key={learnStep}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </motion.div>

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
                  setMode("play");
                  resetGame();
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
    <div className="missionaries-arena play-mode">
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
            <GiBoatFishing />
            <span>Moves: {moves}/{optimalMoves}</span>
          </div>
        </div>

        <div className="game-controls">
          <button className="control-btn cursor-target" onClick={() => setShowHints(!showHints)}>
            <FaLightbulb /> {showHints ? "Hide" : "Show"} Hints
          </button>
          <button className="control-btn cursor-target" onClick={resetGame}>
            <FaUndo /> Reset
          </button>
        </div>
      </div>

      {errorMessage && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {errorMessage}
        </motion.div>
      )}

      {showHints && !victory && !gameOver && (
        <motion.div
          className="hint-panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaLightbulb /> <strong>Hint:</strong> {getHint()}
        </motion.div>
      )}

      <div className="game-container">
        <div className="river-scene">
          {/* Left Bank */}
          <div className="bank left-bank">
            <h3>Left Bank</h3>
            <div className="people-container">
              <div className="people-group missionaries-group">
                <span className="group-label">Missionaries: {leftBank.missionaries}</span>
                <div>
                  {renderPeople(leftBank.missionaries, "missionary", "left", boatPosition === "left")}
                </div>
              </div>
              <div className="people-group cannibals-group">
                <span className="group-label">Cannibals: {leftBank.cannibals}</span>
                <div>
                  {renderPeople(leftBank.cannibals, "cannibal", "left", boatPosition === "left")}
                </div>
              </div>
            </div>
          </div>

          {/* River and Boat */}
          <div className="river">
            <motion.div
              className={`boat ${boatPosition} ${boatPassengers.missionaries + boatPassengers.cannibals > 0 ? 'loaded' : ''}`}
              animate={{
                left: boatPosition === "left" ? "20%" : "80%",
                rotate: boatPassengers.missionaries + boatPassengers.cannibals > 0 ? [0, -2, 2, -2, 0] : 0
              }}
              transition={{ 
                left: { type: "spring", stiffness: 80, damping: 25, duration: 1.5 },
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <img src="/boat.png" alt="boat" className="boat-icon" />
              <div className="boat-passengers">
                {boatPassengers.missionaries + boatPassengers.cannibals === 0 ? (
                  <span className=""></span>
                ) : (
                  <>
                    {renderPeople(boatPassengers.missionaries, "missionary", "boat")}
                    {renderPeople(boatPassengers.cannibals, "cannibal", "boat")}
                  </>
                )}
              </div>
              <div className="boat-controls">
                {boatPassengers.missionaries > 0 && (
                  <button 
                    className="unload-btn missionary cursor-target" 
                    onClick={() => unloadPassenger("missionary")}
                  >
                    - M
                  </button>
                )}
                {boatPassengers.cannibals > 0 && (
                  <button 
                    className="unload-btn cannibal cursor-target" 
                    onClick={() => unloadPassenger("cannibal")}
                  >
                    - C
                  </button>
                )}
              </div>
            </motion.div>
            <button 
              className="cross-btn cursor-target" 
              onClick={crossRiver}
              disabled={gameOver || victory}
            >
              {boatPosition === "left" ? "Cross River →" : "← Cross River"}
            </button>
          </div>

          {/* Right Bank */}
          <div className="bank right-bank">
            <h3>Right Bank</h3>
            <div className="people-container">
              <div className="people-group missionaries-group">
                <span className="group-label">Missionaries: {rightBank.missionaries}</span>
                <div>
                  {renderPeople(rightBank.missionaries, "missionary", "right", boatPosition === "right")}
                </div>
              </div>
              <div className="people-group cannibals-group">
                <span className="group-label">Cannibals: {rightBank.cannibals}</span>
                <div>
                  {renderPeople(rightBank.cannibals, "cannibal", "right", boatPosition === "right")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {victory && (
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
              <p>Everyone crossed safely!</p>
              <div className="victory-stats">
                <div><FaTrophy /> Score: {score}</div>
                <div><FaClock /> Time: {formatTime(timeElapsed)}</div>
                <div><GiBoatFishing /> Moves: {moves}</div>
                {moves === optimalMoves && (
                  <div className="optimal-badge">🌟 Optimal Solution!</div>
                )}
              </div>
              <div className="victory-actions">
                <button className="cursor-target" onClick={() => setMode("menu")}>
                  Back to Menu
                </button>
                <button className="cursor-target" onClick={resetGame}>
                  Play Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {gameOver && (
          <motion.div
            className="victory-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="victory-card game-over"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="game-over-icon">💀</div>
              <h2>Game Over!</h2>
              <p>{errorMessage}</p>
              <div className="victory-actions">
                <button className="cursor-target" onClick={() => setMode("menu")}>
                  Back to Menu
                </button>
                <button className="cursor-target" onClick={resetGame}>
                  Try Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MissionariesArena;
