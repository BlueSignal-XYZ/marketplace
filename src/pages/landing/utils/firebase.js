/**
 * Lightweight Firebase init for the landing page.
 * Only Firestore is initialised — no Auth, no Realtime Database.
 * Falls back gracefully when environment variables are missing.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const isConfigured = requiredKeys.every((k) => firebaseConfig[k]);

let firestore = null;

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig, 'landing');
    firestore = getFirestore(app);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Landing Firebase init failed:', err.message);
  }
}

export { firestore };
