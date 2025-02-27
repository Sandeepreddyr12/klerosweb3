// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'rpsls-multiplayer-game-dae0f.firebaseapp.com',
  databaseURL:
    'https://rpsls-multiplayer-game-dae0f-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'rpsls-multiplayer-game-dae0f',
  storageBucket: 'rpsls-multiplayer-game-dae0f.firebasestorage.app',
  messagingSenderId: '393439873417',
  appId: '1:393439873417:web:b541623b305c0ea860b958',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getDatabase(app);