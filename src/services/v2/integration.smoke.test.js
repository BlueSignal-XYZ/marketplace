// Integration smoke tests — designed to run against deployed/emulated backend
// These are NOT unit tests. They require Firebase Emulator or a live staging environment.
// Run separately from the unit test suite.

describe.skip('User Signup → Onboarding → Dashboard (integration)', () => {
  it.todo('creates a new user via Firebase Auth');
  it.todo('writes profile via /user/profile/get after onboarding');
  it.todo('returns correct role-based dashboard route');
  it.todo('hydrates profile on page refresh');
});

describe.skip('TTN Uplink → RTDB → Dashboard (integration)', () => {
  it.todo('ingests a reading via TTN webhook endpoint');
  it.todo('writes reading to RTDB under correct device path');
  it.todo('reading appears in DeviceDetailPage data');
});

describe.skip('Commissioning Flow (integration)', () => {
  it.todo('initiates commissioning for a registered device');
  it.todo('completes commissioning and updates device status');
  it.todo('commissioned device appears in site device list');
});
