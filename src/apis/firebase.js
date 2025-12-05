// Firebase configuration - Single app instance
// Both Cloud and Marketplace modes use the same Firebase project,
// so we use a single Firebase app to avoid redirect auth issues.
//
// IMPORTANT: Using multiple Firebase apps for the same project causes
// signInWithRedirect to fail because Firebase can't determine which
// auth instance should receive the redirect result.

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAppMode } from '../utils/modeDetection';

// Firebase configuration for waterquality-trading project
// Used by both Cloud and Marketplace modes
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAESUVCltG4kviQLIiiygIROJ7BKMMgvX8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "waterquality-trading.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "waterquality-trading",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "waterquality-trading.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1006831487182",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1006831487182:web:a58405168a345d8728689f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ECMFLV2Y6B"
};

// Initialize Firebase (single default app)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

const mode = getAppMode();
console.log(`🔥 Firebase initialized for mode: ${mode}`);

export { auth, db, googleProvider };
