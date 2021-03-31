import React from 'react';
import { AiFillFire } from 'react-icons/ai';
import { getCellSize } from '../../helpers/board.helper';

interface IProps {
  cell: number;
  rowIdx: number;
  colIdx: number;
  holdHero: boolean;
  holdEnergy: boolean;
  holdMonster: boolean;
}

// React.memo prevents the re-render of all the cell whose state does't change.
// Cells on which neither the hero nor the monsters have landed on or moved from.
const Cell: React.FC<IProps> = React.memo(({ cell, rowIdx, colIdx, holdHero, holdEnergy, holdMonster }) => {
  return (
    <div
      className={`cell ${rowIdx}-${colIdx} ${cell === 0 ? 'sea' : 'land'}`}
      style={{ height: `${getCellSize()}`, width: `${getCellSize()}` }}
    >
      <AiFillFire className="fire" />
      {holdHero ? (
        <div className="cell-content hero">H</div>
      ) : holdMonster ? (
        <div className="cell-content monster"></div>
      ) : holdEnergy ? (
        <AiFillFire className="cell-content energy" />
      ) : null}
    </div>
  );
});

export default Cell;
