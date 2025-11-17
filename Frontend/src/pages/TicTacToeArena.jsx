import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaPlay, 
  FaRedo, 
  FaBrain,
  FaGraduationCap,
  FaTrophy,
  FaLightbulb,
  FaRobot,
  FaUser
} from 'react-icons/fa';
import { GiSwordman } from 'react-icons/gi';
import './TicTacToeArena.css';

const TicTacToeArena = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('menu'); // 'menu', 'learn', 'play'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0, ties: 0 });
  const [difficulty, setDifficulty] = useState('impossible'); // 'easy', 'medium', 'impossible'
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Learn Mode States
  const [learnStep, setLearnStep] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);

  const learnSteps = [
    {
      title: "Welcome to Tic-Tac-Toe Strategy",
      description: "Learn how AI makes perfect decisions using the Minimax algorithm. This game teaches you game theory, strategic thinking, and algorithm optimization.",
      board: Array(9).fill(null),
      highlight: []
    },
    {
      title: "Understanding the Board",
      description: "The board has 9 positions (0-8). Each position can be X, O, or empty. The goal is to get 3 in a row horizontally, vertically, or diagonally.",
      board: Array(9).fill(null),
      highlight: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    },
    {
      title: "Winning Patterns",
      description: "There are 8 possible winning combinations: 3 rows, 3 columns, and 2 diagonals. The AI evaluates all of these in every move.",
      board: ['X', 'X', 'X', null, null, null, null, null, null],
      highlight: [0, 1, 2]
    },
    {
      title: "Minimax Algorithm - Part 1",
      description: "The AI uses Minimax to explore all possible future moves. It assumes both players play optimally and chooses the best move.",
      board: ['X', null, null, null, 'O', null, null, null, null],
      highlight: [0, 4]
    },
    {
      title: "Minimax Algorithm - Part 2",
      description: "Maximizer (X) tries to maximize score (+1 for win). Minimizer (O) tries to minimize score (-1 for win). Tie = 0.",
      board: ['X', 'O', 'X', 'O', 'X', null, 'O', null, null],
      highlight: [0, 2, 4]
    },
    {
      title: "Strategic Center Control",
      description: "The center position (4) is the most powerful! It's part of 4 winning combinations. AI prioritizes center control.",
      board: [null, null, null, null, 'X', null, null, null, null],
      highlight: [4]
    },
    {
      title: "Corner Strategy",
      description: "Corners (0, 2, 6, 8) are the second-best positions. Each corner is part of 3 winning combinations.",
      board: ['X', null, 'O', null, 'X', null, 'O', null, 'X'],
      highlight: [0, 2, 6, 8]
    },
    {
      title: "Blocking Opponent",
      description: "The AI always blocks your winning moves. If you have 2 in a row, AI will block the third position.",
      board: ['X', 'X', null, null, 'O', null, null, null, null],
      highlight: [2]
    },
    {
      title: "Perfect Play Result",
      description: "When both players play perfectly using Minimax, the game ALWAYS ends in a tie. The AI is unbeatable!",
      board: ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'],
      highlight: []
    },
    {
      title: "Ready to Play!",
      description: "Now you understand the strategy! Try to beat the AI or force a tie. Remember: center first, then corners!",
      board: Array(9).fill(null),
      highlight: [4, 0, 2, 6, 8]
    }
  ];

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    return null;
  };

  const getAvailableMoves = (squares) => {
    return squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  };

  const minimax = (squares, isMaximizing, depth = 0) => {
    const result = calculateWinner(squares);
    
    if (result) {
      return result.winner === 'X' ? 10 - depth : depth - 10;
    }
    
    if (getAvailableMoves(squares).length === 0) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let move of getAvailableMoves(squares)) {
        squares[move] = 'X';
        let score = minimax(squares, false, depth + 1);
        squares[move] = null;
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let move of getAvailableMoves(squares)) {
        squares[move] = 'O';
        let score = minimax(squares, true, depth + 1);
        squares[move] = null;
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  const getBestMove = (squares, aiSymbol) => {
    if (difficulty === 'easy') {
      // 70% random, 30% optimal
      if (Math.random() < 0.7) {
        const available = getAvailableMoves(squares);
        return available[Math.floor(Math.random() * available.length)];
      }
    } else if (difficulty === 'medium') {
      // 40% random, 60% optimal
      if (Math.random() < 0.4) {
        const available = getAvailableMoves(squares);
        return available[Math.floor(Math.random() * available.length)];
      }
    }

    // Impossible mode or fallback for other modes
    let bestScore = aiSymbol === 'X' ? -Infinity : Infinity;
    let bestMove = null;

    for (let move of getAvailableMoves(squares)) {
      squares[move] = aiSymbol;
      let score = minimax(squares, aiSymbol === 'O', 0);
      squares[move] = null;

      if (aiSymbol === 'X') {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }

    return bestMove;
  };

  const handleCellClick = (index) => {
    if (board[index] || gameOver || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
    setMoveHistory([...moveHistory, { player: 'X', position: index }]);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setGameOver(true);
      updateScore(result.winner);
      return;
    }

    if (getAvailableMoves(newBoard).length === 0) {
      setGameOver(true);
      updateScore('tie');
      return;
    }

    // AI move
    setTimeout(() => {
      setAiThinking(true);
      setTimeout(() => {
        const aiMove = getBestMove(newBoard, 'O');
        newBoard[aiMove] = 'O';
        setBoard(newBoard);
        setIsXNext(true);
        setAiThinking(false);
        setMoveHistory([...moveHistory, { player: 'X', position: index }, { player: 'O', position: aiMove }]);

        const aiResult = calculateWinner(newBoard);
        if (aiResult) {
          setWinner(aiResult.winner);
          setWinningLine(aiResult.line);
          setGameOver(true);
          updateScore(aiResult.winner);
          return;
        }

        if (getAvailableMoves(newBoard).length === 0) {
          setGameOver(true);
          updateScore('tie');
        }
      }, 500);
    }, 300);
  };

  const updateScore = (result) => {
    if (result === 'X') {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else if (result === 'O') {
      setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
    } else {
      setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
    setGameOver(false);
    setMoveHistory([]);
    setAiThinking(false);
  };

  const resetAll = () => {
    resetGame();
    setScore({ player: 0, ai: 0, ties: 0 });
  };

  const nextLearnStep = () => {
    if (learnStep < learnSteps.length - 1) {
      setLearnStep(learnStep + 1);
    } else {
      setMode('play');
      resetGame();
    }
  };

  const prevLearnStep = () => {
    if (learnStep > 0) {
      setLearnStep(learnStep - 1);
    }
  };

  useEffect(() => {
    if (mode === 'learn') {
      const step = learnSteps[learnStep];
      setHighlightedCells(step.highlight);
    }
  }, [learnStep, mode]);

  const renderCell = (index, isLearnMode = false) => {
    const step = learnSteps[learnStep];
    const value = isLearnMode ? step.board[index] : board[index];
    const isHighlighted = isLearnMode && highlightedCells.includes(index);
    const isWinning = winningLine && winningLine.includes(index);

    return (
      <motion.button
        key={index}
        className={`cell ${isHighlighted ? 'highlighted' : ''} ${isWinning ? 'winning' : ''} ${value ? 'filled' : ''}`}
        onClick={() => !isLearnMode && handleCellClick(index)}
        disabled={isLearnMode || aiThinking}
        whileHover={!isLearnMode && !value && !gameOver ? { scale: 1.05 } : {}}
        whileTap={!isLearnMode && !value && !gameOver ? { scale: 0.95 } : {}}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        {value && (
          <motion.span
            className={`symbol ${value}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {value}
          </motion.span>
        )}
      </motion.button>
    );
  };

  if (mode === 'menu') {
    return (
      <div className="tictactoe-arena">
        <div className="arena-header">
          <button onClick={() => navigate('/dashboard')} className="back-button cursor-target">
            <FaArrowLeft /> Back to Dashboard
          </button>
          <div className="arena-title">
            <GiSwordman className="arena-icon" />
            <h1>Tic-Tac-Toe Arena</h1>
          </div>
        </div>

        <div className="menu-container">
          <motion.div
            className="menu-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Choose Your Path</h2>
            <p className="menu-subtitle">Master the game through learning or test your skills!</p>

            <div className="mode-cards">
              <motion.div
                className="mode-card learn-card cursor-target"
                onClick={() => {
                  setMode('learn');
                  setLearnStep(0);
                }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mode-icon">
                  <FaGraduationCap />
                </div>
                <h3>Learn Mode</h3>
                <p>Understand Minimax algorithm, game theory, and perfect strategy step-by-step</p>
                <div className="mode-features">
                  <span><FaLightbulb /> Interactive Tutorial</span>
                  <span><FaBrain /> Algorithm Visualization</span>
                  <span><FaTrophy /> Strategic Insights</span>
                </div>
              </motion.div>

              <motion.div
                className="mode-card play-card cursor-target"
                onClick={() => setMode('play')}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mode-icon">
                  <FaPlay />
                </div>
                <h3>Play Mode</h3>
                <p>Challenge the AI and test your strategic thinking against perfect play</p>
                <div className="mode-features">
                  <span><FaRobot /> AI Opponent</span>
                  <span><FaUser /> 3 Difficulty Levels</span>
                  <span><FaTrophy /> Track Your Score</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (mode === 'learn') {
    const step = learnSteps[learnStep];
    
    return (
      <div className="tictactoe-arena learn-mode">
        <div className="arena-header">
          <button onClick={() => setMode('menu')} className="back-button cursor-target">
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
          <div className="learn-content">
            <motion.div
              className="explanation-panel"
              key={learnStep}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2>{step.title}</h2>
              <p>{step.description}</p>

              {learnStep === 4 && (
                <div className="algorithm-box">
                  <h4>Minimax Scoring:</h4>
                  <ul>
                    <li><strong>+1 (or +10):</strong> X wins (Maximizer)</li>
                    <li><strong>-1 (or -10):</strong> O wins (Minimizer)</li>
                    <li><strong>0:</strong> Tie game</li>
                  </ul>
                </div>
              )}

              {learnStep === 5 && (
                <div className="strategy-box">
                  <h4>Position Values:</h4>
                  <ul>
                    <li><strong>Center (4):</strong> 4 winning combinations</li>
                    <li><strong>Corners (0,2,6,8):</strong> 3 combinations each</li>
                    <li><strong>Edges (1,3,5,7):</strong> 2 combinations each</li>
                  </ul>
                </div>
              )}
            </motion.div>

            <div className="board-container">
              <div className="board learn-board">
                {Array(9).fill(null).map((_, index) => renderCell(index, true))}
              </div>
            </div>
          </div>

          <div className="learn-navigation">
            <button
              onClick={prevLearnStep}
              disabled={learnStep === 0}
              className="nav-btn cursor-target"
            >
              Previous
            </button>
            <button
              onClick={nextLearnStep}
              className="nav-btn primary cursor-target"
            >
              {learnStep === learnSteps.length - 1 ? 'Start Playing!' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tictactoe-arena play-mode">
      <div className="arena-header">
        <button onClick={() => setMode('menu')} className="back-button cursor-target">
          <FaArrowLeft /> Back to Menu
        </button>
        <div className="arena-title">
          <FaPlay className="arena-icon" />
          <h1>Play Mode</h1>
        </div>
        <div className="difficulty-selector">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              resetAll();
            }}
            className="difficulty-dropdown cursor-target"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="impossible">Impossible</option>
          </select>
        </div>
      </div>

      <div className="play-container">
        <div className="game-info">
          <div className="scoreboard">
            <div className="score-item player">
              <FaUser />
              <span>You: {score.player}</span>
            </div>
            <div className="score-item ties">
              <span>Ties: {score.ties}</span>
            </div>
            <div className="score-item ai">
              <FaRobot />
              <span>AI: {score.ai}</span>
            </div>
          </div>

          <div className="game-status">
            {aiThinking && <div className="thinking">AI is thinking...</div>}
            {!gameOver && !aiThinking && (
              <div className="turn-indicator">
                {isXNext ? "Your turn (X)" : "AI's turn (O)"}
              </div>
            )}
            {gameOver && winner && (
              <div className={`game-result ${winner === 'X' ? 'win' : 'lose'}`}>
                {winner === 'X' ? '🎉 You Won!' : '🤖 AI Won!'}
              </div>
            )}
            {gameOver && !winner && (
              <div className="game-result tie">
                🤝 It's a Tie!
              </div>
            )}
          </div>
        </div>

        <div className="board-container">
          <div className="board play-board">
            {Array(9).fill(null).map((_, index) => renderCell(index, false))}
          </div>
        </div>

        <div className="game-controls">
          <button onClick={resetGame} className="control-btn cursor-target">
            <FaRedo /> New Game
          </button>
          <button onClick={resetAll} className="control-btn secondary cursor-target">
            Reset Score
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="celebration-card"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <FaTrophy className="celebration-icon" />
              <h2>Incredible!</h2>
              <p>You beat the AI! That's extremely rare!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicTacToeArena;
