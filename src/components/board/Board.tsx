import React, { useState, useEffect, useCallback } from 'react';
import Cell from '../cell/Cell';
import Header from '../header/Header';
import Modal from '../modal/Modal';
import GameOver from '../gameOver/GameOver';
import Welcome from '../welcome/Welcome';
import { GAME_BOARD, NUMBER_OF_MONSTERS, MONSTER_CREATION_INTERVAL, MONSTER_MOVE_INTERVAL } from './Board.constants';
import { getCellSize, getHeroDirection, getFreeRandomLandCell } from '../../helpers/board.helper';
import bfs from '../../helpers/bfs.helper';
import dijkstra from '../../helpers/dijkstra.helper';
import { useInterval } from '../../hooks/useInterval';

interface BoardPosition {
  row: number;
  col: number;
}

interface Monster {
  pos: BoardPosition;
  path: number[][];
}

export default function Board() {
  const [heroPosition, setHeroPosition] = useState<BoardPosition>(getFreeRandomLandCell());
  const [energyPosition, setEnergyPosition] = useState<BoardPosition>(getFreeRandomLandCell([heroPosition]));
  const [energyCount, setEnergyCount] = useState(0);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const createMonster = () => {
    // pos is the BoardPosition of the new monster.
    let pos = getFreeRandomLandCell([heroPosition, ...monsters.map((monster) => monster.pos)]);
    let path = dijkstra(heroPosition, pos);
    return { pos, path };
  };

  function startFire(heroPosition: BoardPosition) {
    setEnergyCount((prevEnergyCount) => {
      if (prevEnergyCount > 0) {
        // During the fire animation, set isRunning to false: the hero and the monsters freeze.
        setIsRunning(false);

        let { row, col } = heroPosition;
        let { fireCells, fireCellsSet, lastLevel } = bfs(GAME_BOARD, row, col, prevEnergyCount);

        // Animation: show fire cells in level order.
        Object.values(fireCells).forEach((currentLevelCells, idx) => {
          setTimeout(() => {
            for (let [row, col] of currentLevelCells) {
              // Mark cells as fire-cells via CSS, to avoid a high number of re-renders that would slow down the animation.
              document.getElementsByClassName(`${row}-${col}`)[0]?.classList.add('fire-cell');
            }
          }, (idx + 1) * 140);
        });

        // Remove all the monsters killed by fire.
        setTimeout(() => {
          setMonsters((prevMonsters) => {
            return prevMonsters.filter((monster) => !fireCellsSet.has(`${monster.pos.row}:${monster.pos.col}`));
          });
          document.querySelectorAll('.cell').forEach((element) => element.classList.remove('fire-cell'));
          setIsRunning(true);
        }, lastLevel * 140 + 400);

        // Use 1 energy for every traversal level.
        return prevEnergyCount - lastLevel;
      }
      return 0;
    });
  }

  const handleKeydown = useCallback(
    (ev: KeyboardEvent) => {
      if (!isRunning) return;
      let { code } = ev;
      if (code === 'KeyF') {
        startFire(heroPosition);
      } else {
        setHeroPosition((currentHeroPosition) => {
          let { row: currentHeroRow, col: currentHeroCol } = currentHeroPosition;
          let direction = getHeroDirection(GAME_BOARD, code, currentHeroRow, currentHeroCol);
          return {
            row: currentHeroRow + direction.row,
            col: currentHeroCol + direction.col,
          };
        });
      }
    },
    [heroPosition, isRunning]
  );

  const cellHoldMonster = useCallback(
    (row: number, col: number) => {
      return monsters.some((monster) => row === monster.pos.row && col === monster.pos.col);
    },
    [monsters]
  );

  function gameOver() {
    setIsGameStarted(false);
    setEndGame(true);
    setMonsters([]);
    setIsRunning(false);
  }

  // When the hero moves, check for the energy cell and monsters cells.
  // When the hero collect a energy, generate a new one in a random cell.
  // When the hero encounters a monster, game over!
  useEffect(() => {
    let { row: heroRow, col: heroCol } = heroPosition;
    let { row: energyRow, col: energyCol } = energyPosition;
    if (heroRow === energyRow && heroCol === energyCol) {
      setEnergyCount((count) => count + 1);
      setScore((score) => score + 1);
      setEnergyPosition(getFreeRandomLandCell([heroPosition]));
    } else if (cellHoldMonster(heroRow, heroCol)) {
      gameOver();
    }
  }, [heroPosition, energyPosition, cellHoldMonster]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  // Create a new monster every MONSTER_CREATION_INTERVAL ms.
  useInterval(
    () => {
      // No more than NUMBER_OF_MONSTERS monsters on the board at the same time.
      setMonsters((prevMonsters) =>
        prevMonsters.length < NUMBER_OF_MONSTERS ? [...prevMonsters, createMonster()] : prevMonsters
      );
    },
    isRunning ? MONSTER_CREATION_INTERVAL : null
  );

  // Every MONSTER_MOVE_INTERVAL ms, move mosters throught their path.
  useInterval(
    () => {
      setMonsters((prevMonsters) => {
        // Re-calculate monsters path.
        return prevMonsters.map((monster) => {
          let newPath = dijkstra(heroPosition, monster.pos, monster.path);
          let [nextRow, nextCol] = newPath[0];
          return {
            pos: {
              row: nextRow,
              col: nextCol,
            },
            path: newPath.slice(1),
          };
        });
      });
    },
    isRunning ? MONSTER_MOVE_INTERVAL : null
  );

  function startGame() {
    setIsGameStarted(true);
    setIsRunning(true);
    setEndGame(false);
    setEnergyCount(0);
    setScore(0);
  }

  return (
    <>
      {endGame ? (
        <Modal startGame={startGame} modalTitle="G A M E - O V E R" gridVisualization={false}>
          <GameOver score={score} />
        </Modal>
      ) : !isGameStarted ? (
        <Modal startGame={startGame} modalTitle="H E R O G A M E" gridVisualization={true}>
          <Welcome />
        </Modal>
      ) : null}
      <Header energyCount={energyCount} score={score} />
      <div className="board" style={{ gridTemplateColumns: `repeat(${GAME_BOARD[0].length}, ${getCellSize()})` }}>
        {GAME_BOARD.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <Cell
              key={colIdx}
              cell={cell}
              rowIdx={rowIdx}
              colIdx={colIdx}
              holdHero={rowIdx === heroPosition.row && colIdx === heroPosition.col}
              holdEnergy={rowIdx === energyPosition.row && colIdx === energyPosition.col}
              holdMonster={cellHoldMonster(rowIdx, colIdx)}
            />
          ))
        )}
      </div>
    </>
  );
}
