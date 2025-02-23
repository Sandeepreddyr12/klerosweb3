import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import { type GameData } from '../page';
import { db } from '@/firebase';
import { ref, set, update } from 'firebase/database';
import { useAppContext, type gameStateType } from '../utils/context/context';
import { saveGameState } from '../utils/localStorage';
import {toast} from 'react-toastify';

import { deployHasher, deployRPS } from '../deployScripts/deployScript';
import { GameItem, InputForm, NumberInput } from '../utils/UI/UIcomponents';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
    };
  }
}

type Props = {
  selectedCircle: string | null;
  gameData: (data: GameData) => void;
};

export default function StartGame({ selectedCircle, gameData }: Props) {
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState('');
  const [secretKey, setSecretKey] = useState('');
  // const [MetaMaskInstalled, setMetaMaskInstalled] = useState(false);

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

  const Data = useAppContext();

  console.log(Data);

  const entryFee = 0.01;

  // useEffect(() => {
  //   setMetaMaskInstalled(window.ethereum?.isMetaMask ?? false);

  // }, []);

  useEffect(() => {
    if (!address) {
      setAddress(Data.selectedAddress);
    }
  }, []);

  // const lstfunc = ()=>{

  //   saveGameState("quhb59im81i", secretKey, selectedCircle as string);

  //  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let HasherContract: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let RPSContract: any;

  const startGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const address1 = Data.owner;

    if (!inputValidator(address1)) return;

    const toastId = toast.loading('Starting game...');
    
    try {
      HasherContract = await deployHasher();
      // toast.loading('Hasher Contract deployed', { id: toastId });

      toast.update(toastId, {
        render: '🎉 Hasher Contract deployed',
        type: 'success',
        isLoading: true,
        autoClose: 3000,
      });

      const hashedMove = await HasherContract.hash(
        getMoveNumber(selectedCircle),
        secretKey
      );

      toast.update(toastId, {
        render: '🎉 Your move has been hashed',
        type: 'success',
        isLoading: true,
        autoClose: 3000,
      });

      RPSContract = await deployRPS(hashedMove, address, amount);
      // toast.loading('RPS Contract deployed', { id: toastId });

      toast.update(toastId, {
        render: '🎉 RPS Contract deployed',
        type: 'success',
        isLoading: true,
        autoClose: 3000,
      });

      // const timer = RPSContract.lastAction();

      // console.log(timer, Date.now() );

      // timer = serverTimestamp(),


      const data = {
        player1: address1,
        player2: address,
        stake: amount,
        RPSaddress: RPSContract,
        gameState: 'started' as gameStateType,
        timer: Date.now(),
        won_Recovered_By: '',
      };
      console.log('data', data);

      const gameId = Math.random().toString(36).substring(2, 17).toString();

      const gameAdd = {
        [gameId]: {
          status: data.gameState,
        },
      };

      await update(ref(db, 'players/' + address1), gameAdd);
      await update(ref(db, 'players/' + address), gameAdd);

      await set(ref(db, 'game/' + gameId), data);

      saveGameState(gameId, secretKey, selectedCircle as string);

      // toast.success('Game started successfully!', { id: toastId });
      toast.update(toastId, {
        render: '🎉 Game started successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.error('Error joining game:', error);
      // toast.error('Failed to start game. Please try again.', { id: toastId });
      toast.update(toastId, {
        render: '🎉Something went wrong,Failed to start game. Please try again',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  function generateSecureRandomNumber() {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomNumber = array[0];
    setSecretKey(randomNumber.toString().slice(0, 15));

  }

  function inputValidator(address1: string) {
    if (!address) {
      toast.warn('Please enter opponent address');
      return false;
    }
    if (!selectedCircle) {
      toast.warn(
        'Please select a move (Rock, Paper, Scissors, Spock, or Lizard)'
      );
      return false;
    }
    if (!secretKey) {
      toast.warn('Please enter or generate a secret key');
      return false;
    }
    if (!amount) {
      toast.warn(
        `Please enter an amount greater than or equal to ${entryFee} ETH`
      );
      return false;
    }
    if (!address1) {
      toast.warn('Please login with wallet to continue.');
      return false;
    }
    return true;
  }

  return (
    <div className={styles.formContainer}>
      <GameItem selectedCircle={selectedCircle} />

      <form className={styles.form}>
        <InputForm
          address={address}
          setAddress={setAddress}
          secretKey={secretKey}
          setSecretKey={setSecretKey}
          // hideInput={false}
        />
        <button className={styles.submit} onClick={generateSecureRandomNumber}>
          Generate <span style={{ fontSize: '.6rem', color : "black"}}>more secure</span>
        </button>

        <NumberInput
          amount={amount}
          setAmount={setAmount}
          entryFee={entryFee}
        />
        <button
          className={styles.submit}
          disabled={Data?.GameData?.gameState !== 'yetToStart'}
          onClick={startGame}
        >
          Start Game
        </button>
        <p className={styles.note}>
          The secret key is used to add a salt to your move for security.
        </p>
      </form>
    </div>
  );
}


