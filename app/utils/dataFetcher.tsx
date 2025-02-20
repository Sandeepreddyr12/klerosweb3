'use client'

import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { ref, set, onValue } from 'firebase/database';


export const useGetPlayerData = (address : string) =>{
 
const [data, setData] = useState({});

useEffect(() => {

  const starCountRef = ref(db, 'players/' + address
);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log('dfaaa', data);

      setData(data);
    });

}, [address]);

    return data;


}


export const useGetData = () => {


const [data, setData] = useState({});

useEffect(() => {

  const starCountRef = ref(db, 'game/0xcF585Fe5b8749DB96d15b0A2CD79095471Fed9ad'
);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log('dfaaa', data);

      setData(data);
    });

}, []);

    return data;
};
