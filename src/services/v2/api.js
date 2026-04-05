/**
 * v2 API — demo-aware routing proxy.
 *
 * Re-exports every function from client.ts, but when demo mode is active
 * (?demo=1 or VITE_DEMO_MODE=true), Cloud-related functions are swapped
 * for mock implementations from demoInterceptor.js.
 *
 * Non-Cloud functions (market, credits, blockchain, programs, etc.)
 * always route to the real client.
 *
 * Usage: import { getDevices, getAlerts, ApiError } from '../../services/v2/api';
 */

import { isDemoMode } from '../../utils/demoMode';
import * as realClient from './client';
import * as demoClient from './demoInterceptor';

const demo = isDemoMode();

// ── Cloud: Device endpoints ──────────────────────────────

export const getDevices = demo ? demoClient.getDevices : realClient.getDevices;
export const getDevice = demo ? demoClient.getDevice : realClient.getDevice;
export const getDeviceMetrics = demo ? demoClient.getDeviceMetrics : realClient.getDeviceMetrics;
export const getDeviceAlerts = demo ? demoClient.getDeviceAlerts : realClient.getDeviceAlerts;
export const checkDevice = demo ? demoClient.checkDevice : realClient.checkDevice;
export const testDeviceConnection = demo
  ? demoClient.testDeviceConnection
  : realClient.testDeviceConnection;
export const commissionDevice = demo ? demoClient.commissionDevice : realClient.commissionDevice;

// ── Cloud: Alert endpoints ───────────────────────────────

export const getAlerts = demo ? demoClient.getAlerts : realClient.getAlerts;

// ── Cloud: Site endpoints ────────────────────────────────

export const getSites = demo ? demoClient.getSites : realClient.getSites;
export const createSite = demo ? demoClient.createSite : realClient.createSite;

// ── Cloud: Revenue Grade endpoints ───────────────────────

export const getRevenueGradeStatus = demo
  ? demoClient.getRevenueGradeStatus
  : realClient.getRevenueGradeStatus;
export const enableRevenueGrade = demo
  ? demoClient.enableRevenueGrade
  : realClient.enableRevenueGrade;
export const disableRevenueGrade = demo
  ? demoClient.disableRevenueGrade
  : realClient.disableRevenueGrade;

// ── Cloud: Calibration endpoints ─────────────────────────

export const getCalibrations = demo ? demoClient.getCalibrations : realClient.getCalibrations;
export const logCalibration = demo ? demoClient.logCalibration : realClient.logCalibration;

// ── Cloud: Command endpoints ─────────────────────────────

export const sendDeviceCommand = demo ? demoClient.sendDeviceCommand : realClient.sendDeviceCommand;

// ── Cloud: HUC Lookup ────────────────────────────────────

export const lookupHUC = demo ? demoClient.lookupHUC : realClient.lookupHUC;

// ── Cloud: Account Linking ───────────────────────────────

export const getWQTLinkStatus = demo ? demoClient.getWQTLinkStatus : realClient.getWQTLinkStatus;
export const linkWQTAccount = demo ? demoClient.linkWQTAccount : realClient.linkWQTAccount;

// ── Cloud: Credit Projects ───────────────────────────────

export const registerCreditProject = demo
  ? demoClient.registerCreditProject
  : realClient.registerCreditProject;
export const getCreditProject = demo ? demoClient.getCreditProject : realClient.getCreditProject;
export const getCreditAccruals = demo ? demoClient.getCreditAccruals : realClient.getCreditAccruals;

// ── WQT Marketplace: demo listings when demo mode ──────────

export const searchListings = demo ? demoClient.searchListings : realClient.searchListings;
export const getListing = demo ? demoClient.getListing : realClient.getListing;

// ── Pass-through: everything else routes to real client ──

export {
  ApiError,
  AUTH_SESSION_EXPIRED_EVENT,
  // Market (searchListings, getListing routed above when demo)
  getMarketStats,
  getMarketTicker,
  // Data
  getPublicSensors,
  getWatersheds,
  // Credits
  purchaseCredits,
  submitCredits,
  getPortfolio,
  // Blockchain
  mintCertificate,
  getCertificate,
  linkWallet,
  // Programs
  getPrograms,
  getProgram,
  calculateCredits,
  // Device lifecycle (pass through — no demo intercept needed)
  claimDevice,
  updateRevenueGrade,
  unlinkWQTAccount,
  calculateProjectCredits,
  submitProjectVerification,
} from './client';
