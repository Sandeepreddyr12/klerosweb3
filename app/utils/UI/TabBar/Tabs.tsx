'use client';

import {  useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useAppContext } from '../../context/context';
import { set } from 'firebase/database';
import styles from './tabs.module.css'

type TabsProps = {
  currentTab : string;
  tabState: Dispatch<SetStateAction<'start' | 'join' | 'solve' | 'friends'>>;
};

export function Tabs({ currentTab ,tabState } : TabsProps) {
  // const [currentTab, setCurrentTab] = useState('start');

  const data = useAppContext();

  // const TabHandler = () => {
  //   console.log(data.address);
  //   if (!data.address) return 'start';

  //   // For new game or undefined players
  //   if (!data.player1 && !data.player2) return 'start';

  //   // For player1
  //   if (data.player1 === data.address) {
  //     console.log('plaey1');
  //     if (data.gameState === 'yetToStart') return 'start';
  //     if (data.gameState === 'p2Joined') return 'solve';
  //     return 'start'; // Default to tab 1 for player1 in other states
  //   }

  //   // For player2
  //   if (data.player2 === data.address) {
  //     console.log('plaey2');
  //     if (data.gameState === 'started') return 'join';
  //     if (data.gameState === 'p2Joined') return 'solve';

  //     return 'start'; // Stay in tab 2 for all player2 states
  //   }

  //   // Default case
  //   return 'start';
  // };

  // useEffect(() => {
  //   tabState(currentTab);
    
  // }, [currentTab])
  


  return (
    <div className={styles.tabBar}>
      <ul className={styles[currentTab]}>
        <li onClick={() => tabState('start')}>
          <p className={currentTab === 'start' ? styles.activeClass : ''}>
            Start
          </p>
        </li>
        <li onClick={() => tabState('join')}>
          <p className={currentTab === 'join' ? styles.activeClass : ''}>
            Join
          </p>
        </li>
        <li onClick={() => tabState('solve')}>
          <p className={currentTab === 'solve' ? styles.activeClass : ''}>
            Solve
          </p>
        </li>
        <li onClick={() => tabState('friends')}>
          <p className={currentTab === 'friends' ? styles.activeClass : ''}>
            friends
          </p>
        </li>
      </ul>
    </div>
  );
}
