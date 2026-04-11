import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_OPS_DATABASE_URL || import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

export let app: FirebaseApp;
export let auth: Auth;
export let db: Database;
export let firebaseError: string | null = null;

try {
  if (!config.apiKey) throw new Error('VITE_FIREBASE_API_KEY is not set');
  app = initializeApp(config);
  auth = getAuth(app);
  db = getDatabase(app);
} catch (e) {
  firebaseError = e instanceof Error ? e.message : 'Firebase initialization failed';
  console.error('[ops] Firebase init error:', firebaseError);
}
