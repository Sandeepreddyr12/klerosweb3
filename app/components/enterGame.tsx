'use client';

import { useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';
import RPSArtifact from '../../Contract/build/RPS.json';
import { db } from '@/firebase';
import { ref, update } from 'firebase/database';
import { gameStateType, useAppContext } from '../utils/context/context';
// import GameInput from '../utils/UI/gameInputToggle/gameInput';

import styles from '../page.module.css';
import { type GameData } from '../page';

// import { deployHasher, deployRPS } from '../deployScripts/deployScript';
import { GameItem } from '../utils/UI/UIcomponents';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
    };
  }
}

type Props = {
  selectedCircle: string | null;
  setGameData: (data: GameData) => void;
  RPSaddress: string;
};

export default function EnterGame({
  selectedCircle,
  setGameData,
  RPSaddress,
}: Props) {
  // const [amount, setAmount] = useState(0);

  const Data = useAppContext();
  console.log('enter game', Data);

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

  // const entryFee = 0.01;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // let RPSContract: any;

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

    console.log('entergame');

    // const contAdress = '0x7c3ed8df2d514050f15101e7c357d854b67b7508';

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

      console.log(Data.GameData.RPSaddress);

      console.log('initlized rps contract', RPSContract);

      const stake = await RPSContract.stake();

      console.log(stake);

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

      // setGameData(prevState => ({ ...prevState, ...data }));

      console.log('RPSContract play function called');
    } catch (error) {
      console.error('Error joining game:', error);
      // alert('Failed to join game. Please try again.');
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
