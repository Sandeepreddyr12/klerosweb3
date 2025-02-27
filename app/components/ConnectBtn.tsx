'use client';

import styles from '../page.module.css'
import {connectWallet,useAppContext} from '../utils/context/context';



const ConnectBtn = () => {

    const gameData = useAppContext();
   
    return (
      <div className={styles.form}>
        <p className={styles.note} style={{fontSize : '1.1rem'}}>
         Please connect the wallet, to proceed into the game.
        </p>

        <button
          onClick={() => connectWallet(gameData.setOwner)}
          className={styles.submit}
        >
          Connect
        </button>
      </div>
    );
}



export default ConnectBtn;