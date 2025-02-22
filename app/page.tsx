'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
// import { ref, set ,onValue} from 'firebase/database';

import StartGame from './components/startGame';
import EnterGame from './components/enterGame';
import Solve from './components/Solve';
import Friends from './components/friends';
import { Tabs } from './utils/UI/TabBar/Tabs';
// import { useGetData } from './utils/data';
import { useAppContext } from './utils/context/context';
import ConnectBtn from './components/ConnectBtn';
// import { id } from 'ethers';
import RPSLSGame from './components/RPSLS';
import GameInput from './components/myGames/myGamesToggler';
import RecoverBtn from './components/RecoverBtn';
import toast from 'react-hot-toast';
import Modal from './utils/UI/Modal/Modal';

export type GameData = {
  player1: string;
  player2: string;
  stake: number;
  RPSaddress: string;
  gameState: 'yetToStart' | 'started' | 'p2Joined' | 'solved';
};

export default function Home() {
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  // const [address, setAddress] = useState<string>('');

  const [gameData, setGameData] = useState<GameData>({
    player1: '',
    player2: '',
    stake: 0,
    RPSaddress: '',
    gameState: 'yetToStart',
  });

  const [tabState, setTabState] = useState<
    'start' | 'join' | 'solve' | 'friends'
  >('start');






  // const TabHandler = () => {
  //   if (!address) return "start";

  //   // For new game or undefined players
  //   if (!data.player1 && !data.player2) return 'start';

  //   // For player1
  //   if (data.player1 === address) {
  //     if (data.gameState === 'yetToStart') return 'start';
  //     if (data.gameState === 'p2Joined') return "solve";
  //     return 'start'; // Default to tab 1 for player1 in other states
  //   }

  //   // For player2
  //   if (data.player2 === address) {
  //     if (data.gameState === 'started') return 'join';
  //     if (data.gameState === 'p2Joined') return "solve";

  //     return 'start'; // Stay in tab 2 for all player2 states
  //   }

  //   // Default case
  //   return 'start';
  // };

  const Data = useAppContext();

  const checkCurrentAccount = () => {
    console.log('frpm check current account......................');
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', async () => {
        const accounts = await window.ethereum!.request({
          method: 'eth_accounts',
        });
        Data.setOwner(accounts[0]);
        toast.success('Address changed successfully');
      });
    }
  };

  useEffect(() => {
    checkCurrentAccount();
  }, []);

  return (
    <div className={styles.container}>
      {Data.owner && <GameInput />}
      {Data.currentGameId && <RecoverBtn />}
      {Data.currentGameId && <Modal />}

      <RPSLSGame
        selectedCircle={selectedCircle}
        setSelectedCircle={setSelectedCircle}
      />

      {Data.owner ? (
        <div style={{ minHeight: '75%', marginTop: '5rem' }}>
          <Tabs currentTab={tabState} tabState={setTabState} />

          <div>
            {(() => {
              switch (tabState) {
                case 'start':
                  return (
                    <StartGame
                      selectedCircle={selectedCircle}
                      gameData={setGameData}
                    />
                  );
                case 'join':
                  return (
                    <EnterGame
                      selectedCircle={selectedCircle}
                      setGameData={setGameData}
                      RPSaddress={gameData.RPSaddress}
                    />
                  );
                case 'solve':
                  return <Solve selectedCircle={selectedCircle} />;
                case 'friends':
                  return <Friends tabState={setTabState} />;
                default:
                  return 'start';
              }
            })()}
          </div>
        </div>
      ) : (
        <ConnectBtn />
      )}
    </div>
  );
}
