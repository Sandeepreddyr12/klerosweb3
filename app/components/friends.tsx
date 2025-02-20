import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import styles from '../page.module.css';
import { db } from '@/firebase';
import { ref, set,get, onValue,onDisconnect,serverTimestamp } from 'firebase/database';
import { useAppContext } from '../utils/context/context';
import { toast } from 'react-toastify';




type TabsProps = {
  tabState: Dispatch<SetStateAction<'start' | 'join' | 'solve' | 'friends'>>;
};

const Friends = ({ tabState }: TabsProps) => {
  const Data = useAppContext();
  const [players, setPlayers] = useState({});

  useEffect(() => {
    // if(!AppState.owner)return;
    const starCountRef = ref(db, 'players/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();

      console.log('bbbbbbbbbbb');

      setPlayers(data);
    });

    console.log(Data.selectedAddress);
  }, []);


  console.log(players, players !== undefined && players !== null);

  return (
    <div className={styles.box}>
      <ul id={styles.friends}>
        {(players && Object.keys(players).length > 0 ) ?
          ( Object.keys(players).map((key: string) => {
            if (key === Data.owner) {
              return (
                <li
                  onClick={() => {
                    console.log('clicked u cant play with yourself,');
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
                    console.log('clicked', key);
                    tabState('start');
                    toast.info(`You've chosen to play with ${key}. Redirecting to start game...`);
                     Data.setSelectedAddress(key);
                  }}
                  key={key}
                >
                  {key} <p style={{ fontSize: '.6rem' }}>🟢</p>
                </li>
              );
            }
          })): (<form className={styles.form}>
        
        <p className={styles.note} style={{fontSize :"1rem"}}>
          No players in online or check your internet
        </p>
</form>) }
      </ul>
    </div>
  );
};


export default Friends;
