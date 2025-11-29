// /src/services/cloudMockAPI.js
// Mock API service for Cloud mode - provides realistic mock data
// TODO: Replace with real backend API calls

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
    deviceCount: 3,
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
    id: "device-1",
    name: "Lakefront Buoy #1",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    customer: "Lake Association",
    deviceType: "Water Quality Buoy",
    status: "online",
    lastContact: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    gatewayId: "gateway-A1",
    gatewayName: "North Shore Gateway",
    batteryLevel: 87,
    signalStrength: 95,
    firmwareVersion: "v2.4.1",
    coordinates: { lat: 39.5, lng: -79.3 },
    latestReadings: {
      temp: 18.4,
      ph: 7.2,
      dissolvedOxygen: 8.1,
      turbidity: 2.3,
    },
  },
  {
    id: "device-2",
    name: "East Field Soil Probe",
    siteId: "site-2",
    siteName: "Johnson Farm",
    customer: "Johnson Agri Co.",
    deviceType: "Soil NPK Probe",
    status: "warning",
    lastContact: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    gatewayId: "gateway-B2",
    gatewayName: "East Field Gateway",
    batteryLevel: 23,
    signalStrength: 72,
    firmwareVersion: "v2.3.8",
    coordinates: { lat: 41.8, lng: -93.1 },
    latestReadings: {
      moisture: 42,
      nitrogen: 18,
      phosphorus: 7,
      potassium: 12,
    },
  },
  {
    id: "device-3",
    name: "Algae Emitter — Dock",
    siteId: "site-3",
    siteName: "Harbor Marina",
    customer: "Marina Management LLC",
    deviceType: "Ultrasonic Algae Control",
    status: "offline",
    lastContact: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    gatewayId: "gateway-C3",
    gatewayName: "Marina Gateway",
    batteryLevel: 0,
    signalStrength: 0,
    firmwareVersion: "v2.2.5",
    coordinates: { lat: 37.8, lng: -122.4 },
    latestReadings: null,
  },
  {
    id: "device-4",
    name: "Lakefront Buoy #2",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    customer: "Lake Association",
    deviceType: "Water Quality Buoy",
    status: "online",
    lastContact: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    gatewayId: "gateway-A1",
    gatewayName: "North Shore Gateway",
    batteryLevel: 92,
    signalStrength: 88,
    firmwareVersion: "v2.4.1",
    coordinates: { lat: 39.51, lng: -79.31 },
    latestReadings: {
      temp: 18.6,
      ph: 7.3,
      dissolvedOxygen: 8.0,
      turbidity: 2.1,
    },
  },
  {
    id: "device-5",
    name: "West Field Soil Probe",
    siteId: "site-2",
    siteName: "Johnson Farm",
    customer: "Johnson Agri Co.",
    deviceType: "Soil NPK Probe",
    status: "online",
    lastContact: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    gatewayId: "gateway-B3",
    gatewayName: "West Field Gateway",
    batteryLevel: 78,
    signalStrength: 81,
    firmwareVersion: "v2.4.0",
    coordinates: { lat: 41.79, lng: -93.11 },
    latestReadings: {
      moisture: 38,
      nitrogen: 22,
      phosphorus: 9,
      potassium: 15,
    },
  },
];

const MOCK_COMMISSIONING = [
  {
    id: "comm-1",
    deviceId: "device-6",
    deviceName: "South Lake Buoy #3",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    installer: "John Smith",
    status: "completed",
    source: "Gateway",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comm-2",
    deviceId: "device-7",
    deviceName: "Center Field Probe Array",
    siteId: "site-2",
    siteName: "Johnson Farm",
    installer: "Sarah Johnson",
    status: "in_progress",
    source: "Gateway",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "comm-3",
    deviceId: "device-8",
    deviceName: "Marina Algae Controller",
    siteId: "site-3",
    siteName: "Harbor Marina",
    installer: "Mike Chen",
    status: "pending",
    source: "Gateway",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comm-4",
    deviceId: "device-9",
    deviceName: "River Monitoring Station",
    siteId: "site-1",
    siteName: "Deep Creek Lake",
    installer: "John Smith",
    status: "failed",
    source: "Gateway",
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
    deviceId: "device-3",
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
    deviceId: "device-2",
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
    deviceId: "device-1",
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
    deviceId: "device-4",
    deviceName: "Lakefront Buoy #2",
    message: "Turbidity reading spike detected",
    firstSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: "resolved",
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
      // Generate mock time series data
      const points = range === "24h" ? 24 : range === "7d" ? 168 : 720;
      const now = Date.now();
      const interval = range === "24h" ? 60 * 60 * 1000 : 60 * 60 * 1000;

      return Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(now - (points - i) * interval).toISOString(),
        temp: 18 + Math.random() * 4,
        ph: 7.0 + Math.random() * 0.5,
        dissolvedOxygen: 7.5 + Math.random() * 1.5,
        turbidity: 2 + Math.random() * 1,
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
