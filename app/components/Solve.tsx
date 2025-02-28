import { useState, useEffect } from 'react';
import { ref, update } from 'firebase/database';
import { ethers, Contract } from 'ethers';
import { db } from '@/firebase';
import { toast } from 'react-toastify';

import styles from '../page.module.css';
import { GameItem, InputForm } from '../utils/UI/UIcomponents';
import { useAppContext, gameStateType } from '../utils/context/context';
import {
  getGameState,
  resetGameState,
  type localData,
} from '../utils/localStorage';
import RPSArtifact from '../../Contract/build/RPS.json';


type Props = {
  selectedCircle: string | null;
};

const SolveGame = ({ selectedCircle }: Props) => {
  const Data = useAppContext();
  const [secretKey, setSecretKey] = useState('');
  const [localData, setLocalData] = useState<localData>({
    move: '',
    secretKey: '',
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
    const data = getGameState(Data.currentGameId+Data.GameData.player1);
    if (data) {
      setLocalData(data);
      setSecretKey(data.secretKey);
    }
  }, [Data.currentGameId]);

  const Solve = async (e: React.FormEvent) => {
    e.preventDefault();

    const address = Data.owner;

    if (!address) {
      toast.warn('Please login with wallet to continue.');
      return;
    }

     if (!selectedCircle && (!localData.move)) {
       toast.warn(
         'Please confirm a move (Rock, Paper, Scissors, Spock, or Lizard)'
       );
       return;
     }
     if (!secretKey) {
       toast.warn(
         'Please confirm the secret key that you provided while starting the game'
       );
       return;
     }
      if (address !== Data.GameData.player1) {
       toast.warn(
         `u are not allowed to solve this game, login with ${Data.GameData.player1}`
       );
        return;
      }


     const toastId = toast.loading('intializing RPS contract...');

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


       toast.update(toastId, {
         render: '🎉 RPS contract initialized...',
         type: 'success',
         isLoading: true,
         autoClose: 4000,
       });


      await RPSContract.solve(
        getMoveNumber((selectedCircle || localData?.move)),
        secretKey
      );
     
     
      const move2 = await RPSContract.c2();


      const selectedMove = (selectedCircle || localData?.move);
      const matchResult = gameSolver(getMoveNumber(selectedMove), Number(move2));

      const rpssl = ["Rock", "Paper", "Scissors", "Spock", "Lizard"];

      const moves = [selectedMove ? selectedMove.split(' ')[1] : '', rpssl[Number(move2) - 1]];

      const data = {
        gameState: 'finished' as gameStateType,
        timer : Date.now(),
        won_Recovered_By : matchResult,
        moves : moves
      };
      await update(ref(db, 'game/' + Data.currentGameId), data);

      const gameUpdate = {
        status: 'finished',
      };

      await update(
        ref(db, 'players/' + Data.GameData.player1 + '/' + Data.currentGameId),
        gameUpdate
      );
      await update(
        ref(db, 'players/' + Data.GameData.player2 + '/' + Data.currentGameId),
        gameUpdate
      );

      resetGameState(Data.currentGameId + Data.GameData.player1);

       toast.update(toastId, {
         render: '🎉 solved, game is finished',
         type: 'success',
         isLoading: false,
         autoClose: 4000,
       });

      //  setGameData((prevState) => ({ ...prevState, ...data }));

    } catch (error) {
      toast.update(toastId, {
        render: '🎉Something went wrong,Failed to start game. Please try again',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };


  

// below function is used to solve the game, based on the moves choosen by players
function gameSolver(move1: number, move2: number): string {
  if (move1 === move2) {
    toast.info("Match drawn! Both players choosen the same move.");
    return "Match drawn";
  }
  else if (move1 === 0 
    || move2 === 0
  ) {
    toast.error("Invalid move by players");
    return "Invalid move";
  }
  else if (move1 % 2 === move2 % 2) {
    if (move1 < move2) {
      toast.success(Data.owner === Data.GameData.player1 ? "You win!" : "Rival wins!");
      return Data.owner === Data.GameData.player1 ? Data.GameData.player1 : Data.GameData.player2;
    } else {
      toast.success(Data.owner === Data.GameData.player2 ? "You win!" : "Rival wins!");
      return Data.owner === Data.GameData.player2 ? Data.GameData.player2 : Data.GameData.player1;
    }
  }
  else {
    if (move1 > move2) {
      toast.success(Data.owner === Data.GameData.player1 ? "You win!" : "Rival wins!");
      return Data.owner === Data.GameData.player1 ? Data.GameData.player1 : Data.GameData.player2;
    } else {
      toast.success(Data.owner === Data.GameData.player2 ? "You win!" : "Rival wins!");
      return Data.owner === Data.GameData.player2 ? Data.GameData.player2 : Data.GameData.player1;
    }
  }
}





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
    <div className={styles.formContainer} style={{ padding : '0 6vmin' }}>  

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
