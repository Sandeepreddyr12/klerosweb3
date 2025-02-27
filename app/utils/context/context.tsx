'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { db } from '@/firebase';
import { ref, set, get as firebaseGet } from 'firebase/database';
import { toast } from 'react-toastify';





export type gameStateType = 'yetToStart' | 'started' | 'p2Joined' | 'finished' | 'recovered';


type ContextProps = {
  owner: string;
  currentGameId: string;
  selectedAddress: string;

  
  GameData: {
    player1: string;
    player2: string;
    stake: number;
    RPSaddress: string;
    gameState: gameStateType;
    timer: number;
    won_Recovered_By: string;
    moves : [string,string];
  };
  setCurrentGameId: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAddress: React.Dispatch<React.SetStateAction<string>>;
  setOwner: React.Dispatch<React.SetStateAction<string>>;
  setGameData: React.Dispatch<
    React.SetStateAction<{
      player1: string;
      player2: string;
      stake: number;
      RPSaddress: string;
      gameState: gameStateType;
      timer: number;
      won_Recovered_By : string;
      moves : [string,string];
    }>
  >;
};

export const defaultContext: ContextProps = {
  owner: '',
  selectedAddress : '',
  GameData: {
    player1: '',
    player2: '',
    stake: 0,
    RPSaddress: '',
    gameState: 'yetToStart',
    timer : 0,
    won_Recovered_By : '',
    moves : ['','']
  },
  currentGameId: '',
  setSelectedAddress: () => {},
  setCurrentGameId: () => {},
  setOwner: () => {},
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
         } else {
          //  console.log('writing skipped');
         }

       } catch(error) {
         toast.error('Error connecting to wallet:, please refresh and try again'  );
       }
     } else {
       toast.warn('Please install MetaMask');
     }
   };





export const AppProvider = ({ children }: AppProviderProps) => {

    const [address, setAddress] = useState<string>('');
    const [gameData, setGameData] = useState({});
    const [currentGameId, setCurrentGameId] = useState<string>('');
    const [selectedAddress, setSelectedAddress] = useState<string>('');

    
    const values: ContextProps = {
        ...defaultContext,
        owner: address,
        setOwner: setAddress,
        setGameData: setGameData,
        currentGameId: currentGameId,
        setCurrentGameId: setCurrentGameId,
        selectedAddress: selectedAddress,
        setSelectedAddress: setSelectedAddress,
        GameData: {
            ...defaultContext.GameData,
            ...gameData
        },
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