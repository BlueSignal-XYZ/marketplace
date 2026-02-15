/**
 * Device service types — Cloud platform device management.
 * BS-WQM-100 devices, commissioning, sites.
 */

import type { GeoLocation, OnlineStatus, Timestamped } from './common';
import type { SensorReading, ReadingType } from './sensors';

// ── Device ────────────────────────────────────────────────

export type DeviceStatus = 'active' | 'inactive' | 'commissioning' | 'maintenance' | 'decommissioned';

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
  devices: string[];         // device IDs
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
  type: string;              // e.g. "threshold_breach", "offline", "low_battery"
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
