// Chess piece values for evaluation
const PIECE_VALUES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
};

// Position bonuses for pieces (encourages good positioning)
const PAWN_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

export class ChessGame {
  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.moveCount = 0;
    this.gameOver = false;
    this.winner = null;
  }

  initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: 'pawn', color: 'black' };
      board[6][i] = { type: 'pawn', color: 'white' };
    }
    
    // Place other pieces
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: backRow[i], color: 'black' };
      board[7][i] = { type: backRow[i], color: 'white' };
    }
    
    return board;
  }

  getState() {
    return {
      board: this.board.map(row => row.map(piece => piece ? {...piece} : null)),
      currentPlayer: this.currentPlayer,
      moveCount: this.moveCount,
      gameOver: this.gameOver,
      winner: this.winner
    };
  }

  setState(state) {
    this.board = state.board.map(row => row.map(piece => piece ? {...piece} : null));
    this.currentPlayer = state.currentPlayer;
    this.moveCount = state.moveCount;
    this.gameOver = state.gameOver;
    this.winner = state.winner;
  }

  getPossibleMoves(position) {
    const [row, col] = position;
    const piece = this.board[row][col];
    if (!piece || piece.color !== this.currentPlayer) return [];

    const moves = [];
    
    switch (piece.type) {
      case 'pawn':
        moves.push(...this.getPawnMoves(row, col, piece.color));
        break;
      case 'knight':
        moves.push(...this.getKnightMoves(row, col, piece.color));
        break;
      case 'bishop':
        moves.push(...this.getBishopMoves(row, col, piece.color));
        break;
      case 'rook':
        moves.push(...this.getRookMoves(row, col, piece.color));
        break;
      case 'queen':
        moves.push(...this.getQueenMoves(row, col, piece.color));
        break;
      case 'king':
        moves.push(...this.getKingMoves(row, col, piece.color));
        break;
    }
    
    return moves;
  }

  getPawnMoves(row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // Forward move
    if (this.isValidPosition(row + direction, col) && !this.board[row + direction][col]) {
      moves.push([row + direction, col]);
      
      // Double move from start
      if (row === startRow && !this.board[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col]);
      }
    }
    
    // Captures
    for (const dcol of [-1, 1]) {
      const newRow = row + direction;
      const newCol = col + dcol;
      if (this.isValidPosition(newRow, newCol)) {
        const target = this.board[newRow][newCol];
        if (target && target.color !== color) {
          moves.push([newRow, newCol]);
        }
      }
    }
    
    return moves;
  }

  getKnightMoves(row, col, color) {
    const moves = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (const [dr, dc] of knightMoves) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (this.isValidPosition(newRow, newCol)) {
        const target = this.board[newRow][newCol];
        if (!target || target.color !== color) {
          moves.push([newRow, newCol]);
        }
      }
    }
    
    return moves;
  }

  getBishopMoves(row, col, color) {
    return this.getLineMoves(row, col, color, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
  }

  getRookMoves(row, col, color) {
    return this.getLineMoves(row, col, color, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
  }

  getQueenMoves(row, col, color) {
    return this.getLineMoves(row, col, color, [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]);
  }

  getKingMoves(row, col, color) {
    const moves = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (this.isValidPosition(newRow, newCol)) {
        const target = this.board[newRow][newCol];
        if (!target || target.color !== color) {
          moves.push([newRow, newCol]);
        }
      }
    }
    
    return moves;
  }

  getLineMoves(row, col, color, directions) {
    const moves = [];
    
    for (const [dr, dc] of directions) {
      let newRow = row + dr;
      let newCol = col + dc;
      
      while (this.isValidPosition(newRow, newCol)) {
        const target = this.board[newRow][newCol];
        if (!target) {
          moves.push([newRow, newCol]);
        } else {
          if (target.color !== color) {
            moves.push([newRow, newCol]);
          }
          break;
        }
        newRow += dr;
        newCol += dc;
      }
    }
    
    return moves;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  isValidMove(move) {
    const possibleMoves = this.getPossibleMoves(move.from);
    return possibleMoves.some(([r, c]) => r === move.to[0] && c === move.to[1]);
  }

  makeMove(move) {
    const [fromRow, fromCol] = move.from;
    const [toRow, toCol] = move.to;
    
    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = null;
    
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    this.moveCount++;
    
    this.checkGameOver();
  }

  getAllPossibleMoves(color) {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === color) {
          const pieceMoves = this.getPossibleMoves([row, col]);
          for (const [toRow, toCol] of pieceMoves) {
            moves.push({ from: [row, col], to: [toRow, toCol] });
          }
        }
      }
    }
    return moves;
  }

  checkGameOver() {
    // Check if current player has any moves
    const moves = this.getAllPossibleMoves(this.currentPlayer);
    if (moves.length === 0) {
      this.gameOver = true;
      this.winner = this.currentPlayer === 'white' ? 'black' : 'white';
    }
    
    // Check if king is captured
    let whiteKing = false, blackKing = false;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.type === 'king') {
          if (piece.color === 'white') whiteKing = true;
          if (piece.color === 'black') blackKing = true;
        }
      }
    }
    
    if (!whiteKing) {
      this.gameOver = true;
      this.winner = 'black';
    } else if (!blackKing) {
      this.gameOver = true;
      this.winner = 'white';
    }
  }

  isGameOver() {
    return this.gameOver;
  }

  getWinner() {
    return this.winner;
  }
}

export function evaluateBoard(game) {
  let score = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = game.board[row][col];
      if (!piece) continue;
      
      let pieceValue = PIECE_VALUES[piece.type];
      
      // Add position bonus
      if (piece.type === 'pawn') {
        const table = piece.color === 'white' ? PAWN_TABLE : PAWN_TABLE.slice().reverse();
        pieceValue += table[row][col];
      } else if (piece.type === 'knight') {
        const table = piece.color === 'white' ? KNIGHT_TABLE : KNIGHT_TABLE.slice().reverse();
        pieceValue += table[row][col];
      }
      
      score += piece.color === 'white' ? pieceValue : -pieceValue;
    }
  }
  
  return score;
}

export function minimax(game, depth, alpha, beta, maximizingPlayer, difficulty) {
  if (depth === 0 || game.isGameOver()) {
    return { score: evaluateBoard(game), move: null };
  }
  
  const color = maximizingPlayer ? 'black' : 'white';
  const moves = game.getAllPossibleMoves(color);
  
  // Easy mode: occasionally make random moves
  if (difficulty === 'easy' && Math.random() < 0.3) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return { score: evaluateBoard(game), move: randomMove };
  }
  
  let bestMove = null;
  
  if (maximizingPlayer) {
    let maxScore = -Infinity;
    
    for (const move of moves) {
      const gameState = game.getState();
      game.makeMove(move);
      
      const result = minimax(game, depth - 1, alpha, beta, false, difficulty);
      
      game.setState(gameState);
      
      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    
    for (const move of moves) {
      const gameState = game.getState();
      game.makeMove(move);
      
      const result = minimax(game, depth - 1, alpha, beta, true, difficulty);
      
      game.setState(gameState);
      
      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      
      beta = Math.min(beta, result.score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: minScore, move: bestMove };
  }
}
