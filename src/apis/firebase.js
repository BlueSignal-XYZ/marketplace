// Dynamic Firebase configuration that routes to the appropriate app based on hostname
// For Cloud mode: uses firebaseCloud.ts
// For WQT mode: uses firebaseWqt.ts
// This maintains backward compatibility while supporting dual-mode architecture

import { auth as cloudAuth, db as cloudDb, googleProvider as cloudGoogleProvider } from './firebaseCloud.ts';
import { auth as wqtAuth, db as wqtDb, googleProvider as wqtGoogleProvider } from './firebaseWqt.ts';
import { getAppMode } from '../utils/modeDetection';

const mode = getAppMode();
const auth = mode === "cloud" ? cloudAuth : wqtAuth;
const db = mode === "cloud" ? cloudDb : wqtDb;
const googleProvider = mode === "cloud" ? cloudGoogleProvider : wqtGoogleProvider;

console.log(`🔥 Firebase config loaded for mode: ${mode}`);

export { auth, db, googleProvider };