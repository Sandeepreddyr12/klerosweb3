'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
// import {useGetData} from '../data';
import { db } from '@/firebase';
import { ref, set,update, get as firebaseGet } from 'firebase/database';
// import { GameData } from '../../page';





export type gameStateType = 'yetToStart' | 'started' | 'p2Joined' | 'finished' | 'recovered';


type ContextProps = {
  owner: string;
  currentGameId: string;
  selectedAddress: string;

  gameID: {
    [id: string]: {
      status: string;
    };
  };
  GameData: {
    player1: string;
    player2: string;
    stake: number;
    RPSaddress: string;
    gameState: gameStateType;
    timer: number;
    won_Recovered_By: string;
  };
  setCurrentGameId: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAddress: React.Dispatch<React.SetStateAction<string>>;
  setOwner: React.Dispatch<React.SetStateAction<string>>;
  setGameId: React.Dispatch<
    React.SetStateAction<{ [id: string]: { status: string } }>
  >;
  setGameData: React.Dispatch<
    React.SetStateAction<{
      player1: string;
      player2: string;
      stake: number;
      RPSaddress: string;
      gameState: gameStateType;
      timer: number;
      won_Recovered_By : string;
    }>
  >;
};

export const defaultContext: ContextProps = {
  owner: '',
  gameID: {},
  selectedAddress : '',
  GameData: {
    player1: '',
    player2: '',
    stake: 0,
    RPSaddress: '',
    gameState: 'yetToStart',
    timer : 0,
    won_Recovered_By : ''
  },
  currentGameId: '',
  setSelectedAddress: () => {},
  setCurrentGameId: () => {},
  setOwner: () => {},
  setGameId: () => {},
  setGameData: () => {},
};

export const GameContext = createContext<ContextProps>(defaultContext);

type AppProviderProps = {
        children: ReactNode;
}







   export const connectWallet = async (
     setOwner: React.Dispatch<React.SetStateAction<string>>
   ): Promise<void> => {
     if (typeof window.ethereum !== 'undefined') {
       try {
         const accounts = (await window.ethereum.request({
           method: 'eth_requestAccounts',
         })) as string[];
         setOwner(accounts[0]);

         const data = {
           isEmpty: true
         };

         
         const playerRef = ref(db, 'players/' + accounts[0]);

         const snapshot = await firebaseGet(playerRef);
         if (!snapshot.exists()) {
           await set(playerRef, data);
           console.log('Data added for ' + accounts[0]);
         } else {
           console.log('writing skipped');
         }

       } catch (error) {
         console.error('Error connecting to wallet:', error);
       }
     } else {
       console.log('Please install MetaMask');
     }
   };





export const AppProvider = ({ children }: AppProviderProps) => {

    const [address, setAddress] = useState<string>('');
    const [GameId, setGameId] = useState({});
    const [gameData, setGameData] = useState({});
    const [currentGameId, setCurrentGameId] = useState<string>('');
    const [selectedAddress, setSelectedAddress] = useState<string>('');

    
    const values: ContextProps = {
        ...defaultContext,
        owner: address,
        setOwner: setAddress,
        setGameId: setGameId,
        setGameData: setGameData,
        currentGameId: currentGameId,
        setCurrentGameId: setCurrentGameId,
        selectedAddress: selectedAddress,
        setSelectedAddress: setSelectedAddress,
        GameData: {
            ...defaultContext.GameData,
            ...gameData
        },
        gameID: {
            ...defaultContext.gameID,
            ...GameId
        }
    };

    useEffect(() => {
      connectWallet(setAddress);
    }, []);
    
    console.log("from context",values);  
        return <GameContext.Provider value={values}>{children}</GameContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};