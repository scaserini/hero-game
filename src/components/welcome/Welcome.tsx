import styles from './Welcome.module.css';
import { AiFillFire } from 'react-icons/ai';
import { GrKeyboard } from 'react-icons/gr';
import { RiArrowUpFill, RiArrowRightFill, RiArrowDownFill, RiArrowLeftFill } from 'react-icons/ri';

const Welcome = () => {
  return (
    <>
      <div>
        <div className={styles['icon-box']}>
          <RiArrowUpFill className={styles.icon} />
          <RiArrowRightFill className={styles.icon} />
          <RiArrowDownFill className={styles.icon} />
          <RiArrowLeftFill className={styles.icon} />
        </div>
        <span>Move the Hero</span>
      </div>
      <div>
        <AiFillFire className={styles['fire-icon']} />
        <span>Collect fire energies</span>
      </div>
      <div>
        <div className={styles['icon-box']}>
          <GrKeyboard className={styles.icon} />
        </div>
        <span>
          Press 'F' to spit fire and
          <br />
          destroy all the monsters
        </span>
      </div>
      <div>
        <div className={styles['monster-icon']}></div>
        <span>
          Monsters will track you
          <br />
          down and kill you
        </span>
      </div>
    </>
  );
};

export default Welcome;
