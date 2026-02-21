/**
 * Demo Mode Interceptor — CloudMockAPI → v2 API shape adapter.
 *
 * When demo mode is active (?demo=1 or VITE_DEMO_MODE=true), these functions
 * replace the real v2 client calls. They fetch data from CloudMockAPI and
 * map it into the exact response shapes expected by v2 consumers
 * (CloudDashboardPage, DeviceDetailPage, CommissioningWizardPage, etc.).
 *
 * This file MUST export the same function signatures as client.ts.
 */

import { CloudMockAPI } from '../cloudMockAPI';

// ── Field map: v2 metric IDs → CloudMockAPI time-series field names ──────

const metricFieldMap = {
  pH: 'ph',
  TDS: 'tds_ppm',
  turbidity: 'ntu',
  temperature: 'temp_c',
  ORP: 'orp_mv',
};

// ── Unit map for SensorReading conversion ────────────────────────────────

const sensorUnits = {
  pH: '',
  TDS: 'ppm',
  turbidity: 'NTU',
  temperature: '°C',
  ORP: 'mV',
};

// ── Helpers ──────────────────────────────────────────────────────────────

/** Map CloudMockAPI device.status to v2 DeviceStatus */
function mapDeviceStatus(status) {
  if (status === 'online') return 'active';
  if (status === 'warning') return 'maintenance';
  return 'inactive'; // offline, unknown
}

/** Map CloudMockAPI device.status to v2 OnlineStatus */
function mapOnlineStatus(status) {
  if (status === 'online' || status === 'warning') return 'online';
  if (status === 'offline') return 'offline';
  return 'unknown';
}

/** Map CloudMockAPI alert.status to v2 AlertStatus */
function mapAlertStatus(status) {
  if (status === 'open') return 'active';
  if (status === 'acknowledged') return 'acknowledged';
  if (status === 'resolved') return 'resolved';
  return 'active';
}

/**
 * Convert CloudMockAPI flat readings object to v2 SensorReading[] array.
 * Filters out null/undefined values and non-sensor fields.
 */
function mapLatestReadingsToSensorReadings(readings, timestamp) {
  if (!readings) return [];

  const fieldToReading = {
    ph:      { type: 'pH',          unit: '' },
    tds_ppm: { type: 'TDS',         unit: 'ppm' },
    ntu:     { type: 'turbidity',   unit: 'NTU' },
    temp_c:  { type: 'temperature', unit: '°C' },
    orp_mv:  { type: 'ORP',         unit: 'mV' },
  };

  const result = [];
  for (const [field, meta] of Object.entries(fieldToReading)) {
    if (readings[field] != null) {
      result.push({
        type: meta.type,
        value: readings[field],
        unit: meta.unit,
        timestamp: timestamp || new Date().toISOString(),
      });
    }
  }
  return result;
}

// Stable credits per device (seeded by device index to avoid random flicker)
const deviceCredits = {};
function getCreditsForDevice(deviceId) {
  if (!deviceCredits[deviceId]) {
    // Simple hash → deterministic number
    let hash = 0;
    for (let i = 0; i < deviceId.length; i++) {
      hash = ((hash << 5) - hash + deviceId.charCodeAt(i)) | 0;
    }
    deviceCredits[deviceId] = Math.abs(hash % 80) + 5;
  }
  return deviceCredits[deviceId];
}

// ── Shape mappers ────────────────────────────────────────────────────────

/** CloudMockAPI device → v2 DeviceSummary */
function toDeviceSummary(device) {
  return {
    id: device.id,
    name: device.name,
    status: mapDeviceStatus(device.status),
    onlineStatus: mapOnlineStatus(device.status),
    battery: device.batteryLevel ?? 0,
    lastReadingAt: device.lastContact,
    location: {
      latitude: device.coordinates?.lat ?? 0,
      longitude: device.coordinates?.lng ?? 0,
      address: device.siteName || '',
      city: '',
      state: '',
      country: 'US',
    },
    creditsGenerated: getCreditsForDevice(device.id),
  };
}

/** CloudMockAPI device → v2 Device (full detail) */
function toDevice(device) {
  const summary = toDeviceSummary(device);
  const now = new Date().toISOString();

  return {
    ...summary,
    serialNumber: device.id.toUpperCase(),
    model: 'BS-WQM-100',
    firmwareVersion: device.firmwareVersion || 'v2.4.1',
    ownerId: 'demo-user',
    siteId: device.siteId || null,
    isPublicSharing: false,
    thresholds: {},
    calibration: device.lastCommissioned
      ? {
          lastCalibrated: device.lastCommissioned,
          calibratedBy: 'Field Installer',
          nextCalibrationDue: new Date(
            new Date(device.lastCommissioned).getTime() + 90 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          offsets: {},
        }
      : undefined,
    latestReadings: mapLatestReadingsToSensorReadings(
      device.latestReadings,
      device.lastContact,
    ),
    createdAt: device.lastCommissioned || now,
    updatedAt: device.lastContact || now,
  };
}

/** CloudMockAPI alert → v2 Alert */
function toAlert(alert) {
  return {
    id: alert.id,
    deviceId: alert.deviceId,
    deviceName: alert.deviceName,
    severity: alert.severity, // already 'info' | 'warning' | 'critical'
    status: mapAlertStatus(alert.status),
    type: alert.type || 'threshold_breach',
    message: alert.message,
    createdAt: alert.firstSeen,
    updatedAt: alert.lastSeen,
  };
}

/** CloudMockAPI site → v2 Site */
function toSite(site, allDevices) {
  const siteDeviceIds = allDevices
    .filter((d) => d.siteId === site.id)
    .map((d) => d.id);

  return {
    id: site.id,
    name: site.name,
    ownerId: 'demo-user',
    location: {
      latitude: site.coordinates?.lat ?? 0,
      longitude: site.coordinates?.lng ?? 0,
      address: site.location || '',
      city: '',
      state: '',
      country: 'US',
    },
    devices: siteDeviceIds,
    description: `${site.customer} — ${site.deviceCount} devices`,
    createdAt: site.lastUpdate,
    updatedAt: site.lastUpdate,
  };
}

// ── Exported API functions (match client.ts signatures) ──────────────────

/**
 * Get all devices for a user.
 * @returns {Promise<DeviceSummary[]>}
 */
export async function getDevices(userId) {
  const devices = await CloudMockAPI.devices.getAll();
  return devices.map(toDeviceSummary);
}

/**
 * Get a single device by ID.
 * @returns {Promise<Device>}
 */
export async function getDevice(deviceId) {
  const device = await CloudMockAPI.devices.getById(deviceId);
  if (!device) {
    throw Object.assign(new Error(`Device "${deviceId}" not found`), {
      name: 'ApiError',
      status: 404,
      code: 'NOT_FOUND',
    });
  }
  return toDevice(device);
}

/**
 * Get time-series metrics for a device.
 * @returns {Promise<MetricsResponse>}
 */
export async function getDeviceMetrics(deviceId, metric, range) {
  const data = await CloudMockAPI.devices.getTimeSeriesData(deviceId, range);
  const fieldName = metricFieldMap[metric];

  return {
    deviceId,
    metric,
    range,
    points: data
      .map((d) => ({
        timestamp: d.timestamp,
        value: fieldName && d[fieldName] != null ? d[fieldName] : null,
      }))
      .filter((p) => p.value != null),
    count: data.length,
  };
}

/**
 * Get alerts for a specific device.
 * @returns {Promise<Alert[]>}
 */
export async function getDeviceAlerts(deviceId) {
  const alerts = await CloudMockAPI.alerts.getByDevice(deviceId);
  return alerts.map(toAlert);
}

/**
 * Get all alerts for a user.
 * @returns {Promise<Alert[]>}
 */
export async function getAlerts(userId) {
  const alerts = await CloudMockAPI.alerts.getAll();
  return alerts.map(toAlert);
}

/**
 * Get all sites for a user.
 * @returns {Promise<Site[]>}
 */
export async function getSites(userId) {
  const [sites, devices] = await Promise.all([
    CloudMockAPI.sites.getAll(),
    CloudMockAPI.devices.getAll(),
  ]);
  return sites.map((s) => toSite(s, devices));
}

/**
 * Check if a device exists and its commissioning status.
 * @returns {Promise<DeviceCheckResult>}
 */
export async function checkDevice(deviceId) {
  const device = await CloudMockAPI.devices.getById(deviceId);
  if (device) {
    return {
      deviceId,
      exists: true,
      isCommissioned: device.commissionStatus === 'commissioned',
      status: device.status,
    };
  }
  // In demo mode, pretend unknown serials are valid un-commissioned devices
  return {
    deviceId,
    exists: true,
    isCommissioned: false,
    status: null,
  };
}

/**
 * Test connection to a device.
 * @returns {Promise<ConnectionTestResult>}
 */
export async function testDeviceConnection(deviceId) {
  // Simulate a brief connection delay
  await new Promise((r) => setTimeout(r, 1200));
  return {
    deviceId,
    connected: true,
    signal: 'excellent',
    latency: 42,
    simulated: true,
    message: 'Demo mode — connection simulated successfully.',
  };
}

/**
 * Commission a device.
 * @returns {Promise<CommissionResult>}
 */
export async function commissionDevice(params) {
  // Simulate commissioning delay
  await new Promise((r) => setTimeout(r, 1500));
  return {
    deviceId: params.deviceId,
    siteId: params.siteId || 'site-demo-1',
    commissionId: `comm-demo-${Date.now()}`,
    status: 'commissioned',
    commissionedAt: new Date().toISOString(),
  };
}

/**
 * Create a site.
 * @returns {Promise<Site>}
 */
export async function createSite(params) {
  await new Promise((r) => setTimeout(r, 800));
  return {
    id: `site-demo-${Date.now()}`,
    name: params.name,
    ownerId: 'demo-user',
    location: {
      latitude: params.latitude || 0,
      longitude: params.longitude || 0,
      address: params.address || '',
      city: '',
      state: '',
      country: 'US',
    },
    devices: [],
    description: params.description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
