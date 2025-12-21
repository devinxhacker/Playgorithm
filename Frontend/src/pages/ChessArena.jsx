import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChess, FaRobot, FaUser, FaUndo, FaRedo } from 'react-icons/fa';
import './ChessArena.css';
import { ChessGame, evaluateBoard, minimax } from '../utils/chessEngine';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';

const ChessArena = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [mode, setMode] = useState(null); // 'learn' or 'play'
  const [difficulty, setDifficulty] = useState(null); // 'easy', 'medium', 'impossible'
  const [game, setGame] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState('');
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });

  useEffect(() => {
    if (mode === 'play' && difficulty) {
      initializeGame();
    }
  }, [mode, difficulty]);

  const initializeGame = () => {
    const newGame = new ChessGame();
    setGame(newGame);
    setMoveHistory([newGame.getState()]);
    setCurrentMoveIndex(0);
    setGameStatus('Your turn (White)');
    setCapturedPieces({ white: [], black: [] });
  };

  const handleSquareClick = (row, col) => {
    if (!game || game.isGameOver() || thinking) return;

    if (selectedSquare) {
      // Try to make a move
      const [fromRow, fromCol] = selectedSquare;
      const move = { from: [fromRow, fromCol], to: [row, col] };
      
      if (game.isValidMove(move)) {
        makeMove(move);
      } else {
        // Select new piece
        selectSquare(row, col);
      }
    } else {
      selectSquare(row, col);
    }
  };

  const selectSquare = (row, col) => {
    const piece = game.board[row][col];
    if (piece && piece.color === game.currentPlayer) {
      setSelectedSquare([row, col]);
      setPossibleMoves(game.getPossibleMoves([row, col]));
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const makeMove = (move) => {
    const capturedPiece = game.board[move.to[0]][move.to[1]];
    
    game.makeMove(move);
    setLastMove(move);
    
    // Track captured pieces
    if (capturedPiece) {
      setCapturedPieces(prev => ({
        ...prev,
        [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece]
      }));
    }

    // Update history
    const newHistory = moveHistory.slice(0, currentMoveIndex + 1);
    newHistory.push(game.getState());
    setMoveHistory(newHistory);
    setCurrentMoveIndex(newHistory.length - 1);

    setSelectedSquare(null);
    setPossibleMoves([]);

    if (game.isGameOver()) {
      const winner = game.getWinner();
      setGameStatus(winner === 'draw' ? 'Game Draw!' : `${winner} wins!`);
      
      // Save game result to backend
      if (user) {
        const playerWon = winner === 'white';
        const xpReward = playerWon ? 100 : (winner === 'draw' ? 50 : 25);
        gameAPI.completeGame({
          gameId: `chess-${difficulty}`,
          xpEarned: xpReward,
          won: playerWon
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
    } else if (game.currentPlayer === 'black') {
      setGameStatus('AI is thinking...');
      setThinking(true);
      setTimeout(() => makeAIMove(), 500);
    } else {
      setGameStatus('Your turn (White)');
    }
  };

  const makeAIMove = () => {
    const depth = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6;
    const bestMove = minimax(game, depth, -Infinity, Infinity, true, difficulty).move;
    
    if (bestMove) {
      makeMove(bestMove);
      setThinking(false);
      if (!game.isGameOver()) {
        setGameStatus('Your turn (White)');
      }
    }
  };

  const undoMove = () => {
    if (currentMoveIndex > 0) {
      const newIndex = currentMoveIndex - 1;
      game.setState(moveHistory[newIndex]);
      setCurrentMoveIndex(newIndex);
      setSelectedSquare(null);
      setPossibleMoves([]);
      setLastMove(null);
    }
  };

  const redoMove = () => {
    if (currentMoveIndex < moveHistory.length - 1) {
      const newIndex = currentMoveIndex + 1;
      game.setState(moveHistory[newIndex]);
      setCurrentMoveIndex(newIndex);
    }
  };

  const resetGame = () => {
    initializeGame();
    setSelectedSquare(null);
    setPossibleMoves([]);
    setLastMove(null);
  };

  const renderPiece = (piece) => {
    if (!piece) return null;
    // Use filled pieces for both, differentiate by color styling
    const pieces = {
      'king': '♚',
      'queen': '♛',
      'rook': '♜',
      'bishop': '♝',
      'knight': '♞',
      'pawn': '♟'
    };
    return <span className={`piece-${piece.color}`}>{pieces[piece.type]}</span>;
  };

  const isPossibleMove = (row, col) => {
    return possibleMoves.some(move => move[0] === row && move[1] === col);
  };

  const isLastMove = (row, col) => {
    if (!lastMove) return false;
    return (lastMove.from[0] === row && lastMove.from[1] === col) ||
           (lastMove.to[0] === row && lastMove.to[1] === col);
  };

  if (!mode) {
    return (
      <div className="chess-arena">
        <div className="chess-header">
          <button onClick={() => navigate('/dashboard')} className="back-button cursor-target">
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>Chess Arena</h1>
        </div>

        <div className="mode-selection">
          <div className="mode-card cursor-target" onClick={() => setMode('learn')}>
            <FaChess size={60} />
            <h2>Learn Mode</h2>
            <p>Understand how Minimax algorithm works with step-by-step visualization</p>
          </div>
          <div className="mode-card cursor-target" onClick={() => setMode('play')}>
            <FaRobot size={60} />
            <h2>Play vs AI</h2>
            <p>Challenge the AI with different difficulty levels</p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'play' && !difficulty) {
    return (
      <div className="chess-arena">
        <div className="chess-header">
          <button onClick={() => setMode(null)} className="back-button cursor-target">
            <FaArrowLeft /> Back
          </button>
          <h1>Select Difficulty</h1>
        </div>

        <div className="difficulty-selection">
          <div className="difficulty-card easy cursor-target" onClick={() => setDifficulty('easy')}>
            <h2>Easy</h2>
            <p>Depth: 2 | Random moves occasionally</p>
          </div>
          <div className="difficulty-card medium cursor-target" onClick={() => setDifficulty('medium')}>
            <h2>Medium</h2>
            <p>Depth: 4 | Strategic play</p>
          </div>
          <div className="difficulty-card impossible cursor-target" onClick={() => setDifficulty('impossible')}>
            <h2>Impossible</h2>
            <p>Depth: 6 | Perfect play with alpha-beta pruning</p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'learn') {
    return (
      <div className="chess-arena">
        <div className="chess-header">
          <button onClick={() => setMode(null)} className="back-button cursor-target">
            <FaArrowLeft /> Back
          </button>
          <h1>Learn: Minimax Algorithm</h1>
        </div>

        <div className="learn-content">
          <div className="learn-section">
            <h2>What is Minimax?</h2>
            <p>Minimax is a decision-making algorithm used in two-player games. It assumes both players play optimally.</p>
            
            <div className="algorithm-box">
              <h3>How it Works:</h3>
              <ol>
                <li><strong>Maximizing Player:</strong> Tries to get the highest score</li>
                <li><strong>Minimizing Player:</strong> Tries to get the lowest score</li>
                <li><strong>Recursion:</strong> Explores all possible moves to a certain depth</li>
                <li><strong>Evaluation:</strong> Assigns scores to board positions</li>
              </ol>
            </div>

            <div className="algorithm-box">
              <h3>Alpha-Beta Pruning:</h3>
              <p>An optimization that eliminates branches that won't affect the final decision.</p>
              <ul>
                <li><strong>Alpha:</strong> Best value maximizer can guarantee</li>
                <li><strong>Beta:</strong> Best value minimizer can guarantee</li>
                <li><strong>Pruning:</strong> If beta ≤ alpha, stop exploring that branch</li>
              </ul>
            </div>

            <div className="algorithm-box">
              <h3>Evaluation Function:</h3>
              <pre>{`
function evaluate(board):
  score = 0
  for each piece:
    score += pieceValue[piece.type]
    score += positionBonus[piece.position]
  return score
              `}</pre>
              <p><strong>Piece Values:</strong> Pawn=1, Knight=3, Bishop=3, Rook=5, Queen=9, King=∞</p>
            </div>

            <button className="start-play-button cursor-target" onClick={() => setMode('play')}>
              Start Playing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chess-arena">
      <div className="chess-header">
        <button onClick={() => { setMode(null); setDifficulty(null); }} className="back-button cursor-target">
          <FaArrowLeft /> Back
        </button>
        <h1>Chess Arena - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h1>
      </div>

      <div className="chess-game-container">
        <div className="game-info">
          <div className="player-info">
            <FaRobot size={30} />
            <span>AI (Black)</span>
            <div className="captured-pieces">
              {capturedPieces.white.map((piece, i) => (
                <span key={i}>{renderPiece(piece)}</span>
              ))}
            </div>
          </div>

          <div className="game-status">{gameStatus}</div>

          <div className="game-controls">
            <button onClick={undoMove} disabled={currentMoveIndex <= 0} className="control-btn cursor-target">
              <FaUndo /> Undo
            </button>
            <button onClick={redoMove} disabled={currentMoveIndex >= moveHistory.length - 1} className="control-btn cursor-target">
              <FaRedo /> Redo
            </button>
            <button onClick={resetGame} className="control-btn cursor-target">
              Reset
            </button>
          </div>

          <div className="player-info">
            <FaUser size={30} />
            <span>You (White)</span>
            <div className="captured-pieces">
              {capturedPieces.black.map((piece, i) => (
                <span key={i}>{renderPiece(piece)}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="chess-board-container">
          <div className="chess-board">
            {game && game.board.map((row, rowIndex) => (
              <div key={rowIndex} className="chess-row">
                {row.map((piece, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0;
                  const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
                  const isPossible = isPossibleMove(rowIndex, colIndex);
                  const isLast = isLastMove(rowIndex, colIndex);
                  
                  return (
                    <div
                      key={colIndex}
                      className={`chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isPossible ? 'possible' : ''} ${isLast ? 'last-move' : ''} cursor-target`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      {piece && <span className="chess-piece">{renderPiece(piece)}</span>}
                      {isPossible && <div className="move-indicator"></div>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessArena;
