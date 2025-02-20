import styles from '../page.module.css';
import { useAppContext, type gameStateType } from '../utils/context/context';
import { getGameState } from '../utils/localStorage';

import { ref, update } from 'firebase/database';
import { ethers, Contract } from 'ethers';
import RPSArtifact from '../../Contract/build/RPS.json';
import { db } from '@/firebase';
import { toast } from 'react-toastify';

type Props = {};

export default function RecoverBtn(props: Props) {
  const Data = useAppContext();

  // const [info, setInfo] = useState('')

  const recoverFunds = async (e: React.FormEvent) => {
    e.preventDefault();

    //    if (!MetaMaskInstalled) {
    //      alert('Please install MetaMask to continue');
    //      return;
    //    }

    const address = Data.owner;

    if (!address) {
      toast.warn('Please login with wallet to continue.');
      return;
    }

    console.log('timeout');

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

      // const accounts = await window.ethereum?.request({
      //   method: 'eth_requestAccounts',
      // });
      // const [address] = accounts || [''];

      const RPSContract = new Contract(
        Data.GameData.RPSaddress,
        RPSArtifact.abi,
        signer
      );

      if (address === Data.GameData.player1) {
        await RPSContract.j2Timeout();

        const data = {
          gameState:
            ('recovered' as gameStateType) + `by ${Data.GameData.player1}`,
        };
        await update(ref(db, 'game/' + Data.currentGameId), data);

        toast.success('Funds recovered successfully');

      } else if (address === Data.GameData.player2) {
        await RPSContract.j1Timeout();

        const data = {
          gameState:
            ('recovered' as gameStateType) + `by ${Data.GameData.player2}`,
        };
        await update(ref(db, 'game/' + Data.currentGameId), data);
         toast.success('Funds recovered successfully');
      }

      //  setGameData((prevState) => ({ ...prevState, ...data }));

      console.log('funds recovered');
    } catch (error) {
      console.error('Error recovering funds:', error);
        toast.error('Failed to recover funds. Please try again.');
      // alert('Failed to join game. Please try again.');
    }
  };

  const disableRecoverBtn = (): boolean => {
    const data = getGameState(Data.currentGameId);

    if ((data && typeof data?.timer === 'undefined') || null) return true;

    if (data && Date.now() > Number(data.timer)) {
      if (Data.owner === Data.GameData.player1) {
        return Data.GameData.gameState === 'started';
      } else if (Data.owner === Data.GameData.player2) {
        return Data.GameData.gameState === 'p2Joined';
      }
    }
    return false;
  };

  return (
    <div
      className={styles.form}
      style={{
        position: 'absolute',
        top: '1rem',
        right: '2rem',
        width: '18rem',
        zIndex: '100',
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
        disabled={!disableRecoverBtn()}
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
