/**
 * Integration smoke test stubs — SUPERSEDED by real integration tests.
 *
 * Real integration tests now live at:
 *   src/tests/integration/user-flows.test.ts
 *   src/tests/integration/device-flows.test.ts
 *
 * Run them with: npm run test:integration
 * (requires Firebase Emulator Suite running)
 *
 * These stubs are kept as .skip so they appear in the unit test report
 * as a reminder of the integration test scope.
 */

describe.skip('User Signup → Onboarding → Dashboard (integration)', () => {
  it.todo('creates a new user via Firebase Auth → see user-flows.test.ts');
  it.todo('writes profile via /user/profile/get after onboarding → see user-flows.test.ts');
  it.todo('returns correct role-based dashboard route → see user-flows.test.ts');
  it.todo('hydrates profile on page refresh → see user-flows.test.ts');
});

describe.skip('TTN Uplink → RTDB → Dashboard (integration)', () => {
  it.todo('ingests a reading via TTN webhook endpoint → see device-flows.test.ts');
  it.todo('writes reading to RTDB under correct device path → see device-flows.test.ts');
  it.todo('reading appears in DeviceDetailPage data → see device-flows.test.ts');
});

describe.skip('Commissioning Flow (integration)', () => {
  it.todo('initiates commissioning for a registered device → see device-flows.test.ts');
  it.todo('completes commissioning and updates device status → see device-flows.test.ts');
  it.todo('commissioned device appears in site device list → see device-flows.test.ts');
});
