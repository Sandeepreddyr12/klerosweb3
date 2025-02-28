'use client';

import { ref, update } from 'firebase/database';
import { ethers, Contract } from 'ethers';
import { db } from '@/firebase';
import { toast } from 'react-toastify';

import styles from '../page.module.css';
import { useAppContext, type gameStateType } from '../utils/context/context';
import { resetGameState } from '../utils/localStorage';
import RPSArtifact from '../../Contract/build/RPS.json';

// This component lets the user recover their funds if the other player has not responded within 5 minutes.

export default function RecoverBtn() {
  const Data = useAppContext();


  const recoverFunds = async (e: React.FormEvent) => {
    e.preventDefault();

  
    const address = Data.owner;

    if (!address) {
      toast.warn('Please login with wallet to continue.');
      return;
    }


    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to continue');
        return
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Request account access
      await provider.send('eth_requestAccounts', []);
      // Get the signer
      const signer = await provider.getSigner();


      const RPSContract = new Contract(
        Data.GameData.RPSaddress,
        RPSArtifact.abi,
        signer
      );

      if (address === Data.GameData.player1) {
        await RPSContract.j2Timeout();

        resetGameState(Data.currentGameId + Data.GameData.player1);

        const data = {
          gameState: 'recovered' as gameStateType,
          won_Recovered_By: Data.GameData.player1,
          timer: Date.now(),
        };
        await update(ref(db, 'game/' + Data.currentGameId), data);


        toast.success('Funds recovered successfully');

      } else if (address === Data.GameData.player2) {
        await RPSContract.j1Timeout();


        const data = {
          gameState:'recovered' as gameStateType,
          won_Recovered_By: Data.GameData.player2,
          timer : Date.now()
        };
        await update(ref(db, 'game/' + Data.currentGameId), data);
         toast.success('Funds recovered successfully');
      }

      const gameUpdate = {
        
          status: 'recovered',
        
      }

      await update(
        ref(db, 'players/' + Data.GameData.player1+ '/' + Data.currentGameId),
        gameUpdate
      );
      await update(
        ref(db, 'players/' + Data.GameData.player2 + '/' + Data.currentGameId),
        gameUpdate
      );



    } catch (error) {
      console.error('Error recovering funds:', error);
        toast.error('Failed to recover funds. Please try again.');
    }
  };

  const disableRecoverBtn = (): boolean => {

    if (Data.GameData.won_Recovered_By !== '' || !Data.GameData.timer) return true;

    if ( Date.now() >( Number(Data.GameData.timer) + 5 * 60 * 1000)) {
      if (Data.owner === Data.GameData.player1) {
        return !(Data.GameData.gameState === 'started');
      } else if (Data.owner === Data.GameData.player2) {
        return !(Data.GameData.gameState === 'p2Joined');
      }
    }
    return true;
  };

  return (
    <div
      className={styles.form}
      style={{
        position: 'absolute',
        top: '1rem',
        right: '5vmin',
        width: '40vmin',
        zIndex: '100',
        // minWidth: '15vmin',
      }}
      onMouseEnter={(e) => {
        const pTag = e.currentTarget.lastElementChild as HTMLElement;
        if (pTag) pTag.style.opacity = '1';
        pTag.style.display = 'block';
      }}
      onMouseLeave={(e) => {
        const pTag = e.currentTarget.lastElementChild as HTMLElement;
        if (pTag) pTag.style.opacity = '0';
        pTag.style.display = 'none';
      }}
    >
      {' '}
      <button
        className={styles.submit}
        disabled={disableRecoverBtn()}
        // style={{ width: '15rem' }}
        onClick={recoverFunds}
      >
        RECOVER
      </button>
      <p className={styles.note}>
        You can recover your funds using the Recover button if the other player
        has not responded within 5 minutes.
      </p>
    </div>
  );
}
