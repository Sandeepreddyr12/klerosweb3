'use client';

import styles from '../page.module.css'
import { useState } from 'react';

import {connectWallet,useAppContext} from '../utils/context/context';







const ConnectBtn = () => {

    const gameData = useAppContext();
   
    // const [connected, setConnected] = useState(false);

  // Function to connect/disconnect the wallet
//   async function connectWallet() {


//         if (typeof window.ethereum !== 'undefined') {
//           try {
//             const accounts = await window.ethereum.request({
//               method: 'eth_requestAccounts',
//             });
//          setConnected(true);
//           } catch (error) {
//             console.error('Error connecting to MetaMask:', error);
//           }
//         } else {
//           console.log('Please install MetaMask');
//         }
//       };


//     if(window.ethereum) {
//     if (!connected) {
//       // Connect the wallet using ethers.js
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const _walletAddress = await signer.getAddress();
//       setConnected(true);
//       setWalletAddress(_walletAddress);
//     } else {
//       // Disconnect the wallet
//       window?.ethereum.selectedAddress = null;
//       setConnected(false);
//       setWalletAddress("");
//     }
//   }


    

    return (
      <div className={styles.form}>
        <p className={styles.note} style={{fontSize : '1.1rem'}}>
         Please connect the wallet, to proceed into the game.
        </p>

        <button
          onClick={() => connectWallet(gameData.setOwner)}
          className={styles.submit}
        >
          {/* {isConnected ? `Disconnect ${address?.slice(0, 6)}...` : 'Connect Wallet'} */}
          Connect
        </button>
      </div>
    );
}



export default ConnectBtn;