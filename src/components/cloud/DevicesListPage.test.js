import { describe, it, expect } from 'vitest';

/**
 * Unit tests for the device dedup/merge logic used in DevicesListPage.
 *
 * The loadDevices function merges devices from two sources using a Map:
 *   1. v2 API devices (shaped DeviceSummary[])
 *   2. Firebase RTDB devices (raw device records)
 * The Map dedup ensures last-write-wins by device ID (RTDB overrides v2).
 */

// Extract the merge logic into a testable pure function
function mergeDeviceSources(v2Devices, firebaseDevices) {
  const deviceMap = new Map();

  // Source 1: v2 API
  (v2Devices || []).forEach((d) => {
    deviceMap.set(d.id, {
      ...d,
      lifecycle: d.lifecycle || 'active',
    });
  });

  // Source 2: Firebase RTDB (overwrites v2 if same ID)
  (firebaseDevices || []).forEach((d) => {
    deviceMap.set(d.id, {
      ...d,
      siteName: d.siteName || 'Unassigned',
      customer: d.customer || '-',
      status: d.lifecycle === 'active' ? 'online' : 'offline',
      lastContact: d.updatedAt || d.createdAt,
      batteryLevel: d.batteryLevel || 100,
      gatewayId: d.id,
      gatewayName: d.name || d.serialNumber,
    });
  });

  return Array.from(deviceMap.values());
}

describe('DevicesListPage — mergeDeviceSources', () => {
  it('returns empty array when both sources are empty', () => {
    expect(mergeDeviceSources([], [])).toEqual([]);
  });

  it('returns v2 devices when Firebase source is empty', () => {
    const v2 = [{ id: 'pgw-0001', name: 'Buoy 1', status: 'online' }];
    const result = mergeDeviceSources(v2, []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('pgw-0001');
    expect(result[0].lifecycle).toBe('active');
  });

  it('returns Firebase devices when v2 source is empty', () => {
    const fb = [{ id: 'pgw-0002', name: 'Probe', lifecycle: 'active', serialNumber: 'SN-002' }];
    const result = mergeDeviceSources([], fb);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('pgw-0002');
    expect(result[0].status).toBe('online');
    expect(result[0].siteName).toBe('Unassigned');
  });

  it('deduplicates devices with the same ID (Firebase wins)', () => {
    const v2 = [{ id: 'pgw-0001', name: 'V2 Name', status: 'online' }];
    const fb = [
      { id: 'pgw-0001', name: 'Firebase Name', lifecycle: 'active', serialNumber: 'SN-001' },
    ];
    const result = mergeDeviceSources(v2, fb);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Firebase Name'); // Firebase overwrites v2
  });

  it('merges unique devices from both sources', () => {
    const v2 = [{ id: 'pgw-0001', name: 'Buoy 1' }];
    const fb = [{ id: 'pgw-0002', name: 'Probe 1', serialNumber: 'SN-002' }];
    const result = mergeDeviceSources(v2, fb);
    expect(result).toHaveLength(2);
    const ids = result.map((d) => d.id);
    expect(ids).toContain('pgw-0001');
    expect(ids).toContain('pgw-0002');
  });

  it('defaults lifecycle to active for v2 devices without lifecycle', () => {
    const v2 = [{ id: 'pgw-0001', name: 'Test' }];
    const result = mergeDeviceSources(v2, []);
    expect(result[0].lifecycle).toBe('active');
  });

  it('maps lifecycle to status for Firebase devices', () => {
    const fbActive = [{ id: 'd1', lifecycle: 'active', serialNumber: 'SN' }];
    const fbInactive = [{ id: 'd2', lifecycle: 'registered', serialNumber: 'SN2' }];
    const result = mergeDeviceSources([], [...fbActive, ...fbInactive]);
    const d1 = result.find((d) => d.id === 'd1');
    const d2 = result.find((d) => d.id === 'd2');
    expect(d1.status).toBe('online');
    expect(d2.status).toBe('offline');
  });

  it('handles null inputs gracefully', () => {
    expect(mergeDeviceSources(null, null)).toEqual([]);
    expect(mergeDeviceSources(undefined, undefined)).toEqual([]);
  });
});
