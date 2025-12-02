// Dynamic Firebase configuration that routes to the appropriate app based on hostname
// For Cloud mode: uses firebaseCloud.ts
// For WQT mode: uses firebaseWqt.ts
// This maintains backward compatibility while supporting dual-mode architecture

import { auth as cloudAuth, db as cloudDb, googleProvider as cloudGoogleProvider } from './firebaseCloud.ts';
import { auth as wqtAuth, db as wqtDb, googleProvider as wqtGoogleProvider } from './firebaseWqt.ts';

// Mode detection (same logic as App.jsx)
function detectMode() {
  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);

  if (
    host === "cloud.bluesignal.xyz" ||
    host.endsWith(".cloud.bluesignal.xyz") ||
    host === "cloud-bluesignal.web.app" ||
    params.get("app") === "cloud"
  ) {
    return "cloud";
  }

  return "marketplace";
}

const mode = detectMode();
const auth = mode === "cloud" ? cloudAuth : wqtAuth;
const db = mode === "cloud" ? cloudDb : wqtDb;
const googleProvider = mode === "cloud" ? cloudGoogleProvider : wqtGoogleProvider;

console.log(`🔥 Firebase config loaded for mode: ${mode}`);

export { auth, db, googleProvider };