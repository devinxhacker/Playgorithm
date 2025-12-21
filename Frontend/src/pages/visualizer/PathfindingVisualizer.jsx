import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlay, FaEraser, FaRandom, FaRoute, FaCog, FaMapMarkerAlt } from "react-icons/fa";
import {
  dijkstra,
  aStar,
  bfsdfs,
  getNodesInShortestPathOrder,
  randomMaze,
  getMaze,
} from "../../lib/algorithms/pathfindingAlgorithms";
import "./PathfindingVisualizer.css";

// Create initial grid
const createNode = (row, col) => ({
  row,
  col,
  isStartNode: false,
  isEndNode: false,
  distance: Infinity,
  isVisited: false,
  isWall: false,
  previousNode: null,
});

const getInitialGrid = (rows, cols) => {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const PathfindingVisualizer = () => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(40);
  const [startNode, setStartNode] = useState({ row: 5, col: 5 });
  const [endNode, setEndNode] = useState({ row: 15, col: 35 });
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [algo, setAlgo] = useState(0);
  const [speed, setSpeed] = useState(10);
  const [stats, setStats] = useState({ visited: 0, pathLength: 0, time: 0 });

  const algorithms = [
    { name: "Dijkstra", fn: dijkstra, color: "#00d4ff", description: "Guarantees shortest path" },
    { name: "A* Search", fn: aStar, color: "#00ff88", description: "Heuristic-based, very fast" },
    { name: "BFS", fn: (g, s, e) => bfsdfs(g, s, e, "bfs"), color: "#ff6b35", description: "Explores level by level" },
    { name: "DFS", fn: (g, s, e) => bfsdfs(g, s, e, "dfs"), color: "#ff0080", description: "Explores as far as possible" },
  ];

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, [rows, cols]);

  const initializeGrid = useCallback(() => {
    const newGrid = getInitialGrid(rows, cols);
    newGrid[startNode.row][startNode.col].isStartNode = true;
    newGrid[endNode.row][endNode.col].isEndNode = true;
    setGrid(newGrid);
    setStats({ visited: 0, pathLength: 0, time: 0 });
  }, [rows, cols, startNode, endNode]);

  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    if (
      (row === startNode.row && col === startNode.col) ||
      (row === endNode.row && col === endNode.col)
    ) return;

    const newGrid = [...grid];
    newGrid[row][col].isWall = !newGrid[row][col].isWall;
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isRunning) return;
    if (
      (row === startNode.row && col === startNode.col) ||
      (row === endNode.row && col === endNode.col)
    ) return;

    const newGrid = [...grid];
    newGrid[row][col].isWall = true;
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const clearBoard = () => {
    if (isRunning) return;
    initializeGrid();
    // Clear visual classes
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const node = document.getElementById(`node-${row}-${col}`);
        if (node) {
          node.className = "pf-node";
          if (row === startNode.row && col === startNode.col) {
            node.classList.add("node-start");
          }
          if (row === endNode.row && col === endNode.col) {
            node.classList.add("node-end");
          }
        }
      }
    }
  };

  const clearPath = () => {
    if (isRunning) return;
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
      }))
    );
    setGrid(newGrid);
    setStats({ visited: 0, pathLength: 0, time: 0 });
    
    // Clear visual classes but keep walls
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const node = document.getElementById(`node-${row}-${col}`);
        if (node) {
          node.classList.remove("node-visited", "node-shortest-path");
        }
      }
    }
  };

  const generateMaze = (type) => {
    if (isRunning) return;
    clearBoard();
    
    setTimeout(() => {
      const newGrid = getInitialGrid(rows, cols);
      newGrid[startNode.row][startNode.col].isStartNode = true;
      newGrid[endNode.row][endNode.col].isEndNode = true;
      
      const pairs = type === "random" 
        ? randomMaze(newGrid, rows, cols) 
        : getMaze(newGrid, rows, cols);
      
      pairs.forEach((pair, i) => {
        setTimeout(() => {
          const node = document.getElementById(`node-${pair.xx}-${pair.yy}`);
          if (node && !newGrid[pair.xx][pair.yy].isStartNode && !newGrid[pair.xx][pair.yy].isEndNode) {
            node.classList.add("node-wall");
          }
        }, i * 10);
      });
      
      // Clear start/end walls
      newGrid[startNode.row][startNode.col].isWall = false;
      newGrid[endNode.row][endNode.col].isWall = false;
      setGrid(newGrid);
    }, 100);
  };

  const visualize = () => {
    if (isRunning) return;
    clearPath();
    setIsRunning(true);

    const startTime = performance.now();
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
      }))
    );

    const start = newGrid[startNode.row][startNode.col];
    const end = newGrid[endNode.row][endNode.col];
    
    const visitedNodesInOrder = algorithms[algo].fn(newGrid, start, end);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(end);
    const endTime = performance.now();

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    
    setStats({
      visited: visitedNodesInOrder.length,
      pathLength: nodesInShortestPathOrder.length,
      time: (endTime - startTime).toFixed(2),
    });
  };

  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element && !node.isStartNode && !node.isEndNode) {
          element.classList.add("node-visited");
        }
      }, speed * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          element.classList.add("node-shortest-path");
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          setIsRunning(false);
        }
      }, 50 * i);
    }
  };

  return (
    <div className="pathfinding-visualizer">
      {/* Header */}
      <div className="pf-header">
        <button onClick={() => navigate("/visualizer")} className="back-button cursor-target">
          <FaArrowLeft /> Back
        </button>
        <h1>
          <span className="gradient-text">Pathfinding</span> Visualizer
        </h1>
        <div className="pf-stats">
          <span className="stat-item">Visited: <strong>{stats.visited}</strong></span>
          <span className="stat-item">Path: <strong>{stats.pathLength}</strong></span>
          <span className="stat-item">Time: <strong>{stats.time}ms</strong></span>
        </div>
      </div>

      <div className="pf-content">
        {/* Control Panel */}
        <motion.div
          className="pf-control-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3><FaCog className="section-icon" /> Settings</h3>

          <div className="control-group">
            <label>Algorithm</label>
            <select
              value={algo}
              onChange={(e) => setAlgo(Number(e.target.value))}
              disabled={isRunning}
              className="select"
            >
              {algorithms.map((a, idx) => (
                <option key={idx} value={idx}>
                  {a.name}
                </option>
              ))}
            </select>
            <p className="algo-desc">{algorithms[algo].description}</p>
          </div>

          <div className="control-group">
            <label>Speed: {speed}ms</label>
            <input
              type="range"
              min="1"
              max="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          <div className="button-group">
            <button
              className="action-btn visualize-btn cursor-target"
              onClick={visualize}
              disabled={isRunning}
            >
              <FaPlay /> {isRunning ? "Running..." : "Visualize"}
            </button>
          </div>

          <h4>🧱 Maze Generation</h4>
          <div className="button-group">
            <button
              className="action-btn maze-btn cursor-target"
              onClick={() => generateMaze("recursive")}
              disabled={isRunning}
            >
              <FaRoute /> Recursive Maze
            </button>
            <button
              className="action-btn maze-btn cursor-target"
              onClick={() => generateMaze("random")}
              disabled={isRunning}
            >
              <FaRandom /> Random Walls
            </button>
          </div>

          <h4>🧹 Clear</h4>
          <div className="button-group">
            <button
              className="action-btn clear-btn cursor-target"
              onClick={clearPath}
              disabled={isRunning}
            >
              <FaEraser /> Clear Path
            </button>
            <button
              className="action-btn clear-btn cursor-target"
              onClick={clearBoard}
              disabled={isRunning}
            >
              <FaEraser /> Clear All
            </button>
          </div>

          <div className="legend">
            <h4><FaMapMarkerAlt className="section-icon" /> Legend</h4>
            <div className="legend-item">
              <span className="legend-box start"></span> Start Node
            </div>
            <div className="legend-item">
              <span className="legend-box end"></span> End Node
            </div>
            <div className="legend-item">
              <span className="legend-box wall"></span> Wall
            </div>
            <div className="legend-item">
              <span className="legend-box visited"></span> Visited
            </div>
            <div className="legend-item">
              <span className="legend-box path"></span> Shortest Path
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="pf-grid-container" ref={gridRef}>
          <div 
            className="pf-grid"
            onMouseLeave={() => setMouseIsPressed(false)}
          >
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="pf-row">
                {row.map((node, colIdx) => {
                  const { isStartNode, isEndNode, isWall } = node;
                  let extraClass = "";
                  if (isStartNode) extraClass = "node-start";
                  else if (isEndNode) extraClass = "node-end";
                  else if (isWall) extraClass = "node-wall";

                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      id={`node-${rowIdx}-${colIdx}`}
                      className={`pf-node ${extraClass}`}
                      onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                      onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                      onMouseUp={handleMouseUp}
                    />
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

export default PathfindingVisualizer;
