/**
 * Integration tests: User signup → onboarding → dashboard flows.
 *
 * These tests run against the Firebase Emulator Suite and exercise
 * the real Cloud Functions endpoints (auth.js) end-to-end.
 *
 * Prerequisites:
 *   npx firebase emulators:start --only auth,database,functions
 *
 * Run:
 *   npx vitest run --config vitest.integration.config.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestUser,
  writeUserProfile,
  apiRequest,
  clearAll,
  getAdminAuth,
  getAdminDb,
} from './setup';

// Import the role routing logic (pure function, no React deps)
import { getDefaultDashboardRoute } from '../../utils/roleRouting';

describe('User Signup → Onboarding → Dashboard (integration)', () => {
  beforeEach(async () => {
    await clearAll();
  });

  // ── 2A: Signup + onboarding + role routing ────────────

  it('creates auth account, completes onboarding, and writes profile to RTDB', async () => {
    // 1. Create user via Auth emulator
    const { uid, token } = await createTestUser('installer@test.com', 'TestPass123!', {
      emailVerified: true,
    });
    expect(uid).toBeTruthy();
    expect(token).toBeTruthy();

    // 2. Write initial profile (simulates what onUserCreate trigger does)
    await writeUserProfile(uid, {
      email: 'installer@test.com',
      role: 'installer',
      onboardingComplete: false,
    });

    // 3. Call onboarding completion endpoint
    const onboardingRes = await apiRequest('POST', '/user/onboarding/complete', {
      uid,
      onboardingData: {
        company: 'Test Install Co',
        phone: '555-0100',
        timezone: 'America/Chicago',
      },
    }, token);

    expect(onboardingRes.status).toBe(200);
    expect(onboardingRes.data.success).toBe(true);

    // 4. Verify profile in RTDB has onboardingComplete: true
    const db = getAdminDb();
    const snapshot = await db.ref(`users/${uid}/profile`).once('value');
    const profile = snapshot.val();

    expect(profile).toBeTruthy();
    expect(profile.onboardingComplete).toBe(true);
    expect(profile.company).toBe('Test Install Co');
    expect(profile.phone).toBe('555-0100');

    // 5. Verify role-based routing resolves to installer dashboard
    const route = getDefaultDashboardRoute(
      { role: 'installer' },
      'marketplace'
    );
    expect(route).toBe('/dashboard/installer');
  });

  it('returns correct dashboard route for each role', () => {
    // Pure function test — no emulator needed, but validates the routing
    // that the integration flow relies on
    expect(getDefaultDashboardRoute({ role: 'buyer' }, 'marketplace')).toBe('/dashboard/buyer');
    expect(getDefaultDashboardRoute({ role: 'seller' }, 'marketplace')).toBe('/dashboard/seller');
    expect(getDefaultDashboardRoute({ role: 'installer' }, 'marketplace')).toBe('/dashboard/installer');
    expect(getDefaultDashboardRoute({ role: 'admin' }, 'marketplace')).toBe('/marketplace');
    expect(getDefaultDashboardRoute(null, 'marketplace')).toBe('/');

    // Cloud mode always goes to /dashboard/main
    expect(getDefaultDashboardRoute({ role: 'installer' }, 'cloud')).toBe('/dashboard/main');
  });

  // ── 2B: Profile hydration after auth ──────────────────

  it('authenticated user profile hydrates via /user/profile/get', async () => {
    // 1. Create user + write profile (setup)
    const { uid, token } = await createTestUser('buyer@test.com');
    await writeUserProfile(uid, {
      email: 'buyer@test.com',
      displayName: 'Jane Buyer',
      role: 'buyer',
      company: 'AquaCorp',
      phone: '555-0200',
      onboardingComplete: true,
    });

    // 2. Call profile get endpoint
    const res = await apiRequest('POST', '/user/profile/get', { uid }, token);

    expect(res.status).toBe(200);
    expect(res.data.uid).toBe(uid);
    expect(res.data.email).toBe('buyer@test.com');
    expect(res.data.displayName).toBe('Jane Buyer');
    expect(res.data.role).toBe('buyer');
    expect(res.data.company).toBe('AquaCorp');
    expect(res.data.phone).toBe('555-0200');
    expect(res.data.onboardingComplete).toBe(true);
  });

  // ── 2C: Session expiration / invalid token ────────────

  it('expired/invalid token returns 401 on protected endpoint', async () => {
    // Use a garbage token
    const res = await apiRequest(
      'POST',
      '/user/profile/update',
      { uid: 'fake-uid', profileData: { displayName: 'Hacker' } },
      'invalid-garbage-token-12345'
    );

    expect(res.status).toBe(401);
    expect(res.data.error).toBeTruthy();
  });

  it('missing auth header returns 401 on protected endpoint', async () => {
    const res = await apiRequest(
      'POST',
      '/user/profile/update',
      { uid: 'fake-uid', profileData: { displayName: 'No Token' } }
      // No token
    );

    expect(res.status).toBe(401);
  });

  // ── 2D: Email verification ────────────────────────────

  it('unverified user can still call profile endpoint but email_verified is false', async () => {
    // 1. Create user with email NOT verified
    const { uid, token } = await createTestUser('unverified@test.com', 'TestPass123!', {
      emailVerified: false,
    });

    // Write profile
    await writeUserProfile(uid, {
      email: 'unverified@test.com',
      role: 'buyer',
      onboardingComplete: false,
    });

    // 2. Can still get profile (backend doesn't block unverified users from reads)
    const profileRes = await apiRequest('POST', '/user/profile/get', { uid }, token);
    expect(profileRes.status).toBe(200);
    expect(profileRes.data.email).toBe('unverified@test.com');

    // 3. Check auth record — emailVerified should be false
    const adminAuth = getAdminAuth();
    const userRecord = await adminAuth.getUser(uid);
    expect(userRecord.emailVerified).toBe(false);

    // 4. Mark email as verified via Admin SDK
    await adminAuth.updateUser(uid, { emailVerified: true });

    // 5. Verify it's now true
    const updatedRecord = await adminAuth.getUser(uid);
    expect(updatedRecord.emailVerified).toBe(true);
  });

  it('profile update requires matching uid (cannot update another user)', async () => {
    // Create two users
    const user1 = await createTestUser('user1@test.com');
    const user2 = await createTestUser('user2@test.com');

    await writeUserProfile(user1.uid, { email: 'user1@test.com', role: 'buyer' });
    await writeUserProfile(user2.uid, { email: 'user2@test.com', role: 'seller' });

    // User1 tries to update User2's profile
    const res = await apiRequest(
      'POST',
      '/user/profile/update',
      { uid: user2.uid, profileData: { displayName: 'Hijacked' } },
      user1.token
    );

    expect(res.status).toBe(403);
    expect(res.data.error).toContain('Forbidden');
  });
});
