/**
 * Tests for demoInterceptor cloud functions (devices, alerts, sites, commissioning, etc.).
 * These cover the v2 API shape mapping from CloudMockAPI.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Force demo mode
vi.mock('../../utils/demoMode', () => ({
  isDemoMode: vi.fn(() => true),
}));

// Mock CloudMockAPI with minimal data
const mockDevice = {
  id: 'pgw-demo-001',
  name: 'Demo Buoy 1',
  status: 'online',
  siteId: 'site-1',
  batteryLevel: 95,
  lastContact: '2026-01-01T00:00:00Z',
  deviceType: 'buoy',
  coordinates: { lat: 39.5, lng: -79.3 },
  siteName: 'Deep Creek Lake',
  firmwareVersion: 'v2.4.1',
  commissionStatus: 'commissioned',
  lastCommissioned: '2025-12-01T00:00:00Z',
  latestReadings: { ph: 7.2, tds_ppm: 350, ntu: 5.1, temp_c: 22.0, orp_mv: 210 },
};

const mockSite = {
  id: 'site-1',
  name: 'Deep Creek Lake',
  customer: 'Lake Association',
  location: 'Maryland, USA',
  coordinates: { lat: 39.5, lng: -79.3 },
  deviceCount: 5,
  status: 'online',
  lastUpdate: '2026-01-01T00:00:00Z',
};

const mockAlert = {
  id: 'alert-1',
  deviceId: 'pgw-demo-001',
  deviceName: 'Demo Buoy 1',
  severity: 'warning',
  status: 'open',
  type: 'threshold_breach',
  message: 'pH above threshold',
  firstSeen: '2026-01-01T00:00:00Z',
  lastSeen: '2026-01-01T01:00:00Z',
};

vi.mock('../cloudMockAPI', () => ({
  CloudMockAPI: {
    devices: {
      getAll: vi.fn(() => Promise.resolve([mockDevice])),
      getById: vi.fn((id) => Promise.resolve(id === 'pgw-demo-001' ? mockDevice : null)),
      getTimeSeriesData: vi.fn(() =>
        Promise.resolve([
          {
            timestamp: '2026-01-01T00:00:00Z',
            ph: 7.2,
            tds_ppm: 350,
            ntu: 5.1,
            temp_c: 22.0,
            orp_mv: 210,
          },
          {
            timestamp: '2026-01-01T01:00:00Z',
            ph: 7.3,
            tds_ppm: 355,
            ntu: 5.0,
            temp_c: 21.8,
            orp_mv: 215,
          },
        ])
      ),
    },
    sites: {
      getAll: vi.fn(() => Promise.resolve([mockSite])),
    },
    alerts: {
      getAll: vi.fn(() => Promise.resolve([mockAlert])),
      getByDevice: vi.fn(() => Promise.resolve([mockAlert])),
    },
  },
}));

describe('demoInterceptor cloud functions', () => {
  let mod;

  beforeEach(async () => {
    vi.resetModules();
    // Re-mock after resetModules
    vi.doMock('../../utils/demoMode', () => ({ isDemoMode: vi.fn(() => true) }));
    vi.doMock('../cloudMockAPI', () => ({
      CloudMockAPI: {
        devices: {
          getAll: vi.fn(() => Promise.resolve([mockDevice])),
          getById: vi.fn((id) => Promise.resolve(id === 'pgw-demo-001' ? mockDevice : null)),
          getTimeSeriesData: vi.fn(() =>
            Promise.resolve([{ timestamp: '2026-01-01T00:00:00Z', ph: 7.2, tds_ppm: 350 }])
          ),
        },
        sites: { getAll: vi.fn(() => Promise.resolve([mockSite])) },
        alerts: {
          getAll: vi.fn(() => Promise.resolve([mockAlert])),
          getByDevice: vi.fn(() => Promise.resolve([mockAlert])),
        },
      },
    }));
    mod = await import('./demoInterceptor');
  });

  describe('getDevices', () => {
    it('returns array of DeviceSummary shapes', async () => {
      const devices = await mod.getDevices('user-1');
      expect(Array.isArray(devices)).toBe(true);
      expect(devices[0]).toHaveProperty('id', 'pgw-demo-001');
      expect(devices[0]).toHaveProperty('status', 'active');
      expect(devices[0]).toHaveProperty('onlineStatus', 'online');
      expect(devices[0]).toHaveProperty('location');
      expect(devices[0]).toHaveProperty('creditsGenerated');
    });
  });

  describe('getDevice', () => {
    it('returns full Device shape for existing device', async () => {
      const device = await mod.getDevice('pgw-demo-001');
      expect(device).toHaveProperty('id', 'pgw-demo-001');
      expect(device).toHaveProperty('serialNumber');
      expect(device).toHaveProperty('model', 'BS-WQM-100');
      expect(device).toHaveProperty('latestReadings');
      expect(Array.isArray(device.latestReadings)).toBe(true);
    });

    it('throws ApiError for unknown device', async () => {
      await expect(mod.getDevice('nonexistent')).rejects.toThrow('not found');
    });
  });

  describe('getDeviceMetrics', () => {
    it('returns metrics response with points', async () => {
      const result = await mod.getDeviceMetrics('pgw-demo-001', 'pH', '24h');
      expect(result).toHaveProperty('deviceId', 'pgw-demo-001');
      expect(result).toHaveProperty('metric', 'pH');
      expect(result).toHaveProperty('points');
      expect(Array.isArray(result.points)).toBe(true);
    });
  });

  describe('getDeviceAlerts', () => {
    it('returns array of v2 Alert shapes', async () => {
      const alerts = await mod.getDeviceAlerts('pgw-demo-001');
      expect(Array.isArray(alerts)).toBe(true);
      expect(alerts[0]).toHaveProperty('id', 'alert-1');
      expect(alerts[0]).toHaveProperty('status', 'active');
      expect(alerts[0]).toHaveProperty('severity', 'warning');
    });
  });

  describe('getAlerts', () => {
    it('returns all alerts mapped to v2 shape', async () => {
      const alerts = await mod.getAlerts('user-1');
      expect(Array.isArray(alerts)).toBe(true);
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  describe('getSites', () => {
    it('returns sites mapped to v2 shape', async () => {
      const sites = await mod.getSites('user-1');
      expect(Array.isArray(sites)).toBe(true);
      expect(sites[0]).toHaveProperty('id', 'site-1');
      expect(sites[0]).toHaveProperty('name', 'Deep Creek Lake');
      expect(sites[0]).toHaveProperty('ownerId', 'demo-user');
      expect(sites[0]).toHaveProperty('location');
    });
  });

  describe('checkDevice', () => {
    it('returns commissioned status for known device', async () => {
      const result = await mod.checkDevice('pgw-demo-001');
      expect(result).toHaveProperty('deviceId', 'pgw-demo-001');
      expect(result).toHaveProperty('exists', true);
      expect(result).toHaveProperty('isCommissioned', true);
    });

    it('returns un-commissioned for unknown device', async () => {
      const result = await mod.checkDevice('unknown-device');
      expect(result).toHaveProperty('exists', true);
      expect(result).toHaveProperty('isCommissioned', false);
    });
  });

  describe('testDeviceConnection', () => {
    it('returns simulated connection result', async () => {
      const result = await mod.testDeviceConnection('pgw-demo-001');
      expect(result).toHaveProperty('connected', true);
      expect(result).toHaveProperty('signal', 'excellent');
      expect(result).toHaveProperty('simulated', true);
    });
  });

  describe('commissionDevice', () => {
    it('returns commission result', async () => {
      const result = await mod.commissionDevice({ deviceId: 'pgw-demo-001', siteId: 'site-1' });
      expect(result).toHaveProperty('deviceId', 'pgw-demo-001');
      expect(result).toHaveProperty('status', 'commissioned');
      expect(result).toHaveProperty('commissionId');
    });
  });

  describe('createSite', () => {
    it('returns created site', async () => {
      const result = await mod.createSite({ name: 'Test Site', latitude: 40.0, longitude: -80.0 });
      expect(result).toHaveProperty('name', 'Test Site');
      expect(result).toHaveProperty('ownerId', 'demo-user');
      expect(result.location.latitude).toBe(40.0);
    });
  });

  describe('getRevenueGradeStatus', () => {
    it('returns enabled status for pgw-demo-001', async () => {
      const result = await mod.getRevenueGradeStatus('pgw-demo-001');
      expect(result).toHaveProperty('enabled', true);
      expect(result).toHaveProperty('wqtLinked', true);
    });

    it('returns disabled status for other devices', async () => {
      const result = await mod.getRevenueGradeStatus('pgw-other');
      expect(result).toHaveProperty('enabled', false);
    });
  });

  describe('enableRevenueGrade', () => {
    it('returns enabled result', async () => {
      const result = await mod.enableRevenueGrade('pgw-demo-001', { baselineType: 'regulatory' });
      expect(result).toHaveProperty('enabled', true);
    });
  });

  describe('disableRevenueGrade', () => {
    it('resolves without error', async () => {
      await expect(mod.disableRevenueGrade('pgw-demo-001')).resolves.toBeUndefined();
    });
  });

  describe('getCalibrations', () => {
    it('returns calibration array', async () => {
      const result = await mod.getCalibrations('pgw-demo-001');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('probeType', 'ph');
    });
  });

  describe('logCalibration', () => {
    it('returns created calibration', async () => {
      const result = await mod.logCalibration('pgw-demo-001', {
        probe_type: 'ph',
        standards_used: ['pH 7.0'],
      });
      expect(result).toHaveProperty('probeType', 'ph');
      expect(result).toHaveProperty('status', 'valid');
    });
  });

  describe('sendDeviceCommand', () => {
    it('returns queued command', async () => {
      const result = await mod.sendDeviceCommand('pgw-demo-001', 'reboot');
      expect(result).toHaveProperty('status', 'queued');
      expect(result).toHaveProperty('commandId');
    });
  });

  describe('lookupHUC', () => {
    it('returns HUC data', async () => {
      const result = await mod.lookupHUC(39.5, -79.3);
      expect(result).toHaveProperty('huc12', '020700100101');
      expect(result).toHaveProperty('name', 'Lower James River');
    });
  });

  describe('getWQTLinkStatus', () => {
    it('returns linked status', async () => {
      const result = await mod.getWQTLinkStatus();
      expect(result).toHaveProperty('linked', true);
    });
  });

  describe('linkWQTAccount', () => {
    it('returns link result', async () => {
      const result = await mod.linkWQTAccount(['pgw-demo-001']);
      expect(result).toHaveProperty('linked', true);
    });
  });

  describe('registerCreditProject', () => {
    it('returns project result', async () => {
      const result = await mod.registerCreditProject({
        deviceId: 'pgw-demo-001',
        baselineType: 'regulatory',
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status');
    });
  });

  describe('getCreditProject', () => {
    it('returns project data', async () => {
      const result = await mod.getCreditProject('proj-1');
      expect(result).toHaveProperty('id', 'proj-1');
      expect(result).toHaveProperty('status');
    });
  });

  describe('getCreditAccruals', () => {
    it('returns accruals array', async () => {
      const result = await mod.getCreditAccruals('proj-1');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
