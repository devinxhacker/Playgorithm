// Pathfinding Algorithms

// Dijkstra's Algorithm
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
  return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Get shortest path by backtracking
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

// A* Algorithm
export function aStar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  
  while (unvisitedNodes.length) {
    sortNodesByDistanceAStar(unvisitedNodes, finishNode);
    const closestNode = unvisitedNodes.shift();
    
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
  return visitedNodesInOrder;
}

function sortNodesByDistanceAStar(unvisitedNodes, finishNode) {
  unvisitedNodes.sort((nodeA, nodeB) => {
    const fA = nodeA.distance + Math.abs(finishNode.row - nodeA.row) + Math.abs(finishNode.col - nodeA.col);
    const fB = nodeB.distance + Math.abs(finishNode.row - nodeB.row) + Math.abs(finishNode.col - nodeB.col);
    return fA - fB;
  });
}

// BFS & DFS
export function bfsdfs(grid, startNode, endNode, algo) {
  const list = [];
  const nodesInOrder = [];
  nodesInOrder.push(startNode);
  list.push(startNode);
  startNode.isVisited = true;
  
  while (list.length) {
    const currentNode = algo === "bfs" ? list.shift() : list.pop();
    nodesInOrder.push(currentNode);
    
    if (currentNode === endNode) return nodesInOrder;
    if (algo === "dfs") currentNode.isVisited = true;
    
    const nodesToPush = getNeighboursBFS(grid, currentNode);
    for (const node of nodesToPush) {
      if (algo === "bfs") {
        node.isVisited = true;
      }
      node.previousNode = currentNode;
      list.push(node);
    }
  }
  return nodesInOrder;
}

function getNeighboursBFS(grid, node) {
  const neighbors = [];
  const { col, row } = node;
  
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors.filter((neighbor) => !neighbor.isVisited && !neighbor.isWall);
}

// Random Maze Generator
export function randomMaze(grid, row, col) {
  const pairs = [];
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (Math.random() < 0.3) {
        grid[i][j].isWall = true;
        pairs.push({ xx: i, yy: j });
      }
    }
  }
  return pairs;
}

// Recursive Division Maze Generator
export function getMaze(grid, row, col) {
  const pairs = [];
  
  // Add border walls
  for (let i = 0; i < row; i++) {
    if (!grid[i][0].isStartNode && !grid[i][0].isEndNode) {
      grid[i][0].isWall = true;
      pairs.push({ xx: i, yy: 0 });
    }
    if (!grid[i][col - 1].isStartNode && !grid[i][col - 1].isEndNode) {
      grid[i][col - 1].isWall = true;
      pairs.push({ xx: i, yy: col - 1 });
    }
  }
  
  for (let j = 0; j < col; j++) {
    if (!grid[0][j].isStartNode && !grid[0][j].isEndNode) {
      grid[0][j].isWall = true;
      pairs.push({ xx: 0, yy: j });
    }
    if (!grid[row - 1][j].isStartNode && !grid[row - 1][j].isEndNode) {
      grid[row - 1][j].isWall = true;
      pairs.push({ xx: row - 1, yy: j });
    }
  }
  
  divide(grid, 1, row - 2, 1, col - 2, pairs, chooseOrientation(col - 2, row - 2));
  return pairs;
}

function divide(grid, rowStart, rowEnd, colStart, colEnd, pairs, orientation) {
  if (rowEnd < rowStart || colEnd < colStart) return;
  
  const horizontal = orientation === "horizontal";
  
  // Where will the wall be drawn from?
  let wx = horizontal ? rowStart + randomNumber(rowEnd - rowStart) : rowStart;
  let wy = horizontal ? colStart : colStart + randomNumber(colEnd - colStart);
  
  // Where will the passage be?
  const px = horizontal ? wx : rowStart + randomNumber(rowEnd - rowStart);
  const py = horizontal ? colStart + randomNumber(colEnd - colStart) : wy;
  
  // Direction
  const dx = horizontal ? 0 : 1;
  const dy = horizontal ? 1 : 0;
  
  // Length
  const length = horizontal ? colEnd - colStart + 1 : rowEnd - rowStart + 1;
  
  for (let i = 0; i < length; i++) {
    if (wx !== px || wy !== py) {
      if (!grid[wx][wy].isStartNode && !grid[wx][wy].isEndNode) {
        grid[wx][wy].isWall = true;
        pairs.push({ xx: wx, yy: wy });
      }
    }
    wx += dx;
    wy += dy;
  }
  
  let nx = horizontal ? rowStart : wx + 1;
  let ny = horizontal ? wy + 1 : colStart;
  divide(grid, nx, horizontal ? wx - 1 : rowEnd, ny, horizontal ? colEnd : wy - 1, pairs, 
         chooseOrientation(horizontal ? colEnd - ny + 1 : wy - 1 - ny, horizontal ? wx - 1 - nx : rowEnd - nx + 1));
  
  nx = horizontal ? wx + 1 : rowStart;
  ny = horizontal ? colStart : wy + 1;
  divide(grid, nx, rowEnd, ny, horizontal ? colEnd : colEnd, pairs,
         chooseOrientation(horizontal ? colEnd - ny + 1 : colEnd - ny, horizontal ? rowEnd - nx + 1 : rowEnd - nx + 1));
}

function chooseOrientation(width, height) {
  if (width < height) return "horizontal";
  if (height < width) return "vertical";
  return Math.random() > 0.5 ? "horizontal" : "vertical";
}

function randomNumber(max) {
  return Math.floor(Math.random() * (max + 1));
}
