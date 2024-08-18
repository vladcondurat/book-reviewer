import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC1-xmoKcGx4aEPhQBcMFzsOlRQ1arApzw',
  authDomain: 'book-hub-tw.firebaseapp.com',
  projectId: 'book-hub-tw',
  storageBucket: 'book-hub-tw.appspot.com',
  messagingSenderId: '745119433185',
  appId: '1:745119433185:web:03819aa0a1d22a169c12a0',
  measurementId: 'G-EKLZ70D92Q',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
