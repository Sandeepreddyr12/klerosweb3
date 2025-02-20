import { useState, useEffect } from 'react';

import styles from '../page.module.css';
import { GameItem, InputForm } from '../utils/UI/UIcomponents';
import { useAppContext, gameStateType } from '../utils/context/context';
import {
  getGameState,
  resetGameState,
  type localData,
} from '../utils/localStorage';

import { ref, update } from 'firebase/database';
import { ethers, Contract } from 'ethers';
import RPSArtifact from '../../Contract/build/RPS.json';
import { db } from '@/firebase';

type Props = {
  selectedCircle: string | null;
  //  gameData: (data: GameData) => void;
};

const SolveGame = ({ selectedCircle }: Props) => {
  const Data = useAppContext();
  const [secretKey, setSecretKey] = useState('');
  const [localData, setLocalData] = useState<localData>({
    move: '',
    secretKey: '',
    timer: 0,
  });

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

  useEffect(() => {
    const data = getGameState(Data.currentGameId);
    if (data) {
      setLocalData(data);
      setSecretKey(data.secretKey);
    }
  }, [Data.currentGameId]);

  const Solve = async (e: React.FormEvent) => {
    e.preventDefault();

    const address = Data.owner;

    if (!address) {
      alert('Please login with wallet to continue.');
      return;
    }

    console.log('solve');

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to continue');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Request account access
      await provider.send('eth_requestAccounts', []);
      // Get the signer
      const signer = await provider.getSigner();

      if (address === Data.GameData.player2) {
        throw new Error('u are not allowed to solve the game');
        return;
      }

      if (!selectedCircle) {
        alert(
          'Please confirm a move (Rock, Paper, Scissors, Spock, or Lizard)'
        );
        return;
      }
      if (!secretKey) {
        alert(
          'Please confirm the secret key that you provided while starting the game'
        );
        return;
      }

      const RPSContract = new Contract(
        Data.GameData.RPSaddress,
        RPSArtifact.abi,
        signer
      );

      console.log('initlized rps contract');

      //  console.log(getMoveNumber(selectedCircle || localData?.move), secretKey);

      await RPSContract.solve(getMoveNumber(selectedCircle), secretKey);

      const data = {
        gameState: 'finished' as gameStateType,
      };
      await update(ref(db, 'game/' + Data.currentGameId), data);

      resetGameState(Data.currentGameId);

      //  setGameData((prevState) => ({ ...prevState, ...data }));

      console.log('RPSContract solve function called');
    } catch (error) {
      console.error('Error solving game:', error);
      // alert('Failed to join game. Please try again.');
    }
  };

  console.log('solve');

  function btnStatus() {
    if (
      Data?.GameData?.gameState === 'p2Joined' &&
      Data.owner === Data.GameData.player1
    ) {
      return false;
    }

    return true;
  }

  return (
    <div className={styles.formContainer}>
      <GameItem selectedCircle={selectedCircle || localData?.move} />

      <form className={styles.form}>
        <InputForm
          secretKey={secretKey}
          setSecretKey={setSecretKey}
          hideInput={true}
        />
        <p className={styles.note}>
          Please verify your move and secret key before solving the game. This
          information is crucial for a successful transaction.
        </p>

        <button
          className={styles.submit}
          disabled={btnStatus()}
          onClick={Solve}
        >
          Solve
        </button>
      </form>
    </div>
  );
};

export default SolveGame;
