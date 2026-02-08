/**
 * Lightweight Firebase init for the landing page.
 * Only Firestore is initialised — no Auth, no Realtime Database.
 * Falls back gracefully when environment variables are missing.
 *
 * FIX: Added diagnostic logging so missing env vars are immediately visible
 * in the browser console. Previously, a missing config silently set
 * `firestore` to null, causing the contact form to fall back to mailto
 * with zero indication of why.
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
const missingKeys = requiredKeys.filter((k) => !firebaseConfig[k]);
const isConfigured = missingKeys.length === 0;

// FIX: Log which keys are missing so developers can diagnose instantly.
// Previously there was no output when config was incomplete — the form
// silently fell back to mailto and no one knew Firebase was unconfigured.
if (!isConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    `[Landing Firebase] Missing required config keys: ${missingKeys.join(', ')}. ` +
    'Firestore will be unavailable — contact form will use mailto fallback. ' +
    'Ensure VITE_FIREBASE_* env vars are set in .env.local (local dev) ' +
    'and in Cloudflare Pages environment variables (production).'
  );
}

let firestore = null;

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig, 'landing');
    firestore = getFirestore(app);
    // eslint-disable-next-line no-console
    console.info('[Landing Firebase] Firestore initialised successfully.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[Landing Firebase] Init failed:', err.message);
  }
}

export { firestore };
