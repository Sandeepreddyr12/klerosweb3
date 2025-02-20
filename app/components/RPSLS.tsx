'use client';

import styles from '../page.module.css';
import CurvedArrowSvg, { StraightArrowSvg } from '../utils/arrowSvg/arrow';
// import GameInput from '../utils/UI/gameInputToggle/gameInput';


type RPSLSGameProps = {
  selectedCircle: string | null;
  setSelectedCircle: (circle: string | null) => void;
};

const RPSLSGame = ({ selectedCircle, setSelectedCircle }: RPSLSGameProps) => {

  return (
    <div className={styles.main}>
      
      <div className={styles.rpsContainer}>
        {/* Circles */}
        {['🥌 Rock', '📰 Paper', '✂ Scissors', '🦎 Lizard', '🖖🏻 Spock'].map(
          (item) => {
            const [icon, name] = item.split(' ');
            return (
              <div
                key={name}
                className={[styles.circle, styles[name.toLowerCase()]].join(
                  ' '
                )}
                onClick={() => setSelectedCircle(item)}
                style={{
                  backgroundColor:
                    selectedCircle === name.toLowerCase()
                      ? 'lightgray'
                      : 'lightblue',
                  color: name === 'Lizard' ? 'blue' : 'inherit',
                }}
              >
                {icon}
              </div>
            );
          }
        )}

        {/* Arrows */}
         <CurvedArrowSvg className={styles.paperRockArrow} />
        <CurvedArrowSvg className={styles.scissorsPaperArrow} />
        <CurvedArrowSvg className={styles.spockScissorsArrow} />
        <CurvedArrowSvg className={styles.lizardSpockArrow} />
        <CurvedArrowSvg className={styles.rockLizardArrow} />

        <StraightArrowSvg className={styles.rockScissorsArrow} />
        <StraightArrowSvg className={styles.scissorsLizardArrow} />
        <StraightArrowSvg className={styles.paperSpockArrow} />
        <StraightArrowSvg className={styles.spockRockArrow} />
        <StraightArrowSvg className={styles.lizardPaperArrow} />
      </div>
    </div>
  );
};

export default RPSLSGame;
