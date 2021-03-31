import React from 'react';
import styles from './GameOver.module.css';
import { RiMedal2Fill } from 'react-icons/ri';

interface IProps {
  score: number;
}

const GameOver: React.FC<IProps> = ({ score }) => {
  return (
    <div className={styles.score}>
      <RiMedal2Fill className={styles.icon} />
      <h3>SCORE : {score}</h3>
    </div>
  );
};

export default GameOver;
