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
import { getFirestore } from "firebase/firestore";
import { getAppMode } from '../utils/modeDetection';

// Firebase configuration for waterquality-trading project
// Used by both Cloud and Marketplace modes
// SECURITY: All config values MUST come from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate required Firebase config - fail gracefully instead of throwing
// This prevents white screen when env vars are missing
const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
export const isFirebaseConfigured = missingKeys.length === 0;
export const firebaseConfigError = missingKeys.length > 0
  ? `Missing required Firebase config: ${missingKeys.join(', ')}. Check environment variables.`
  : null;

// Initialize Firebase only if configured (single default app)
// If not configured, create null placeholders to prevent import errors
let app = null;
let auth = null;
let db = null;
let firestore = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
  firestore = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

const mode = getAppMode();
// Debug logging removed for security - mode detection happens silently

export { auth, db, firestore, googleProvider };
