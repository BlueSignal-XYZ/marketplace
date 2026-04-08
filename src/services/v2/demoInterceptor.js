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
    ph: { type: 'pH', unit: '' },
    tds_ppm: { type: 'TDS', unit: 'ppm' },
    ntu: { type: 'turbidity', unit: 'NTU' },
    temp_c: { type: 'temperature', unit: '°C' },
    orp_mv: { type: 'ORP', unit: 'mV' },
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
    siteId: device.siteId || null,
    battery: device.batteryLevel ?? 0,
    lastReadingAt: device.lastContact,
    deviceType: device.deviceType,
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
            new Date(device.lastCommissioned).getTime() + 90 * 24 * 60 * 60 * 1000
          ).toISOString(),
          offsets: {},
        }
      : undefined,
    latestReadings: mapLatestReadingsToSensorReadings(device.latestReadings, device.lastContact),
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

/** CloudMockAPI site → v2 Site (with legacy shape for SiteCard/SiteDetailPage compatibility) */
function toSite(site, allDevices) {
  const siteDeviceIds = allDevices.filter((d) => d.siteId === site.id).map((d) => d.id);

  const loc = {
    latitude: site.coordinates?.lat ?? 0,
    longitude: site.coordinates?.lng ?? 0,
    address: site.location || '',
    city: '',
    state: '',
    country: 'US',
  };

  return {
    id: site.id,
    name: site.name,
    ownerId: 'demo-user',
    customer: site.customer,
    coordinates: site.coordinates,
    status: site.status,
    deviceCount: site.deviceCount ?? siteDeviceIds.length,
    lastUpdate: site.lastUpdate,
    devices: siteDeviceIds,
    description: `${site.customer} — ${site.deviceCount ?? siteDeviceIds.length} devices`,
    location: loc,
    createdAt: site.lastUpdate,
    updatedAt: site.lastUpdate,
  };
}

// ── Exported API functions (match client.ts signatures) ──────────────────

/**
 * Get all devices for a user.
 * @returns {Promise<DeviceSummary[]>}
 */
export async function getDevices(_userId) {
  const devices = await CloudMockAPI.devices.getAll();
  return (devices || []).map(toDeviceSummary);
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
  return (alerts || []).map(toAlert);
}

/**
 * Get all alerts for a user.
 * @returns {Promise<Alert[]>}
 */
export async function getAlerts(_userId) {
  const alerts = await CloudMockAPI.alerts.getAll();
  return (alerts || []).map(toAlert);
}

/**
 * Get all sites for a user.
 * @returns {Promise<Site[]>}
 */
export async function getSites(_userId) {
  const [sites, devices] = await Promise.all([
    CloudMockAPI.sites.getAll(),
    CloudMockAPI.devices.getAll(),
  ]);
  return (sites || []).map((s) => toSite(s, devices || []));
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

// ── Revenue Grade (demo stubs) ───────────────────────────────────────────

export async function getRevenueGradeStatus(deviceId) {
  await new Promise((r) => setTimeout(r, 300));
  // First demo device has revenue grade enabled, others don't
  if (deviceId === 'pgw-demo-001') {
    return {
      enabled: true,
      enabledAt: '2026-01-15T00:00:00Z',
      baselineType: 'regulatory',
      baselineComplete: true,
      baselineProgress: null,
      baselineParams: { tn: 5.0, tp: 1.0 },
      baselineLockedAt: '2026-01-15T00:00:00Z',
      wqtProjectId: 'proj-demo-001',
      wqtLinked: true,
      calibrationStatus: { ph: 'valid', tds: 'valid', turbidity: 'expiring_soon', orp: 'valid' },
      uptime30d: 98.2,
      creditTotals: { nitrogen: 3.8, phosphorus: 1.2 },
      flowEstimate: { method: 'manual', value: 10, unit: 'm3/day' },
      huc12Code: '020700100101',
      watershedName: 'Lower James River',
      eligibleCredits: ['nitrogen', 'phosphorus'],
    };
  }
  return { enabled: false, calibrationStatus: {}, creditTotals: {}, eligibleCredits: [] };
}

export async function enableRevenueGrade(deviceId, params) {
  await new Promise((r) => setTimeout(r, 500));
  return { enabled: true, enabledAt: new Date().toISOString(), ...params };
}

export async function disableRevenueGrade(_deviceId) {
  await new Promise((r) => setTimeout(r, 300));
}

// ── Calibrations (demo stubs) ────────────────────────────────────────────

export async function getCalibrations(deviceId) {
  await new Promise((r) => setTimeout(r, 300));
  const now = Date.now();
  return [
    {
      id: 'cal-demo-1',
      deviceId,
      probeType: 'ph',
      calibratedAt: now - 30 * 86400000,
      calibratedBy: 'demo-user',
      standardsUsed: ['pH 4.0 buffer', 'pH 7.0 buffer', 'pH 10.0 buffer'],
      offsetValue: 0.02,
      slopeValue: 0.998,
      photoUrls: [],
      expiresAt: now + 60 * 86400000,
      status: 'valid',
    },
    {
      id: 'cal-demo-2',
      deviceId,
      probeType: 'tds',
      calibratedAt: now - 30 * 86400000,
      calibratedBy: 'demo-user',
      standardsUsed: ['500 ppm'],
      offsetValue: 0,
      slopeValue: null,
      photoUrls: [],
      expiresAt: now + 60 * 86400000,
      status: 'valid',
    },
  ];
}

export async function logCalibration(deviceId, calibration) {
  await new Promise((r) => setTimeout(r, 500));
  return {
    id: `cal-demo-${Date.now()}`,
    deviceId,
    probeType: calibration.probe_type,
    calibratedAt: Date.now(),
    calibratedBy: 'demo-user',
    standardsUsed: calibration.standards_used || [],
    offsetValue: calibration.offset_value || 0,
    slopeValue: calibration.slope_value || null,
    photoUrls: [],
    expiresAt: Date.now() + 90 * 86400000,
    status: 'valid',
  };
}

// ── Device Commands (demo stubs) ─────────────────────────────────────────

export async function sendDeviceCommand(_deviceId, _command) {
  await new Promise((r) => setTimeout(r, 400));
  return {
    commandId: `cmd-demo-${Date.now()}`,
    status: 'queued',
    message: "Command queued — will be delivered on the device's next uplink (demo mode).",
  };
}

// ── HUC Lookup (demo stub) ───────────────────────────────────────────────

export async function lookupHUC(_lat, _lng) {
  await new Promise((r) => setTimeout(r, 300));
  return {
    huc12: '020700100101',
    name: 'Lower James River',
    state: 'VA',
    impairments: ['nitrogen', 'phosphorus'],
    activeTmdl: true,
    tradingProgram: 'VA Nutrient Credit Exchange',
    distance: 12.5,
  };
}

// ── Account Linking (demo stubs) ─────────────────────────────────────────

export async function getWQTLinkStatus() {
  await new Promise((r) => setTimeout(r, 200));
  return {
    linked: true,
    linkedAt: '2026-01-10T00:00:00Z',
    consentedDevices: ['pgw-demo-001'],
    revokedAt: null,
  };
}

export async function linkWQTAccount(_deviceIds) {
  await new Promise((r) => setTimeout(r, 500));
  return { linked: true, linkedAt: new Date().toISOString() };
}

// ── Credit Projects (demo stubs) ─────────────────────────────────────────

export async function registerCreditProject(params) {
  await new Promise((r) => setTimeout(r, 800));
  return {
    id: `proj-demo-${Date.now()}`,
    deviceId: params.device_id,
    siteName: params.site_name || 'Demo Site',
    huc12Code: params.huc12_code || '020700100101',
    watershedName: params.watershed_name || 'Lower James River',
    baselineType: params.baseline_type || 'monitoring',
    baselineComplete: params.baseline_type !== 'monitoring',
    eligibleCredits: params.eligible_credits || ['nitrogen', 'phosphorus'],
    status: params.baseline_type === 'monitoring' ? 'pending_baseline' : 'active',
    totalCredits: {},
    createdAt: new Date().toISOString(),
  };
}

export async function getCreditProject(projectId) {
  await new Promise((r) => setTimeout(r, 300));
  return {
    id: projectId,
    deviceId: 'pgw-demo-001',
    siteName: 'Demo Pond',
    huc12Code: '020700100101',
    watershedName: 'Lower James River',
    baselineType: 'regulatory',
    baselineComplete: true,
    eligibleCredits: ['nitrogen', 'phosphorus'],
    status: 'active',
    totalCredits: { nitrogen: 3.8, phosphorus: 1.2 },
    createdAt: '2026-01-15T00:00:00Z',
  };
}

export async function getCreditAccruals(projectId) {
  await new Promise((r) => setTimeout(r, 300));
  return [
    {
      id: 'accrual-demo-1',
      projectId,
      periodStart: Date.now() - 30 * 86400000,
      periodEnd: Date.now(),
      creditType: 'nitrogen',
      amount: 1.2,
      unit: 'lbs',
      baselineValue: 5.0,
      measuredValue: 2.1,
      uptimePct: 98.2,
      calibrationValid: true,
      status: 'verified',
    },
    {
      id: 'accrual-demo-2',
      projectId,
      periodStart: Date.now() - 30 * 86400000,
      periodEnd: Date.now(),
      creditType: 'phosphorus',
      amount: 0.4,
      unit: 'lbs',
      baselineValue: 1.0,
      measuredValue: 0.6,
      uptimePct: 98.2,
      calibrationValid: true,
      status: 'pending_verification',
    },
  ];
}

// ── WQT Marketplace (demo listings) ─────────────────────────

const DEMO_LISTINGS = [
  {
    id: 'demo-listing-1',
    creditId: 'CR-N-2025-001',
    nutrientType: 'nitrogen',
    quantity: 450,
    pricePerCredit: 12.5,
    region: 'Chesapeake Bay, VA',
    verificationLevel: 'sensor-verified',
    sellerName: 'BlueSignal Demo Farm',
    vintage: '2025',
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'demo-listing-2',
    creditId: 'CR-P-2025-002',
    nutrientType: 'phosphorus',
    quantity: 180,
    pricePerCredit: 18.75,
    region: 'James River Watershed',
    verificationLevel: 'third-party',
    sellerName: 'Virginia Agri Co.',
    vintage: '2025',
    status: 'active',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'demo-listing-3',
    creditId: 'CR-N-2024-003',
    nutrientType: 'nitrogen',
    quantity: 320,
    pricePerCredit: 10.0,
    region: 'Maryland Eastern Shore',
    verificationLevel: 'self-reported',
    sellerName: 'Eastern Shore Credits LLC',
    vintage: '2024',
    status: 'active',
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  },
  {
    id: 'demo-listing-4',
    creditId: 'CR-NP-2025-004',
    nutrientType: 'combined',
    quantity: 200,
    pricePerCredit: 22.0,
    region: 'Potomac River Basin',
    verificationLevel: 'sensor-verified',
    sellerName: 'Potomac Water Quality Co.',
    vintage: '2025',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'demo-listing-5',
    creditId: 'CR-P-2024-005',
    nutrientType: 'phosphorus',
    quantity: 95,
    pricePerCredit: 15.5,
    region: 'Shenandoah Valley',
    verificationLevel: 'third-party',
    sellerName: 'Shenandoah Farm Credits',
    vintage: '2024',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

/**
 * Demo marketplace search — returns sample listings with filtering.
 * @returns {Promise<{ data: ListingSummary[], pagination: {...} }>}
 */
export async function searchListings(params = {}) {
  await new Promise((r) => setTimeout(r, 200));

  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const query = (params.query || '').toLowerCase();
  const nutrientType = params.nutrientType;
  const verificationLevel = params.verificationLevel;

  let filtered = [...DEMO_LISTINGS];

  if (query) {
    filtered = filtered.filter(
      (l) =>
        (l.creditId || '').toLowerCase().includes(query) ||
        (l.region || '').toLowerCase().includes(query) ||
        (l.sellerName || '').toLowerCase().includes(query)
    );
  }
  if (nutrientType) {
    filtered = filtered.filter((l) => l.nutrientType === nutrientType);
  }
  if (verificationLevel) {
    filtered = filtered.filter((l) => l.verificationLevel === verificationLevel);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Demo getListing — returns a single listing by ID.
 */
export async function getListing(id) {
  await new Promise((r) => setTimeout(r, 150));
  const listing = DEMO_LISTINGS.find((l) => l.id === id);
  if (!listing) {
    throw Object.assign(new Error(`Listing "${id}" not found`), {
      name: 'ApiError',
      status: 404,
      code: 'NOT_FOUND',
    });
  }
  return {
    ...listing,
    sellerId: 'demo-seller',
    totalPrice: listing.quantity * listing.pricePerCredit,
    watershed: listing.region,
    description: `Demo listing for ${listing.nutrientType} credits. ${listing.verificationLevel} verification.`,
    updatedAt: listing.createdAt,
  };
}
