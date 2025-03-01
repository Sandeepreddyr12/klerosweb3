'use client';

import { useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';
import { db } from '@/firebase';
import { ref, update } from 'firebase/database';
import { toast } from 'react-toastify';


import RPSArtifact from '../../Contract/build/RPS.json';
import { gameStateType, useAppContext } from '../utils/context/context';
import styles from '../page.module.css';
import { GameItem } from '../utils/UI/UIcomponents';

// this component lets the other user enter a game. 

type Props = {
  selectedCircle: string | null;
};

export default function JoinGame({
  selectedCircle,
}: Props) {

  const Data = useAppContext();

  const [MetaMaskInstalled, setMetaMaskInstalled] = useState(false);

  const getMoveNumber = (selectedMove: string | null): number => {
    if (!selectedMove) return 0;
    const move = selectedMove.split(' ')[1];
    switch (move) {
      case 'Rock':
        return 1;
      case 'Paper':
        return 2;
      case 'Scissors':
        return 3;
      case 'Spock':
        return 4;
      case 'Lizard':
        return 5;
      default:
        return 0;
    }
  };


  function btnStatus() {
    if (
      Data?.GameData?.gameState === 'started' &&
      Data.owner === Data.GameData.player2
    ) {
      return false;
    }

    return true;
  }

  useEffect(() => {
    setMetaMaskInstalled(window.ethereum?.isMetaMask ?? false);
  }, []);

  

  const EnterGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!MetaMaskInstalled) {
      toast.warn('Please install MetaMask to continue');
      return;
    }

    const address = Data.owner;

    if (!address) {
      toast.warn('Please login with wallet to continue.');
      return;
    }

    if (!selectedCircle) {
      toast.warn(
        'Please select a move (Rock, Paper, Scissors, Spock, or Lizard)'
      );
      return;
    }

     if (address !== Data.GameData.player2) {
       toast.warn(
        `u are not allowed to Enter the game, login with ${Data.GameData.player2}`
       );
       return;
     }


    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to continue');
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


      const stake = await RPSContract.stake();


      await RPSContract.play(getMoveNumber(selectedCircle), {
        value: stake,
      });

      const data = {
        player2: address,
        gameState: 'p2Joined' as gameStateType,
        timer: Date.now(),
      };

      await update(ref(db, 'game/' + Data.currentGameId), data);

      toast.success('Game joined successfully!');


    } catch (error) {
      console.log('Error joining game:',error);
      toast.error('Failed to join game. Please try again.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <GameItem selectedCircle={selectedCircle} />

      <form className={styles.form}>
        <div className={styles.submit} style={{ textAlign: 'center' }}>
          stake : {Data.GameData.stake} eth
        </div>
        <button
          className={styles.submit}
          disabled={btnStatus()}
          onClick={EnterGame}
        >
          Join
        </button>
        <p className={styles.note}>
          The secret key is used to add a salt to your move for security.
        </p>
      </form>
    </div>
  );
}
