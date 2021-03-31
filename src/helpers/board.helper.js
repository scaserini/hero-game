import { GAME_BOARD } from '../components/board/Board.constants';

function getHeroDirection(board, keyPressed, currentHeroRow, currentHeroCol) {
  let direction = { row: 0, col: 0 };
  // Check if the cell hero is moving to, has a valid index and is a land.
  switch (keyPressed) {
    case 'ArrowUp':
      if (currentHeroRow - 1 >= 0 && board[currentHeroRow - 1][currentHeroCol] === 1) direction.row = -1;
      break;
    case 'ArrowRight':
      if (currentHeroCol + 1 < board[0].length && board[currentHeroRow][currentHeroCol + 1] === 1) direction.col = 1;
      break;
    case 'ArrowDown':
      if (currentHeroRow + 1 < board.length && board[currentHeroRow + 1][currentHeroCol] === 1) direction.row = 1;
      break;
    case 'ArrowLeft':
      if (currentHeroCol - 1 >= 0 && board[currentHeroRow][currentHeroCol - 1] === 1) direction.col = -1;
      break;
    default:
      break;
  }
  return direction;
}

const landCells = (function () {
  let landCellsArray = [];
  for (let i = 0; i < GAME_BOARD.length; i++) {
    for (let j = 0; j < GAME_BOARD[0].length; j++) {
      if (GAME_BOARD[i][j] === 1) {
        landCellsArray.push({
          row: i,
          col: j,
        });
      }
    }
  }
  return landCellsArray;
})();

function getRandomLandCell() {
  return landCells[Math.floor(Math.random() * landCells.length)];
}

/**
 * Get a random cell not occupied by anyone else.
 * @param {Array} notAvailableCells - Array of BoardPosition
 * @returns {BoardPosition}
 */
function getFreeRandomLandCell(notAvailableCells = []) {
  // This will never be a time-consuming operation.
  // Only a few cells (hero and monsters) are occupied at the same time.
  while (true) {
    let { row: randRow, col: randCol } = getRandomLandCell();
    if (notAvailableCells.every((cell) => !(cell.row === randRow && cell.col === randCol))) {
      return {
        row: randRow,
        col: randCol,
      };
    }
  }
}

// Dinamically set size of cells based on board size.
function getCellSize() {
  return window.innerHeight / (GAME_BOARD.length * 9) + 'vmin';
}

export { getHeroDirection, landCells, getRandomLandCell, getFreeRandomLandCell, getCellSize };
