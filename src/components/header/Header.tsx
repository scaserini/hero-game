import React from 'react';
import styles from './Header.module.css';
import { AiFillFire } from 'react-icons/ai';

interface IProps {
  energyCount: number;
  score: number;
}

const Header: React.FC<IProps> = ({ energyCount, score }) => {
  return (
    <div className={styles.header}>
      <div>
        <AiFillFire className={styles['fire-icon']} /> x {energyCount}
      </div>
      <div>score : {score}</div>
    </div>
  );
};

export default Header;
