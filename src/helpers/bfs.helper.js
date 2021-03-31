// Breath-First Search algorithm.
const bfs = (board, row, col, energy) => {
  let queue = [];
  // Fire cells divided for traversal level.
  let fireCells = {};
  // A list of fire cells - used to optimize the search for monsters to kill.
  let visitedCells = new Set();
  queue.push({
    pos: [row, col],
    level: 0,
  });

  while (queue.length > 0) {
    let { pos, level } = queue.shift();
    let [currentRow, currentCol] = pos;
    let key = `${currentRow}:${currentCol}`;

    if (visitedCells.has(key)) continue;
    visitedCells.add(key);

    /**
     *  fireCells mock object.
     *   '0': [[5,5]], <hero position>
     *   '1': [[4,5], [6,5]], <all cells of level 1>
     *   '2': [[3,5], [4,4], [6,6], [7,5]]] <all cells of level 2>
     */
    if (!fireCells[level]) fireCells[level] = [];
    fireCells[level].push(pos);

    // You don't have enough energy! You can't traverse the next level.
    if (level >= energy) continue;

    // bfs only on up, right, down and left cells.
    if (canTraverse(board, visitedCells, currentRow - 1, currentCol)) {
      queue.push({
        pos: [currentRow - 1, currentCol],
        level: level + 1,
      });
    }
    if (canTraverse(board, visitedCells, currentRow, currentCol + 1)) {
      queue.push({
        pos: [currentRow, currentCol + 1],
        level: level + 1,
      });
    }
    if (canTraverse(board, visitedCells, currentRow + 1, currentCol)) {
      queue.push({
        pos: [currentRow + 1, currentCol],
        level: level + 1,
      });
    }
    if (canTraverse(board, visitedCells, currentRow, currentCol - 1)) {
      queue.push({
        pos: [currentRow, currentCol - 1],
        level: level + 1,
      });
    }
  }

  // Remove hero position.
  delete fireCells['0'];

  return {
    fireCells,
    fireCellsSet: visitedCells,
    lastLevel: Object.keys(fireCells).length,
  };
};

function canTraverse(board, visitedCells, row, col) {
  return (
    row >= 0 &&
    col >= 0 &&
    row < board.length &&
    col < board[0].length &&
    board[row][col] === 1 &&
    !visitedCells.has(`${row}:${col}`)
  );
}

export default bfs;
