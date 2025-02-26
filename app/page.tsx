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
import {toast} from 'react-toastify';
import Modal from './utils/UI/Modal/Modal';

export type GameData = {
  player1: string;
  player2: string;
  stake: number;
  RPSaddress: string;
  gameState: 'yetToStart' | 'started' | 'p2Joined' | 'solved' | 'finished' | 'recovered';
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
  
  const Data = useAppContext();


  useEffect(() => {
    if (Data.GameData.gameState === 'yetToStart') {
      setTabState('start');
    } else if (Data.GameData.gameState === 'finished') {
      toast.success('this game is finished',{autoClose: 6000, position: 'top-center'});
   
    } else if (Data.GameData.gameState === 'p2Joined') {
      if (Data.GameData.player1 === Data.owner) {
        toast.error(
          'Rival has joined, your turn to solve! You may lose the stake after the timeout',
          { autoClose: 6000, position: 'top-center' }
        );
        setTabState('solve');
      } else if (Data.GameData.player2 === Data.owner) {
        toast.info('waiting for Rival to solve', {
          autoClose: 6000,
          position: 'top-center',
        });
      }
    } else if (Data.GameData.gameState === 'started') {
      if (Data.GameData.player1 === Data.owner) {
        toast.info('wait for rival to make a move', {
          autoClose: 6000,
          position: 'top-center',
        });
        setTabState('join');
      }else{

        toast.success('game started! join now and make a move', {
          autoClose: 6000,
          position: 'top-center'
        });
                setTabState('join');

      }
    } else if (Data.GameData.gameState === 'recovered') {
      toast.success('Funds have been recovered! This game has finished.', {
        autoClose: 6000,
         position: 'top-center'
      });
    }
  }, [Data.GameData.gameState, Data.owner]);





 


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
        <div className={styles.pages}>
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
        <div style={{height: '100vh', display :'flex', alignItems : 'center', maxWidth :"90%", margin : 'auto',}}>
          <ConnectBtn />
        </div>
      )}
    </div>
  );
}
