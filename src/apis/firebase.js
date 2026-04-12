// Firebase configuration - Single app instance
// Both Cloud and Marketplace modes use the same Firebase project,
// so we use a single Firebase app to avoid redirect auth issues.
//
// IMPORTANT: Using multiple Firebase apps for the same project causes
// signInWithRedirect to fail because Firebase can't determine which
// auth instance should receive the redirect result.

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
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
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
export const isFirebaseConfigured = missingKeys.length === 0;
export const firebaseConfigError =
  missingKeys.length > 0
    ? `Missing required Firebase config: ${missingKeys.join(', ')}. Check environment variables.`
    : null;

// Initialize Firebase only if configured (single default app)
// If not configured, create null placeholders to prevent import errors
let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
  googleProvider = new GoogleAuthProvider();
}

// Lazy-load Firestore — only import firebase/firestore when actually needed.
// This avoids pulling ~180KB into the main bundle for features that rarely use it.
let _firestore = null;
export async function getFirestoreInstance() {
  if (_firestore) return _firestore;
  if (!app) {
    console.error(
      '[Firebase] Cannot initialise Firestore — Firebase app is not configured. Check VITE_FIREBASE_* env vars.'
    );
    return null;
  }
  const { getFirestore } = await import('firebase/firestore');
  _firestore = getFirestore(app);
  return _firestore;
}

// Synchronous export kept for legacy callers — null until getFirestoreInstance() is called.
export { auth, db, _firestore as firestore, googleProvider };
