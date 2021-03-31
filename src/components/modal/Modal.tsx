import React from 'react';
import styles from './Modal.module.css';

interface IProps {
  modalTitle: string;
  gridVisualization: boolean;
  startGame: () => void;
}

const Modal: React.FC<IProps> = ({ modalTitle, gridVisualization, startGame, children }) => {
  return (
    <div className={styles.modal}>
      <div className={styles['modal-content']}>
        <div className={styles.title}>{modalTitle}</div>
        <div className={gridVisualization ? styles['grid-body'] : undefined}>{children}</div>
        <button className={styles.button} onClick={startGame}>
          Start game!
        </button>
      </div>
    </div>
  );
};

export default Modal;
