import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlay, FaRedo, FaCog, FaBook, FaChartLine } from "react-icons/fa";
import "./RecursionTreeVisualizer.css";

// Tree node structure
class TreeNode {
  constructor(value, label, children = []) {
    this.value = value;
    this.label = label;
    this.children = children;
    this.x = 0;
    this.y = 0;
  }
}

// Generate Fibonacci tree
const generateFibTree = (n, depth = 0) => {
  if (n <= 1) {
    return { node: new TreeNode(n, `fib(${n})`), result: n };
  }
  
  const left = generateFibTree(n - 1, depth + 1);
  const right = generateFibTree(n - 2, depth + 1);
  const result = left.result + right.result;
  
  const node = new TreeNode(result, `fib(${n})`, [left.node, right.node]);
  return { node, result };
};

// Generate Factorial tree
const generateFactorialTree = (n) => {
  if (n <= 1) {
    return { node: new TreeNode(1, `${n}!`), result: 1 };
  }
  
  const child = generateFactorialTree(n - 1);
  const result = n * child.result;
  
  const node = new TreeNode(result, `${n}!`, [child.node]);
  return { node, result };
};

// Generate nCr tree
const generateNcrTree = (n, r) => {
  if (r > n) return { node: new TreeNode(0, `C(${n},${r})`), result: 0 };
  if (r === 0 || n === r) return { node: new TreeNode(1, `C(${n},${r})`), result: 1 };
  
  const left = generateNcrTree(n - 1, r - 1);
  const right = generateNcrTree(n - 1, r);
  const result = left.result + right.result;
  
  const node = new TreeNode(result, `C(${n},${r})`, [left.node, right.node]);
  return { node, result };
};

// Layout tree with positions
const layoutTree = (node, depth = 0, position = 0, positions = new Map()) => {
  const xSpacing = 80;
  const ySpacing = 80;
  
  if (!node) return { width: 0 };
  
  if (node.children.length === 0) {
    node.x = position * xSpacing;
    node.y = depth * ySpacing;
    return { width: 1, node };
  }
  
  let totalWidth = 0;
  const childResults = [];
  
  for (const child of node.children) {
    const result = layoutTree(child, depth + 1, position + totalWidth);
    childResults.push(result);
    totalWidth += result.width;
  }
  
  // Center parent above children
  const leftMost = node.children[0].x;
  const rightMost = node.children[node.children.length - 1].x;
  node.x = (leftMost + rightMost) / 2;
  node.y = depth * ySpacing;
  
  return { width: totalWidth, node };
};

// Flatten tree to array for rendering
const flattenTree = (node, nodes = [], edges = []) => {
  if (!node) return { nodes, edges };
  
  nodes.push(node);
  
  for (const child of node.children) {
    edges.push({ from: node, to: child });
    flattenTree(child, nodes, edges);
  }
  
  return { nodes, edges };
};

const RecursionTreeVisualizer = () => {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const [algorithm, setAlgorithm] = useState("fibonacci");
  const [inputN, setInputN] = useState(5);
  const [inputR, setInputR] = useState(2);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [currentNode, setCurrentNode] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [viewBox, setViewBox] = useState("0 0 800 500");
  const [result, setResult] = useState(null);

  const algorithms = [
    { id: "fibonacci", name: "Fibonacci", maxN: 8 },
    { id: "factorial", name: "Factorial", maxN: 10 },
    { id: "ncr", name: "nCr (Binomial)", maxN: 6 },
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const generateTree = () => {
    let treeData;
    
    switch (algorithm) {
      case "fibonacci":
        treeData = generateFibTree(inputN);
        break;
      case "factorial":
        treeData = generateFactorialTree(inputN);
        break;
      case "ncr":
        treeData = generateNcrTree(inputN, inputR);
        break;
      default:
        treeData = generateFibTree(inputN);
    }
    
    layoutTree(treeData.node);
    const { nodes: flatNodes, edges: flatEdges } = flattenTree(treeData.node);
    
    // Calculate viewBox
    if (flatNodes.length > 0) {
      const minX = Math.min(...flatNodes.map(n => n.x)) - 50;
      const maxX = Math.max(...flatNodes.map(n => n.x)) + 50;
      const maxY = Math.max(...flatNodes.map(n => n.y)) + 80;
      setViewBox(`${minX} -30 ${maxX - minX + 100} ${maxY + 60}`);
    }
    
    return { nodes: flatNodes, edges: flatEdges, result: treeData.result };
  };

  const visualize = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setNodes([]);
    setEdges([]);
    setCurrentNode(-1);
    setResult(null);
    
    const { nodes: allNodes, edges: allEdges, result: finalResult } = generateTree();
    
    // Animate nodes appearing one by one (DFS order)
    for (let i = 0; i < allNodes.length; i++) {
      setCurrentNode(i);
      setNodes(allNodes.slice(0, i + 1));
      setEdges(allEdges.filter(e => 
        allNodes.slice(0, i + 1).includes(e.from) && 
        allNodes.slice(0, i + 1).includes(e.to)
      ));
      await sleep(speed);
    }
    
    setCurrentNode(-1);
    setResult(finalResult);
    setIsRunning(false);
  };

  const reset = () => {
    setNodes([]);
    setEdges([]);
    setCurrentNode(-1);
    setResult(null);
  };

  return (
    <div className="recursion-tree-visualizer">
      {/* Header */}
      <div className="rt-header">
        <button onClick={() => navigate("/visualizer")} className="back-button cursor-target">
          <FaArrowLeft /> Back
        </button>
        <h1>
          <span className="gradient-text">Recursion Tree</span> Visualizer
        </h1>
        {result !== null && (
          <div className="rt-result">
            Result: <strong>{result}</strong>
          </div>
        )}
      </div>

      <div className="rt-content">
        {/* Control Panel */}
        <motion.div
          className="rt-control-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3><FaCog className="section-icon" /> Settings</h3>

          <div className="control-group">
            <label>Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value);
                reset();
              }}
              disabled={isRunning}
              className="select"
            >
              {algorithms.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>n = {inputN}</label>
            <input
              type="range"
              min="1"
              max={algorithms.find(a => a.id === algorithm)?.maxN || 8}
              value={inputN}
              onChange={(e) => setInputN(Number(e.target.value))}
              disabled={isRunning}
              className="slider"
            />
          </div>

          {algorithm === "ncr" && (
            <div className="control-group">
              <label>r = {inputR}</label>
              <input
                type="range"
                min="0"
                max={inputN}
                value={inputR}
                onChange={(e) => setInputR(Number(e.target.value))}
                disabled={isRunning}
                className="slider"
              />
            </div>
          )}

          <div className="control-group">
            <label>Speed: {speed}ms</label>
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
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
            <button
              className="action-btn reset-btn cursor-target"
              onClick={reset}
              disabled={isRunning}
            >
              <FaRedo /> Reset
            </button>
          </div>

          <div className="algorithm-info">
            <h4><FaBook className="section-icon" /> About</h4>
            {algorithm === "fibonacci" && (
              <p>F(n) = F(n-1) + F(n-2)<br/>Base: F(0)=0, F(1)=1</p>
            )}
            {algorithm === "factorial" && (
              <p>n! = n × (n-1)!<br/>Base: 0! = 1! = 1</p>
            )}
            {algorithm === "ncr" && (
              <p>C(n,r) = C(n-1,r-1) + C(n-1,r)<br/>Base: C(n,0) = C(n,n) = 1</p>
            )}
          </div>

          <div className="complexity-info">
            <h4><FaChartLine className="section-icon" /> Complexity</h4>
            {algorithm === "fibonacci" && <p>Time: O(2ⁿ) - Exponential</p>}
            {algorithm === "factorial" && <p>Time: O(n) - Linear</p>}
            {algorithm === "ncr" && <p>Time: O(2ⁿ) - Exponential</p>}
          </div>
        </motion.div>

        {/* Tree Visualization */}
        <div className="rt-canvas-container">
          <svg
            ref={svgRef}
            viewBox={viewBox}
            className="rt-svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Edges */}
            {edges.map((edge, idx) => (
              <motion.line
                key={`edge-${idx}`}
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                className="tree-edge"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
            
            {/* Nodes */}
            {nodes.map((node, idx) => (
              <motion.g
                key={`node-${idx}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={28}
                  className={`tree-node ${idx === currentNode ? "current" : ""} ${node.children.length === 0 ? "leaf" : ""}`}
                />
                <text
                  x={node.x}
                  y={node.y - 5}
                  className="node-label"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
                <text
                  x={node.x}
                  y={node.y + 12}
                  className="node-value"
                  textAnchor="middle"
                >
                  = {node.value}
                </text>
              </motion.g>
            ))}
          </svg>

          {nodes.length === 0 && (
            <div className="empty-state">
              <p>Click "Visualize" to see the recursion tree</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecursionTreeVisualizer;
