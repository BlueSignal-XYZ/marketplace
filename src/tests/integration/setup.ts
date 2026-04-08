/**
 * Integration test setup — connects to Firebase Emulator Suite.
 *
 * Prerequisites:
 *   npx firebase emulators:start --only auth,database,functions
 *
 * These tests are separated from unit tests and should NOT run in CI
 * until emulator startup is automated in the pipeline.
 */

import { initializeApp, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getDatabase, type Database } from 'firebase-admin/database';
import { beforeAll, afterAll } from 'vitest';
import axios from 'axios';

// ── Emulator configuration ──────────────────────────────

const PROJECT_ID = 'waterquality-trading';
const AUTH_EMULATOR = '127.0.0.1:9099';
const DB_EMULATOR = '127.0.0.1:9000';
const FUNCTIONS_EMULATOR = 'http://127.0.0.1:5001';

// Cloud Functions base URL (the Express app is mounted here)
export const FUNCTIONS_URL = `${FUNCTIONS_EMULATOR}/${PROJECT_ID}/us-central1/app`;

// ── Set emulator env vars BEFORE importing firebase-admin ─

process.env.FIREBASE_AUTH_EMULATOR_HOST = AUTH_EMULATOR;
process.env.FIREBASE_DATABASE_EMULATOR_HOST = DB_EMULATOR;
process.env.GCLOUD_PROJECT = PROJECT_ID;

// ── Initialize Firebase Admin for tests ──────────────────

let app: App;
let _auth: Auth;
let _db: Database;

beforeAll(() => {
  // Clean up any existing apps
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    app = initializeApp({
      projectId: PROJECT_ID,
      databaseURL: `http://${DB_EMULATOR}?ns=${PROJECT_ID}-default-rtdb`,
    });
  }

  _auth = getAuth(app);
  _db = getDatabase(app);
});

afterAll(async () => {
  // Don't delete the app — let vitest handle cleanup
});

// ── Helper utilities ─────────────────────────────────────

/**
 * Create a test user in the Auth emulator and return uid + token.
 */
export async function createTestUser(
  email: string,
  password: string = 'TestPass123!',
  opts: { displayName?: string; emailVerified?: boolean } = {}
): Promise<{ uid: string; token: string }> {
  const adminAuth = getAuth();

  // Create user in Auth emulator
  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: opts.displayName || email.split('@')[0],
    emailVerified: opts.emailVerified ?? true,
  });

  // Get a custom token and exchange for an ID token via the emulator REST API
  const customToken = await adminAuth.createCustomToken(userRecord.uid);
  const idToken = await exchangeCustomToken(customToken);

  return { uid: userRecord.uid, token: idToken };
}

/**
 * Exchange a custom token for an ID token via the Auth emulator REST API.
 */
async function exchangeCustomToken(customToken: string): Promise<string> {
  const res = await axios.post(
    `http://${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key`,
    {
      token: customToken,
      returnSecureToken: true,
    }
  );
  return res.data.idToken;
}

/**
 * Write a user profile directly to RTDB (bypassing Cloud Functions).
 * Useful for test setup.
 */
export async function writeUserProfile(
  uid: string,
  profile: Record<string, unknown>
): Promise<void> {
  const adminDb = getDatabase();
  await adminDb.ref(`users/${uid}`).set({
    profile: {
      email: profile.email || `${uid}@test.com`,
      displayName: profile.displayName || 'Test User',
      phone: profile.phone || '',
      company: profile.company || '',
      role: profile.role || 'buyer',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      onboardingComplete: profile.onboardingComplete ?? false,
      ...profile,
    },
    settings: {
      notifications: { email: true, sms: false, push: true },
      timezone: 'America/New_York',
      units: 'imperial',
    },
  });
}

/**
 * Make an authenticated API request to the Cloud Functions emulator.
 */
export async function apiRequest(
  method: 'GET' | 'POST',
  path: string,
  data?: Record<string, unknown>,
  token?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ status: number; data: any }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await axios({
      method,
      url: `${FUNCTIONS_URL}${path}`,
      data,
      headers,
      validateStatus: () => true, // Don't throw on non-2xx
    });

    return { status: res.status, data: res.data };
  } catch (error: unknown) {
    const axiosErr = error as { response?: { status?: number; data?: unknown }; message?: string };
    return {
      status: axiosErr.response?.status || 500,
      data: (axiosErr.response?.data as Record<string, unknown>) || { error: axiosErr.message },
    };
  }
}

/**
 * Clear all data from RTDB emulator.
 */
export async function clearDatabase(): Promise<void> {
  const adminDb = getDatabase();
  await adminDb.ref().set(null);
}

/**
 * Clear all users from Auth emulator.
 */
export async function clearAuth(): Promise<void> {
  try {
    // Auth emulator exposes a REST endpoint for clearing
    await axios.delete(`http://${AUTH_EMULATOR}/emulator/v1/projects/${PROJECT_ID}/accounts`);
  } catch {
    // Ignore errors if emulator isn't running
  }
}

/**
 * Clear all test state (auth + database).
 */
export async function clearAll(): Promise<void> {
  await Promise.all([clearAuth(), clearDatabase()]);
}

// Export admin instances for direct use in tests
export function getAdminAuth(): Auth {
  return getAuth();
}

export function getAdminDb(): Database {
  return getDatabase();
}
