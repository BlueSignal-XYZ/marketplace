// /src/services/cloudMockAPI.js
// Mock API service for Cloud mode - provides realistic mock data
//
// IMPORTANT: This mock API is designed to be compatible with Pollution Gateway Pro (PGP).
//
// Data Flow Architecture:
//   Pollution Gateway Pro → HTTPS (run-uplink) → Central API (API_URL) → Cloud Frontend
//
// TODO: Replace all mock APIs below with real backend API calls that aggregate data
//       from Pollution Gateway Pro uploads (via gateway's API_URL ingest endpoint).
//       Do NOT call gateway SQLite directly. Do NOT require changes to PGP repo.
//
// PGP Sensor Field Names (must match exactly):
//   - temp_c: Temperature in Celsius
//   - ph: pH level
//   - ntu: Turbidity (Nephelometric Turbidity Units)
//   - tds_ppm: Total Dissolved Solids (parts per million)
//   - npk_n: Nitrogen (ppm)
//   - npk_p: Phosphorus (ppm)
//   - npk_k: Potassium (ppm)
//
// PGP Device ID Convention: pgw-XXXX (e.g., pgw-0001, pgw-0002)

/* -------------------------------------------------------------------------- */
/*                                 MOCK DATA                                  */
/* -------------------------------------------------------------------------- */

const MOCK_SITES = [
  {
    id: "site-1",
    name: "Deep Creek Lake",
    customer: "Lake Association",
    location: "Maryland, USA",
    coordinates: { lat: 39.5, lng: -79.3 },
    deviceCount: 5, // 2 buoys + 1 gateway + 1 emitter + 1 algae control
    status: "online",
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "site-2",
    name: "Johnson Farm",
    customer: "Johnson Agri Co.",
    location: "Iowa, USA",
    coordinates: { lat: 41.8, lng: -93.1 },
    deviceCount: 6,
    status: "warning",
    lastUpdate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "site-3",
    name: "Harbor Marina",
    customer: "Marina Management LLC",
    location: "California, USA",
    coordinates: { lat: 37.8, lng: -122.4 },
    deviceCount: 2,
    status: "offline",
    lastUpdate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_DEVICES = [
  {
    id: "pgw-0001",
    name: "Lakefront Buoy #1",
    alias: "Buoy North Shore",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    customer: "Lake Association",
    deviceType: "Water Quality Buoy",
    status: "online",
    commissionStatus: "commissioned",
    lastCommissioned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastContact: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    gatewayId: "pgw-0001",
    gatewayName: "Lakefront Buoy #1",
    gatewayWebUrl: "http://10.0.1.101:8080",
    gatewayIp: "10.0.1.101",
    batteryLevel: 87,
    signalStrength: 95,
    firmwareVersion: "v2.4.1",
    coordinates: { lat: 39.5, lng: -79.3 },
    latestReadings: {
      temp_c: 18.4,
      ph: 7.2,
      ntu: 2.3,
      tds_ppm: 245,
      npk_n: null,
      npk_p: null,
      npk_k: null,
    },
  },
  {
    id: "pgw-0002",
    name: "East Field Soil Probe",
    alias: "Soil Probe East",
    siteId: "site-2",
    siteName: "Johnson Farm",
    customer: "Johnson Agri Co.",
    deviceType: "Soil NPK Probe",
    status: "warning",
    commissionStatus: "failed",
    lastCommissioned: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastContact: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    gatewayId: "pgw-0002",
    gatewayName: "East Field Soil Probe",
    gatewayWebUrl: "http://10.0.2.201:8080",
    gatewayIp: "10.0.2.201",
    batteryLevel: 23,
    signalStrength: 72,
    firmwareVersion: "v2.3.8",
    coordinates: { lat: 41.8, lng: -93.1 },
    latestReadings: {
      temp_c: 22.1,
      ph: 6.8,
      ntu: null, // Not applicable for soil probe
      tds_ppm: 1250,
      npk_n: 18,
      npk_p: 7,
      npk_k: 12,
    },
  },
  {
    id: "pgw-0003",
    name: "Algae Emitter — Dock",
    alias: "Dock Algae Unit",
    siteId: "site-3",
    siteName: "Harbor Marina",
    customer: "Marina Management LLC",
    deviceType: "Ultrasonic Algae Control",
    status: "offline",
    commissionStatus: "uncommissioned",
    lastCommissioned: null,
    lastContact: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    gatewayId: "pgw-0003",
    gatewayName: "Algae Emitter — Dock",
    gatewayWebUrl: null, // Offline, no web URL available
    gatewayIp: "10.0.3.100",
    batteryLevel: 0,
    signalStrength: 0,
    firmwareVersion: "v2.2.5",
    coordinates: { lat: 37.8, lng: -122.4 },
    latestReadings: null,
  },
  {
    id: "pgw-0004",
    name: "Lakefront Buoy #2",
    alias: "Buoy South Shore",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    customer: "Lake Association",
    deviceType: "Water Quality Buoy",
    status: "online",
    commissionStatus: "commissioned",
    lastCommissioned: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastContact: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    gatewayId: "pgw-0004",
    gatewayName: "Lakefront Buoy #2",
    gatewayWebUrl: "http://10.0.1.102:8080",
    gatewayIp: "10.0.1.102",
    batteryLevel: 92,
    signalStrength: 88,
    firmwareVersion: "v2.4.1",
    coordinates: { lat: 39.51, lng: -79.31 },
    latestReadings: {
      temp_c: 18.6,
      ph: 7.3,
      ntu: 2.1,
      tds_ppm: 238,
      npk_n: null,
      npk_p: null,
      npk_k: null,
    },
  },
  {
    id: "pgw-0005",
    name: "West Field Soil Probe",
    alias: "Soil Probe West",
    siteId: "site-2",
    siteName: "Johnson Farm",
    customer: "Johnson Agri Co.",
    deviceType: "Soil NPK Probe",
    status: "online",
    commissionStatus: "commissioned",
    lastCommissioned: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    lastContact: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    gatewayId: "pgw-0005",
    gatewayName: "West Field Soil Probe",
    gatewayWebUrl: "http://10.0.2.202:8080",
    gatewayIp: "10.0.2.202",
    batteryLevel: 78,
    signalStrength: 81,
    firmwareVersion: "v2.4.0",
    coordinates: { lat: 41.79, lng: -93.11 },
    latestReadings: {
      temp_c: 21.8,
      ph: 6.9,
      ntu: null,
      tds_ppm: 1180,
      npk_n: 22,
      npk_p: 9,
      npk_k: 15,
    },
  },
  {
    id: "pgw-0006",
    name: "Gateway Hub #1",
    alias: "Main Gateway",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    customer: "Lake Association",
    deviceType: "LoRaWAN Gateway",
    status: "online",
    commissionStatus: "commissioned",
    lastCommissioned: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastContact: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    gatewayId: "pgw-0006",
    gatewayName: "Gateway Hub #1",
    gatewayWebUrl: "http://10.0.1.1:8080",
    gatewayIp: "10.0.1.1",
    batteryLevel: 100, // Gateway is AC powered
    signalStrength: 100,
    firmwareVersion: "v3.1.2",
    coordinates: { lat: 39.502, lng: -79.298 },
    latestReadings: {
      connected_devices: 4,
      uplink_success_rate: 98.5,
      rssi: -62,
      snr: 9.5,
    },
  },
  {
    id: "pgw-0007",
    name: "Emitter Unit A",
    alias: "North Shore Emitter",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    customer: "Lake Association",
    deviceType: "Ultrasonic Algae Control",
    status: "warning",
    commissionStatus: "commissioned",
    lastCommissioned: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastContact: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    gatewayId: "pgw-0007",
    gatewayName: "Emitter Unit A",
    gatewayWebUrl: "http://10.0.1.103:8080",
    gatewayIp: "10.0.1.103",
    batteryLevel: 45,
    signalStrength: 68,
    firmwareVersion: "v2.1.0",
    coordinates: { lat: 39.508, lng: -79.295 },
    latestReadings: {
      runtime_hours: 1250,
      power_cycles: 42,
      frequency_khz: 200,
      power_output_w: 48,
    },
  },
];

// Commission results for devices - matches CommissionResult shape from spec
const MOCK_COMMISSION_RESULTS = {
  "pgw-0001": {
    deviceId: "pgw-0001",
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 105 * 1000).toISOString(),
    status: "passed",
    tests: [
      { id: "power_os", name: "Power & OS", status: "passed", duration: 1200, details: null },
      { id: "ads1115", name: "ADS1115 ADC", status: "passed", duration: 800, details: null },
      { id: "ds18b20", name: "DS18B20 Temp", status: "passed", duration: 900, details: null },
      { id: "ph_ntu", name: "pH/Turbidity", status: "passed", duration: 1100, details: null },
      { id: "npk", name: "NPK Modbus", status: "passed", duration: 0, details: "N/A - water buoy" },
      { id: "relay_ch1", name: "Relay Ch1", status: "passed", duration: 500, details: null },
      { id: "relay_ch2", name: "Relay Ch2", status: "passed", duration: 500, details: null },
      { id: "lte_wifi", name: "LTE/WiFi", status: "passed", duration: 1500, details: null },
      { id: "cloud_ingest", name: "Cloud Ingest", status: "passed", duration: 2000, details: null },
    ],
  },
  "pgw-0002": {
    deviceId: "pgw-0002",
    startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 92 * 1000).toISOString(),
    status: "failed",
    tests: [
      { id: "power_os", name: "Power & OS", status: "passed", duration: 1100, details: null },
      { id: "ads1115", name: "ADS1115 ADC", status: "passed", duration: 750, details: null },
      { id: "ds18b20", name: "DS18B20 Temp", status: "passed", duration: 850, details: null },
      { id: "ph_ntu", name: "pH/Turbidity", status: "passed", duration: 0, details: "N/A - soil probe" },
      { id: "npk", name: "NPK Modbus", status: "failed", duration: 2100, details: "Timeout on register read" },
      { id: "relay_ch1", name: "Relay Ch1", status: "passed", duration: 450, details: null },
      { id: "relay_ch2", name: "Relay Ch2", status: "passed", duration: 480, details: null },
      { id: "lte_wifi", name: "LTE/WiFi", status: "passed", duration: 1400, details: null },
      { id: "cloud_ingest", name: "Cloud Ingest", status: "passed", duration: 1800, details: null },
    ],
  },
  "pgw-0004": {
    deviceId: "pgw-0004",
    startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 110 * 1000).toISOString(),
    status: "passed",
    tests: [
      { id: "power_os", name: "Power & OS", status: "passed", duration: 1300, details: null },
      { id: "ads1115", name: "ADS1115 ADC", status: "passed", duration: 820, details: null },
      { id: "ds18b20", name: "DS18B20 Temp", status: "passed", duration: 910, details: null },
      { id: "ph_ntu", name: "pH/Turbidity", status: "passed", duration: 1050, details: null },
      { id: "npk", name: "NPK Modbus", status: "passed", duration: 0, details: "N/A - water buoy" },
      { id: "relay_ch1", name: "Relay Ch1", status: "passed", duration: 520, details: null },
      { id: "relay_ch2", name: "Relay Ch2", status: "passed", duration: 510, details: null },
      { id: "lte_wifi", name: "LTE/WiFi", status: "passed", duration: 1600, details: null },
      { id: "cloud_ingest", name: "Cloud Ingest", status: "passed", duration: 2100, details: null },
    ],
  },
  "pgw-0005": {
    deviceId: "pgw-0005",
    startedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000 + 108 * 1000).toISOString(),
    status: "passed",
    tests: [
      { id: "power_os", name: "Power & OS", status: "passed", duration: 1150, details: null },
      { id: "ads1115", name: "ADS1115 ADC", status: "passed", duration: 780, details: null },
      { id: "ds18b20", name: "DS18B20 Temp", status: "passed", duration: 870, details: null },
      { id: "ph_ntu", name: "pH/Turbidity", status: "passed", duration: 0, details: "N/A - soil probe" },
      { id: "npk", name: "NPK Modbus", status: "passed", duration: 1950, details: null },
      { id: "relay_ch1", name: "Relay Ch1", status: "passed", duration: 470, details: null },
      { id: "relay_ch2", name: "Relay Ch2", status: "passed", duration: 490, details: null },
      { id: "lte_wifi", name: "LTE/WiFi", status: "passed", duration: 1550, details: null },
      { id: "cloud_ingest", name: "Cloud Ingest", status: "passed", duration: 1950, details: null },
    ],
  },
};

const MOCK_COMMISSIONING = [
  {
    id: "comm-1",
    deviceId: "pgw-0006",
    deviceName: "South Lake Buoy #3",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    installer: "John Smith",
    status: "completed",
    source: "PGP CLI/Web", // From Pollution Gateway Pro
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comm-2",
    deviceId: "pgw-0007",
    deviceName: "Center Field Probe Array",
    siteId: "site-2",
    siteName: "Johnson Farm",
    installer: "Sarah Johnson",
    status: "in_progress",
    source: "PGP CLI/Web",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "comm-3",
    deviceId: "pgw-0008",
    deviceName: "Marina Algae Controller",
    siteId: "site-3",
    siteName: "Harbor Marina",
    installer: "Mike Chen",
    status: "pending",
    source: "PGP CLI/Web",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comm-4",
    deviceId: "pgw-0009",
    deviceName: "River Monitoring Station",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    installer: "John Smith",
    status: "failed",
    source: "PGP CLI/Web",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_ALERTS = [
  {
    id: "alert-1",
    severity: "critical",
    siteId: "site-3",
    siteName: "Harbor Marina",
    deviceId: "pgw-0003",
    deviceName: "Algae Emitter — Dock",
    message: "Device offline for 3+ hours",
    firstSeen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: "open",
  },
  {
    id: "alert-2",
    severity: "warning",
    siteId: "site-2",
    siteName: "Johnson Farm",
    deviceId: "pgw-0002",
    deviceName: "East Field Soil Probe",
    message: "Low battery: 23%",
    firstSeen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: "open",
  },
  {
    id: "alert-3",
    severity: "info",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    deviceId: "pgw-0001",
    deviceName: "Lakefront Buoy #1",
    message: "Firmware update available: v2.4.2",
    firstSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "acknowledged",
  },
  {
    id: "alert-4",
    severity: "warning",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    deviceId: "pgw-0004",
    deviceName: "Lakefront Buoy #2",
    message: "NTU (turbidity) reading spike detected",
    firstSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: "resolved",
  },
  {
    id: "alert-5",
    severity: "critical",
    siteId: "site-2",
    siteName: "Johnson Farm",
    deviceId: "pgw-0002",
    deviceName: "East Field Soil Probe",
    message: "Commissioning failed – NPK Modbus test failed: Timeout on register read",
    type: "commissioning-failed",
    firstSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "open",
  },
  {
    id: "alert-6",
    severity: "warning",
    siteId: "site-3",
    siteName: "Harbor Marina",
    deviceId: "pgw-0003",
    deviceName: "Algae Emitter — Dock",
    message: "Commissioning incomplete – Device has not been commissioned",
    type: "commissioning-incomplete",
    firstSeen: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: "open",
  },
];

const MOCK_INSTALLER_JOBS = [
  {
    id: "job-1",
    site: "Johnson Farm",
    siteId: "site-2",
    task: "Install soil probe array (6 units)",
    priority: "high",
    deadline: "2025-11-30",
    status: "not_started",
    address: "2450 County Road 18, Iowa",
    deviceType: "Soil NPK Probe",
    scheduledTime: "09:00 AM",
  },
  {
    id: "job-2",
    site: "Deep Creek Lake",
    siteId: "site-1",
    task: "Replace buoy sensor module",
    priority: "medium",
    deadline: "2025-12-05",
    status: "in_progress",
    address: "North Shore Access Road, Maryland",
    deviceType: "Water Quality Buoy",
    scheduledTime: "10:30 AM",
  },
  {
    id: "job-3",
    site: "Harbor Marina",
    siteId: "site-3",
    task: "Commission algae emitter + gateway",
    priority: "high",
    deadline: "2025-12-01",
    status: "not_started",
    address: "1200 Marina Blvd, California",
    deviceType: "Ultrasonic Algae Control",
    scheduledTime: "02:00 PM",
  },
];

const MOCK_PGP_TEST_RESULTS = {
  // PGP (Pollution Gateway Pro) hardware test results for commissioning
  "comm-1": {
    deviceId: "pgw-0006",
    deviceName: "South Lake Buoy #3",
    tests: {
      ads1115: {
        name: "ADS1115 (ADC)",
        passed: true,
        message: "ADC detected successfully, all channels operational",
      },
      ds18b20: {
        name: "DS18B20 (Temperature)",
        passed: true,
        reading: 22.4,
        unit: "°C",
        message: "Temperature sensor responding correctly",
      },
      npk: {
        name: "NPK (Modbus)",
        passed: true,
        readings: { n: 18, p: 7, k: 12 },
        message: "Modbus NPK sensor responding correctly",
      },
      relay: {
        name: "Relay Toggle",
        passed: true,
        channels: [
          { channel: 1, status: "on", passed: true },
          { channel: 2, status: "off", passed: true },
        ],
        message: "All relay channels toggling correctly",
      },
      connectivity: {
        name: "Connectivity",
        passed: true,
        signalStrength: 92,
        unit: "%",
        message: "LTE signal excellent (RSRP -85 dBm)",
      },
    },
  },
  "comm-2": {
    deviceId: "pgw-0007",
    deviceName: "Center Field Probe Array",
    tests: {
      ads1115: {
        name: "ADS1115 (ADC)",
        passed: true,
        message: "ADC detected successfully",
      },
      ds18b20: {
        name: "DS18B20 (Temperature)",
        passed: true,
        reading: 21.8,
        unit: "°C",
        message: "Temperature sensor responding correctly",
      },
      npk: {
        name: "NPK (Modbus)",
        passed: false,
        message: "Modbus timeout - check NPK sensor wiring",
      },
      relay: {
        name: "Relay Toggle",
        passed: true,
        channels: [
          { channel: 1, status: "on", passed: true },
          { channel: 2, status: "on", passed: true },
        ],
        message: "All relay channels toggling correctly",
      },
      connectivity: {
        name: "Connectivity",
        passed: true,
        signalStrength: 78,
        unit: "%",
        message: "LTE signal good (RSRP -95 dBm)",
      },
    },
  },
  "comm-4": {
    deviceId: "pgw-0009",
    deviceName: "River Monitoring Station",
    tests: {
      ads1115: {
        name: "ADS1115 (ADC)",
        passed: false,
        message: "I2C communication failed - check ADC connections",
      },
      ds18b20: {
        name: "DS18B20 (Temperature)",
        passed: false,
        message: "1-Wire bus error - sensor not detected",
      },
      npk: {
        name: "NPK (Modbus)",
        passed: false,
        message: "Modbus device not responding",
      },
      relay: {
        name: "Relay Toggle",
        passed: false,
        channels: [
          { channel: 1, status: "unknown", passed: false },
          { channel: 2, status: "unknown", passed: false },
        ],
        message: "GPIO error - relay control failure",
      },
      connectivity: {
        name: "Connectivity",
        passed: false,
        signalStrength: 0,
        unit: "%",
        message: "No cellular signal detected",
      },
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Format relative time
export const getRelativeTime = (timestamp) => {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)} min ago`;
  if (diff < day) return `${Math.floor(diff / hour)} hr ago`;
  return `${Math.floor(diff / day)} days ago`;
};

/* -------------------------------------------------------------------------- */
/*                                   API                                      */
/* -------------------------------------------------------------------------- */

export const CloudMockAPI = {
  // Sites
  sites: {
    getAll: async () => {
      await delay();
      return [...MOCK_SITES];
    },
    getById: async (id) => {
      await delay();
      return MOCK_SITES.find((s) => s.id === id) || null;
    },
  },

  // Devices
  devices: {
    getAll: async () => {
      await delay();
      return [...MOCK_DEVICES];
    },
    getById: async (id) => {
      await delay();
      return MOCK_DEVICES.find((d) => d.id === id) || null;
    },
    getBySite: async (siteId) => {
      await delay();
      return MOCK_DEVICES.filter((d) => d.siteId === siteId);
    },
    getTimeSeriesData: async (deviceId, range = "24h") => {
      await delay();
      // TODO: Replace with real backend API that aggregates PGP time-series data
      //       from gateway uploads (via API_URL ingest endpoint)

      // Generate mock time series data using PGP sensor field names
      const points = range === "24h" ? 24 : range === "7d" ? 168 : 720;
      const now = Date.now();
      const interval = range === "24h" ? 60 * 60 * 1000 : 60 * 60 * 1000;

      return Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(now - (points - i) * interval).toISOString(),
        temp_c: 18 + Math.random() * 4,
        ph: 7.0 + Math.random() * 0.5,
        ntu: 2 + Math.random() * 1,
        tds_ppm: 230 + Math.random() * 30,
        npk_n: null, // Device-specific, varies by sensor type
        npk_p: null,
        npk_k: null,
      }));
    },
    getLogs: async (deviceId) => {
      await delay();
      return [
        {
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          event: "uplink",
          message: "Data transmitted successfully",
        },
        {
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          event: "reading",
          message: "Sensor readings captured",
        },
        {
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          event: "uplink",
          message: "Data transmitted successfully",
        },
      ];
    },
  },

  // Commissioning
  commissioning: {
    getAll: async () => {
      await delay();
      return [...MOCK_COMMISSIONING];
    },
    getById: async (id) => {
      await delay();
      return MOCK_COMMISSIONING.find((c) => c.id === id) || null;
    },
    getTestResults: async (commissioningId) => {
      await delay();
      return MOCK_PGP_TEST_RESULTS[commissioningId] || null;
    },

    /**
     * Run commissioning tests for a device
     * Simulates sequential test execution with realistic delays
     * @param {string} deviceId - Device ID (e.g., "pgw-0001")
     * @param {function} onTestUpdate - Callback for real-time test updates (optional)
     * @returns {Promise<CommissionResult>} Commission result with test statuses
     */
    runCommission: async (deviceId, onTestUpdate = null) => {
      const device = MOCK_DEVICES.find((d) => d.id === deviceId);
      if (!device) {
        throw new Error(`Device ${deviceId} not found`);
      }

      console.log(`📋 Commissioning started: ${deviceId}`);

      const startedAt = new Date().toISOString();
      const tests = [
        { id: "power_os", name: "Power & OS", status: "pending", duration: 0, details: null },
        { id: "ads1115", name: "ADS1115 ADC", status: "pending", duration: 0, details: null },
        { id: "ds18b20", name: "DS18B20 Temp", status: "pending", duration: 0, details: null },
        { id: "ph_ntu", name: "pH/Turbidity", status: "pending", duration: 0, details: null },
        { id: "npk", name: "NPK Modbus", status: "pending", duration: 0, details: null },
        { id: "relay_ch1", name: "Relay Ch1", status: "pending", duration: 0, details: null },
        { id: "relay_ch2", name: "Relay Ch2", status: "pending", duration: 0, details: null },
        { id: "lte_wifi", name: "LTE/WiFi", status: "pending", duration: 0, details: null },
        { id: "cloud_ingest", name: "Cloud Ingest", status: "pending", duration: 0, details: null },
      ];

      // Simulate sequential test execution
      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        test.status = "running";
        if (onTestUpdate) onTestUpdate(tests);

        // Simulate test duration (1-3 seconds)
        const testDuration = 800 + Math.random() * 1500;
        await delay(testDuration);
        test.duration = Math.round(testDuration);

        // Determine test result based on device type and commission status
        const shouldPass = device.commissionStatus === "commissioned" ||
                          (device.commissionStatus === "failed" && test.id !== "npk");

        // Special cases for device-specific tests
        if (test.id === "npk" && device.deviceType.includes("Water Quality Buoy")) {
          test.status = "passed";
          test.duration = 0;
          test.details = "N/A - water buoy";
        } else if (test.id === "ph_ntu" && device.deviceType.includes("Soil NPK Probe")) {
          test.status = "passed";
          test.duration = 0;
          test.details = "N/A - soil probe";
        } else if (device.commissionStatus === "failed" && test.id === "npk") {
          test.status = "failed";
          test.details = "Timeout on register read";
          console.log(`❌ Test failed: ${test.id} – ${test.details}`);
        } else {
          test.status = shouldPass ? "passed" : "failed";
          if (test.status === "passed") {
            console.log(`✅ Test passed: ${test.id} (${(test.duration / 1000).toFixed(1)}s)`);
          } else {
            test.details = "Test failed";
            console.log(`❌ Test failed: ${test.id} – ${test.details}`);
          }
        }

        if (onTestUpdate) onTestUpdate(tests);
      }

      const completedAt = new Date().toISOString();
      const overallStatus = tests.every(t => t.status === "passed") ? "passed" : "failed";

      const result = {
        deviceId,
        startedAt,
        completedAt,
        status: overallStatus,
        tests,
      };

      // Store result in mock data
      MOCK_COMMISSION_RESULTS[deviceId] = result;

      // Update device commission status
      device.commissionStatus = overallStatus === "passed" ? "commissioned" : "failed";
      device.lastCommissioned = completedAt;

      console.log(`🏁 Commissioning ${overallStatus}: ${deviceId}`);

      return result;
    },

    /**
     * Get last commission result for a device
     * @param {string} deviceId - Device ID (e.g., "pgw-0001")
     * @returns {Promise<CommissionResult|null>} Last commission result or null if never commissioned
     */
    getLastCommission: async (deviceId) => {
      await delay();
      return MOCK_COMMISSION_RESULTS[deviceId] || null;
    },
  },

  // Alerts
  alerts: {
    getAll: async () => {
      await delay();
      return [...MOCK_ALERTS];
    },
    getByDevice: async (deviceId) => {
      await delay();
      return MOCK_ALERTS.filter((a) => a.deviceId === deviceId);
    },
    getBySeverity: async (severity) => {
      await delay();
      return MOCK_ALERTS.filter((a) => a.severity === severity);
    },
  },

  // Installer Jobs
  installer: {
    getJobs: async (userId) => {
      await delay();
      return [...MOCK_INSTALLER_JOBS];
    },
    getRecentlyCommissioned: async (userId) => {
      await delay();
      return MOCK_COMMISSIONING.filter((c) => c.status === "completed").slice(
        0,
        5
      );
    },
  },

  // Overview/Dashboard stats
  overview: {
    getStats: async () => {
      await delay();
      const onlineDevices = MOCK_DEVICES.filter(
        (d) => d.status === "online"
      ).length;
      const totalDevices = MOCK_DEVICES.length;
      const sitesMonitored = MOCK_SITES.length;
      const openAlerts = MOCK_ALERTS.filter((a) => a.status === "open").length;
      const devicesNeedingAttention = MOCK_DEVICES.filter(
        (d) => d.status !== "online"
      ).length;

      return {
        onlineDevices,
        totalDevices,
        sitesMonitored,
        openAlerts,
        devicesNeedingAttention,
      };
    },
    getRecentCommissioning: async () => {
      await delay();
      return MOCK_COMMISSIONING.slice(0, 5);
    },
    getTodayTasks: async () => {
      await delay();
      return [
        {
          id: "task-1",
          type: "job",
          title: "Install soil probe array at Johnson Farm",
          priority: "high",
          dueTime: "09:00 AM",
        },
        {
          id: "task-2",
          type: "alert",
          title: "Investigate offline device at Harbor Marina",
          priority: "critical",
          dueTime: "ASAP",
        },
        {
          id: "task-3",
          type: "commissioning",
          title: "Complete commissioning for Center Field Probe",
          priority: "medium",
          dueTime: "02:00 PM",
        },
      ];
    },
  },
};

export default CloudMockAPI;
