// Firebase configuration for WaterQuality.Trading
// This config is used exclusively by WQT authentication components

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// WQT-specific Firebase configuration
const firebaseWqtConfig = {
  apiKey: import.meta.env.VITE_WQT_FIREBASE_API_KEY || "AIzaSyAESUVCltG4kviQLIiiygIROJ7BKMMgvX8",
  authDomain: import.meta.env.VITE_WQT_FIREBASE_AUTH_DOMAIN || "waterquality-trading.firebaseapp.com",
  projectId: import.meta.env.VITE_WQT_FIREBASE_PROJECT_ID || "waterquality-trading",
  storageBucket: import.meta.env.VITE_WQT_FIREBASE_STORAGE_BUCKET || "waterquality-trading.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_WQT_FIREBASE_MESSAGING_SENDER_ID || "1006831487182",
  appId: import.meta.env.VITE_WQT_FIREBASE_APP_ID || "1:1006831487182:web:a58405168a345d8728689f",
  measurementId: import.meta.env.VITE_WQT_FIREBASE_MEASUREMENT_ID || "G-ECMFLV2Y6B"
};

// Initialize Firebase for WQT
const wqtApp = initializeApp(firebaseWqtConfig, "wqt");
const wqtDb = getDatabase(wqtApp);
const wqtAuth = getAuth(wqtApp);
const wqtGoogleProvider = new GoogleAuthProvider();

export { wqtAuth as auth, wqtDb as db, wqtGoogleProvider as googleProvider };
