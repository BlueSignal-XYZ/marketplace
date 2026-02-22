/**
 * Integration tests: Device registration, commissioning, and alerts.
 *
 * These tests run against the Firebase Emulator Suite and exercise
 * the real Cloud Functions endpoints end-to-end.
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
  getAdminDb,
} from './setup';

describe('Device Registration → Readings → Dashboard (integration)', () => {
  let installer: { uid: string; token: string };

  beforeEach(async () => {
    await clearAll();

    // Create an installer user for all device tests
    installer = await createTestUser('installer@test.com', 'TestPass123!', {
      emailVerified: true,
    });
    await writeUserProfile(installer.uid, {
      email: 'installer@test.com',
      role: 'installer',
      company: 'Test Install Co',
      onboardingComplete: true,
    });
  });

  // ── 3A: Device registration + readings ────────────────

  it('registered device with readings appears in device data', async () => {
    const db = getAdminDb();
    const deviceId = 'pgw-test-0001';

    // 1. Create a site directly in RTDB
    const siteId = 'site-test-001';
    await db.ref(`sites/${siteId}`).set({
      name: 'Test Lake Site',
      type: 'lake',
      ownerId: installer.uid,
      location: {
        address: '123 Lake Rd',
        city: 'Testville',
        state: 'MD',
        country: 'US',
        coordinates: { lat: 39.5, lng: -79.3 },
      },
      devices: [deviceId],
    });

    // 2. Register a device in RTDB
    await db.ref(`devices/${deviceId}`).set({
      serialNumber: 'BS-0001-000001',
      type: 'buoy',
      model: 'WQM-1',
      firmware: 'v2.4.1',
      ownership: {
        ownerId: installer.uid,
        purchaseDate: Date.now(),
      },
      installation: {
        status: 'active',
        siteId,
        installerId: installer.uid,
        commissionedAt: Date.now(),
        location: { lat: 39.5, lng: -79.3 },
      },
      health: {
        lastSeen: Date.now(),
        batteryLevel: 85,
        signalStrength: 92,
      },
    });

    // 3. Write a mock reading to RTDB
    const readingTimestamp = Date.now();
    await db.ref(`readings/${deviceId}/${readingTimestamp}`).set({
      timestamp: readingTimestamp,
      deviceId,
      siteId,
      sensors: {
        temperature: { value: 18.4, unit: '°C' },
        ph: { value: 7.2, unit: '' },
        turbidity: { value: 2.3, unit: 'NTU' },
      },
      metadata: { source: 'test' },
    });

    // 4. Verify device exists in RTDB
    const deviceSnapshot = await db.ref(`devices/${deviceId}`).once('value');
    expect(deviceSnapshot.exists()).toBe(true);
    const deviceData = deviceSnapshot.val();
    expect(deviceData.installation.siteId).toBe(siteId);
    expect(deviceData.installation.status).toBe('active');

    // 5. Verify reading exists
    const readingSnapshot = await db.ref(`readings/${deviceId}/${readingTimestamp}`).once('value');
    expect(readingSnapshot.exists()).toBe(true);
    const reading = readingSnapshot.val();
    expect(reading.sensors.temperature.value).toBe(18.4);
    expect(reading.sensors.ph.value).toBe(7.2);

    // 6. Verify site has the device
    const siteSnapshot = await db.ref(`sites/${siteId}`).once('value');
    const site = siteSnapshot.val();
    expect(site.devices).toContain(deviceId);
  });

  // ── 3B: Commission lifecycle ──────────────────────────

  it('commission lifecycle: create → runTests → complete', async () => {
    const db = getAdminDb();
    const deviceId = 'pgw-test-0002';

    // Setup: create a device
    await db.ref(`devices/${deviceId}`).set({
      serialNumber: 'BS-0001-000002',
      type: 'buoy',
      ownership: { ownerId: installer.uid },
      installation: { status: 'registered' },
    });

    // 1. Initiate commission via Cloud Functions
    const createRes = await apiRequest(
      'POST',
      '/commission/initiate',
      { deviceId, siteId: 'site-test-001' },
      installer.token
    );

    expect(createRes.status).toBe(200);
    expect(createRes.data.success).toBe(true);
    const commissionId = createRes.data.commissionId;
    expect(commissionId).toBeTruthy();

    // 2. Verify commission record exists with status 'initiated'
    const commissionSnapshot = await db.ref(`commissions/${commissionId}`).once('value');
    expect(commissionSnapshot.exists()).toBe(true);
    const commission = commissionSnapshot.val();
    expect(commission.status).toBe('initiated');
    expect(commission.deviceId).toBe(deviceId);

    // 3. Run tests
    const testRes = await apiRequest(
      'POST',
      '/commission/run-tests',
      {
        commissionId,
        deviceId,
        tests: ['power_os', 'ads1115', 'ds18b20'],
      },
      installer.token
    );

    expect(testRes.status).toBe(200);

    // 4. Complete commission
    const completeRes = await apiRequest(
      'POST',
      '/commission/complete',
      { commissionId },
      installer.token
    );

    expect(completeRes.status).toBe(200);
    expect(completeRes.data.success).toBe(true);

    // 5. Verify final commission status
    const finalSnapshot = await db.ref(`commissions/${commissionId}`).once('value');
    const finalCommission = finalSnapshot.val();
    expect(finalCommission.status).toBe('completed');

    // 6. Verify device status updated to 'active'
    const deviceSnapshot = await db.ref(`devices/${deviceId}/installation/status`).once('value');
    expect(deviceSnapshot.val()).toBe('active');

    // 7. Verify via list endpoint filtered by deviceId
    const listRes = await apiRequest(
      'POST',
      '/commission/list',
      { filters: { deviceId } },
      installer.token
    );

    expect(listRes.status).toBe(200);
    const commissions = listRes.data.commissions || [];
    expect(commissions.length).toBeGreaterThanOrEqual(1);
    expect(commissions[0].deviceId).toBe(deviceId);
  });

  // ── 3C: Alert lifecycle ───────────────────────────────

  it('alert acknowledge → resolve → reopen persists state', async () => {
    const db = getAdminDb();
    const deviceId = 'pgw-test-0003';
    const alertId = 'alert-test-001';

    // Setup: create device + alert
    await db.ref(`devices/${deviceId}`).set({
      serialNumber: 'BS-0001-000003',
      type: 'buoy',
      ownership: { ownerId: installer.uid },
      installation: { status: 'active' },
    });

    await db.ref(`alerts/${alertId}`).set({
      deviceId,
      siteId: 'site-test-001',
      ownerId: installer.uid,
      type: 'threshold',
      severity: 'warning',
      status: 'active',
      trigger: {
        parameter: 'pH',
        condition: 'above',
        threshold: 8.5,
        actualValue: 8.7,
      },
      timestamps: {
        triggered: Date.now(),
      },
    });

    // 1. Acknowledge alert
    const ackRes = await apiRequest(
      'POST',
      '/alerts/acknowledge',
      { alertId },
      installer.token
    );
    expect(ackRes.status).toBe(200);

    // Verify status changed
    let alertSnapshot = await db.ref(`alerts/${alertId}/status`).once('value');
    expect(alertSnapshot.val()).toBe('acknowledged');

    // 2. Resolve alert
    const resolveRes = await apiRequest(
      'POST',
      '/alerts/resolve',
      { alertId, resolution: 'pH sensor recalibrated' },
      installer.token
    );
    expect(resolveRes.status).toBe(200);

    alertSnapshot = await db.ref(`alerts/${alertId}/status`).once('value');
    expect(alertSnapshot.val()).toBe('resolved');

    // 3. Reopen alert
    const reopenRes = await apiRequest(
      'POST',
      '/alerts/reopen',
      { alertId },
      installer.token
    );
    expect(reopenRes.status).toBe(200);

    alertSnapshot = await db.ref(`alerts/${alertId}/status`).once('value');
    expect(alertSnapshot.val()).toBe('active');
  });
});
