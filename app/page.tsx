'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import styles from './page.module.css';
import { useAppContext } from './utils/context/context';
import RPSLSGame from './components/RPSLS';
import StartGame from './components/startGame';
import EnterGame from './components/enterGame';
import Solve from './components/Solve';
import Friends from './components/friends';
import { Tabs } from './utils/UI/TabBar/Tabs';
import ConnectBtn from './components/ConnectBtn';
import GameInput from './components/myGames/myGamesToggler';
import RecoverBtn from './components/RecoverBtn';
import Modal from './components/Details/matchInfo';


export default function Home() {
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);

  const [tabState, setTabState] = useState<
    'start' | 'join' | 'solve' | 'friends'
  >('start');

  const Data = useAppContext();



  // This function is used to detect account changes.
  // When the user changes the account in the Metamask, this function is triggered.
  // It gets the new account address and updates the context.
  const checkCurrentAccount = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', async () => {
        const accounts = (await window.ethereum!.request({
          method: 'eth_accounts',
        })) as string[];
        if (accounts && accounts.length > 0) {
          Data.setOwner(accounts[0]);
          toast.success('Address changed successfully');
        }
      });
    }
  };

  useEffect(() => {
    checkCurrentAccount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // This use effect is used to detect game state changes caused by other player operations.
  // When the other player makes a move, this function is triggered.
  // It changes and takes it to the desired tab and provides notifications to the user, making it a seamless real-time game experience.

  useEffect(() => {
    if (Data.GameData.gameState === 'yetToStart') {
      setTabState('start');
    } else if (Data.GameData.gameState === 'finished') {
      toast.success('this game is finished', {
        autoClose: 6000,
        position: 'top-center',
      });
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
      } else {
        toast.success('game started! join now and make a move', {
          autoClose: 6000,
          position: 'top-center',
        });
        setTabState('join');
      }
    } else if (Data.GameData.gameState === 'recovered') {
      toast.success('Funds have been recovered! This game has finished.', {
        autoClose: 6000,
        position: 'top-center',
      });
    }
  }, [
    Data.GameData.gameState,
    Data.owner,
    Data.GameData.player1,
    Data.GameData.player2,
  ]);

  return (

// Note on Performance:
//  * While sibling components may re-render due to changes in parents, React's reconciliation process
//  * efficiently handles DOM updates. Although techniques like React.memo and useCallback could 
//  * potentially optimize few re-renders, they would add unnecessary complexity in this case since:
//  * 1. Each component contains meaningful side effects
//  * 2. React's built-in diffing algorithm already prevents unnecessary DOM manipulations
//  * 3. The performance overhead of memoization could outweigh its benefits

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
                  return <StartGame selectedCircle={selectedCircle} />;
                case 'join':
                  return <EnterGame selectedCircle={selectedCircle} />;
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
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            maxWidth: '90%',
            margin: 'auto',
          }}
        >
          <ConnectBtn />
        </div>
      )}
    </div>
  );
}
