import { GAME_BOARD } from '../components/board/Board.constants';
import { landCells } from './board.helper';

// Adjacency list - for every cell, a list of neighboring land cells.
// Cells are saved as '<row>:<col>' strings.
const adjList = (() => {
  let graph = {};
  for (let cell of landCells) {
    let { row, col } = cell;
    let key = `${row}:${col}`;
    if (!graph[key]) graph[key] = [];

    if (canTraverse(GAME_BOARD, row - 1, col)) {
      graph[key].push(`${row - 1}:${col}`);
    }
    if (canTraverse(GAME_BOARD, row, col + 1)) {
      graph[key].push(`${row}:${col + 1}`);
    }
    if (canTraverse(GAME_BOARD, row + 1, col)) {
      graph[key].push(`${row + 1}:${col}`);
    }
    if (canTraverse(GAME_BOARD, row, col - 1)) {
      graph[key].push(`${row}:${col - 1}`);
    }
  }
  return graph;
})();

function canTraverse(board, row, col) {
  return row >= 0 && col >= 0 && row < board.length && col < board[0].length && board[row][col] === 1;
}

// Dijkstra's Algorithm is weighted and guarantees the shortest path.
export default function dijkstra(heroPosition, monsterPosition, previousPath = []) {
  let { row: heroRow, col: heroCol } = heroPosition;
  let { row: monstRow, col: monstCol } = monsterPosition;
  // Cells are saved as '<row>:<col>' strings.
  let visitedNodes = new Set();
  // Create a parent table, and update it when a cell is visited.
  // Table's keys are the cell, and values are their parent (both saved as '<row>:<col>' strings).
  // The parent of a cell is the previous cell in the path.
  let parents = {};

  // If hero is moving on the actual 'shortest path', don't re-calculate it.
  for (let i = 0; i < previousPath.length; i++) {
    let [row, col] = previousPath[i];
    if (heroRow === row && heroCol === col) {
      return previousPath.slice(0, i + 1);
    }
  }

  // Don't need to keep track of costs, because all edges cost is 1.
  // Once the hero cell if found, we can't stop searching, because we have already found the shortest path.
  let queue = [];
  queue.push(`${monstRow}:${monstCol}`);

  while (queue.length > 0) {
    let key = queue.shift();
    let found = false;

    if (visitedNodes.has(key)) continue;
    visitedNodes.add(key);

    if (adjList[key] !== undefined) {
      // For each neighboring land cell..
      for (let cell of adjList[key]) {
        // In adjList, cells are saved as '<row>:<col>' strings.
        if (!visitedNodes.has(cell)) {
          queue.push(cell);
          parents[cell] = key;
        }
        if (cell === `${heroRow}:${heroCol}`) found = true;
      }
    }
    if (found) break;
  }

  // To find the shortest path, pick the last cell found (hero position) and go back to the starting node (monster position).
  let endKey = `${heroRow}:${heroCol}`;
  let startKey = `${monstRow}:${monstCol}`;
  let currentKey = endKey;
  let path = [];
  while (currentKey !== startKey) {
    path.unshift(currentKey);
    currentKey = parents[currentKey];
  }

  // Convert all '<row>:<col>' strings into an arrays of [row, col].
  // Return the path from the monster cell to the hero cell (array of array).
  return path.map((item) => item.split(':').map(Number));
}
