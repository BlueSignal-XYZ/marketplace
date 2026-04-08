/**
 * Device service types — Cloud platform device management.
 * BS-WQM-100 devices, commissioning, sites.
 */

import type { GeoLocation, OnlineStatus, Timestamped } from './common';
import type { SensorReading, ReadingType } from './sensors';

// ── Device ────────────────────────────────────────────────

export type DeviceStatus =
  | 'active'
  | 'inactive'
  | 'commissioning'
  | 'maintenance'
  | 'decommissioned';

export interface Device extends Timestamped {
  id: string;
  serialNumber: string;
  name: string;
  model: 'BS-WQM-100';
  firmwareVersion: string;
  status: DeviceStatus;
  onlineStatus: OnlineStatus;
  ownerId: string;
  siteId?: string;
  location: GeoLocation;
  /** Battery percentage (0-100) */
  battery: number;
  /** Last reading received */
  lastReadingAt?: string;
  latestReadings?: SensorReading[];
  /** Data sharing toggle — if true, sensor data is public on WQT */
  isPublicSharing: boolean;
  /** Total credits generated from this device */
  creditsGenerated: number;
  /** Alert thresholds per reading type */
  thresholds: Partial<Record<ReadingType, ThresholdConfig>>;
  /** Calibration data */
  calibration?: CalibrationData;
}

export interface ThresholdConfig {
  min: number;
  max: number;
  alertOnBreach: boolean;
}

export interface CalibrationData {
  lastCalibrated: string;
  calibratedBy: string;
  nextCalibrationDue: string;
  offsets: Partial<Record<ReadingType, number>>;
}

// ── Device Summary (for dashboard cards) ──────────────────

export interface DeviceSummary {
  id: string;
  name: string;
  status: DeviceStatus;
  onlineStatus: OnlineStatus;
  battery: number;
  lastReadingAt?: string;
  location: GeoLocation;
  creditsGenerated: number;
}

// ── Sites ─────────────────────────────────────────────────

export interface Site extends Timestamped {
  id: string;
  name: string;
  ownerId: string;
  location: GeoLocation;
  devices: string[]; // device IDs
  description?: string;
}

export interface SiteDetail extends Site {
  deviceSummaries: DeviceSummary[];
  aggregatedReadings: SensorReading[];
  activeAlerts: Alert[];
}

// ── Alerts ────────────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert extends Timestamped {
  id: string;
  deviceId: string;
  deviceName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  type: string; // e.g. "threshold_breach", "offline", "low_battery"
  message: string;
  readingType?: ReadingType;
  readingValue?: number;
  thresholdValue?: number;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
}

// ── Commissioning ─────────────────────────────────────────

export type CommissioningStep =
  | 'scan-qr'
  | 'verify-device'
  | 'assign-site'
  | 'run-tests'
  | 'activate'
  | 'link-customer';

export interface CommissioningSession extends Timestamped {
  id: string;
  deviceId: string;
  installerId: string;
  currentStep: CommissioningStep;
  completedSteps: CommissioningStep[];
  siteId?: string;
  customerId?: string;
  testResults?: {
    step: string;
    passed: boolean;
    details: string;
  }[];
  status: 'in-progress' | 'completed' | 'failed' | 'abandoned';
}

// ── Cloud Dashboard ───────────────────────────────────────

export interface CloudDashboardData {
  deviceCount: number;
  onlineCount: number;
  offlineCount: number;
  totalReadings: number;
  activeAlerts: number;
  creditsGenerated: number;
  devices: DeviceSummary[];
}

// ── Revenue Grade ─────────────────────────────────────────

export interface RevenueGradeStatus {
  enabled: boolean;
  enabledAt: string | null;
  baselineType: 'monitoring' | 'regulatory' | 'historical' | null;
  baselineComplete: boolean;
  baselineProgress: {
    daysCurrent: number;
    daysTotal: number;
    percentComplete: number;
  } | null;
  baselineParams: Record<string, number> | null;
  baselineLockedAt: string | null;
  wqtProjectId: string | null;
  wqtLinked: boolean;
  calibrationStatus: Record<string, CalibrationProbeStatus>;
  uptime30d: number | null;
  creditTotals: Record<string, number>;
  flowEstimate: {
    method: string;
    value: number;
    unit: string;
  } | null;
  huc12Code: string | null;
  watershedName: string | null;
  eligibleCredits: string[];
}

export type CalibrationProbeStatus = 'valid' | 'expiring_soon' | 'expired' | 'not_calibrated';

export interface CalibrationRecord {
  id: string;
  deviceId: string;
  probeType: 'ph' | 'tds' | 'turbidity' | 'orp';
  calibratedAt: number;
  calibratedBy: string;
  standardsUsed: string[];
  offsetValue: number;
  slopeValue: number | null;
  photoUrls: string[];
  expiresAt: number;
  status: CalibrationProbeStatus;
  createdAt: string;
}

// ── Credit Projects ───────────────────────────────────────

export interface CreditProject {
  id: string;
  wqtUserId: string;
  bluesignalUserId: string;
  deviceId: string;
  siteName: string;
  latitude: number | null;
  longitude: number | null;
  huc12Code: string | null;
  watershedName: string | null;
  baselineType: 'monitoring' | 'regulatory' | 'historical';
  baselineParams: Record<string, number> | null;
  baselineStart: string;
  baselineEnd: string | null;
  baselineComplete: boolean;
  baselineLockedAt: string | null;
  eligibleCredits: string[];
  improvementMethod: string | null;
  flowEstimate: {
    method: string;
    value: number;
    unit: string;
    updatedAt?: string;
  } | null;
  description: string;
  status: 'pending_baseline' | 'active' | 'paused' | 'retired';
  totalCredits: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface CreditAccrual {
  id: string;
  projectId: string;
  periodStart: number;
  periodEnd: number;
  creditType: 'nitrogen' | 'phosphorus' | 'kc' | 'qc';
  amount: number;
  unit: string;
  baselineValue: number;
  measuredValue: number;
  flowVolume: number;
  dataPoints: number;
  uptimePct: number;
  calibrationValid: boolean;
  status: 'pending_verification' | 'pending_review' | 'verified' | 'rejected';
  verificationNotes: string | null;
  createdAt: string;
}

// ── Device Commands ───────────────────────────────────────

export interface DeviceCommand {
  type: 'relay' | 'config';
  state?: number;
  duration_seconds?: number;
  settings?: Record<string, unknown>;
}

export interface DeviceCommandResult {
  commandId: string;
  status: string;
  message: string;
}

// ── Account Linking ───────────────────────────────────────

export interface WQTLinkStatus {
  linked: boolean;
  linkedAt?: string;
  consentedDevices: string[];
  revokedAt?: string | null;
}

// ── HUC/Watershed ─────────────────────────────────────────

export interface HUCLookupResult {
  huc12: string | null;
  name: string;
  state: string | null;
  impairments: string[];
  activeTmdl: boolean;
  tradingProgram: string | null;
  distance: number;
}
