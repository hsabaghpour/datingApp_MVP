// src/firebase.ts
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⬇️ Replace with your real Firebase web app config (from Console → Project settings → General)
const firebaseConfig = {
  apiKey: "AIzaSyAwGvdFNHkrbLcLyJiU6GNYrUwQLA5ktlo",
  authDomain: "dating-app-mvp-halal.firebaseapp.com",
  projectId: "dating-app-mvp-halal",
  storageBucket: "dating-app-mvp-halal.appspot.com",
  messagingSenderId: "732716332073",
  appId: "1:732716332073:web:abcd1234ef567890",
  // measurementId: "G-XXXX" (optional)
};


const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
