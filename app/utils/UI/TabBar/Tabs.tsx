'use client';

import {  SetStateAction, Dispatch } from 'react';
import styles from './tabs.module.css'

type TabsProps = {
  currentTab : string;
  tabState: Dispatch<SetStateAction<'start' | 'join' | 'solve' | 'friends'>>;
};

export function Tabs({ currentTab ,tabState } : TabsProps) {  
  

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
