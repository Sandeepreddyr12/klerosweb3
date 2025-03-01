import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { db } from '@/firebase';
import { toast } from 'react-toastify';
import { ref, onValue } from 'firebase/database';

import styles from '../page.module.css';
import { useAppContext } from '../utils/context/context';




type TabsProps = {
  tabState: Dispatch<SetStateAction<'start' | 'join' | 'solve' | 'friends'>>;
};

const Friends = ({ tabState }: TabsProps) => {
  const Data = useAppContext();
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const starCountRef = ref(db, process.env.NEXT_PUBLIC_PLAYERS_PATH);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();


      setPlayers(data);
    });

  }, []);



  return (
    <div className={styles.friendsContainer}>
      <ul id={styles.friends}>
        {(players && Object.keys(players).length > 0 ) ?
          ( Object.keys(players).map((key: string) => {
            if (key === Data.owner) {
              return (
                <li
                  onClick={() => {
                    toast.info('You cant play with yourself');
                  }}
                  key={key}
                >
                  hey its you
                </li>
              );
            } else {
              return (
                <li
                  onClick={() => {
                    tabState('start');
                    toast.info(`You've chosen to play with ${key}. Redirecting to start game...`);
                     Data.setSelectedAddress(key);
                  }}
                  key={key}
                >
                  {key} <p style={{ fontSize: '.6rem', marginLeft : '1rem' }}>🟢</p>
                </li>
              );
            }
          })): (<form className={styles.form}>
        
        <p className={styles.note} style={{fontSize :"1rem"}}>
          No players online or please check your internet connection
        </p>
</form>) }
      </ul>
    </div>
  );
};


export default Friends;
