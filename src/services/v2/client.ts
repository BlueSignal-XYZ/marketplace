/**
 * v2 API Client — typed fetch wrapper for all /v2/ endpoints.
 *
 * - Prepends server base URL + /v2/ path
 * - Attaches Firebase auth token when available
 * - Unwraps { success, data } envelope
 * - Throws typed ApiError on failure
 */

import { getAuth } from 'firebase/auth';
import configs from '../../../configs';
import type {
  ApiResponse,
  MarketStats,
  MarketTicker,
  MarketSearchParams,
  MarketSearchResponse,
  Listing,
  PublicSensor,
  Watershed,
  Certificate,
  PurchaseRequest,
  PurchaseResult,
  CreditSubmission,
  PortfolioResponse,
  MintRequest,
  MintResult,
  LinkWalletRequest,
  LinkWalletResult,
  Program,
  CreditCalculationRequest,
  CreditEstimate,
  Device,
  DeviceSummary,
  Alert,
  Site,
} from '../types';

// ── Error class ──────────────────────────────────────────

export class ApiError extends Error {
  public readonly code?: string;
  public readonly status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// ── Base URL ─────────────────────────────────────────────

const BASE_URL = configs.server_url;
const REQUEST_TIMEOUT = 30000; // 30 seconds

// ── Auth token helper ────────────────────────────────────

async function getToken(forceRefresh = false): Promise<string | null> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(forceRefresh);
  } catch {
    return null;
  }
}

/** Dispatch when 401 retry fails — app shows AuthModal with session-expired message */
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

// ── Core fetch wrapper ───────────────────────────────────

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  requireAuth = false
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = await getToken(false);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth) {
    throw new ApiError('Authentication required', 401, 'AUTH_REQUIRED');
  }

  const init: RequestInit = { method, headers };
  if (body && method !== 'GET') {
    init.body = JSON.stringify(body);
  }

  let res: Response;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    res = await fetch(url, { ...init, signal: controller.signal });
  } catch (err: unknown) {
    throw new ApiError(
      (err instanceof Error ? err.message : null) || 'Network request failed',
      0,
      'NETWORK_ERROR'
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // 403: authenticated but not authorized — do NOT retry, return error normally
  if (res.status === 403) {
    let json: ApiResponse<T>;
    try {
      json = await res.json();
    } catch {
      throw new ApiError('Forbidden', 403, 'FORBIDDEN');
    }
    throw new ApiError(json.error || json.message || 'Forbidden', 403, 'API_ERROR');
  }

  // 401: token expired or invalid — try refresh once, then surface session-expired
  if (res.status === 401) {
    const refreshedToken = await getToken(true);
    if (refreshedToken) {
      headers['Authorization'] = `Bearer ${refreshedToken}`;
      const retryInit: RequestInit = { method, headers };
      if (body && method !== 'GET') {
        retryInit.body = JSON.stringify(body);
      }
      const retryController = new AbortController();
      const retryTimeoutId = setTimeout(() => retryController.abort(), REQUEST_TIMEOUT);
      let retryRes: Response;
      try {
        retryRes = await fetch(url, { ...retryInit, signal: retryController.signal });
      } finally {
        clearTimeout(retryTimeoutId);
      }
      if (retryRes.ok) {
        const retryJson = await retryRes.json();
        if (retryJson.success) return retryJson.data;
      }
      if (retryRes.status === 401) {
        window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
        throw new ApiError('Session expired. Please sign in again.', 401, 'AUTH_REQUIRED');
      }
      const retryErr: Record<string, unknown> = await retryRes.json().catch(() => ({}));
      throw new ApiError(
        (typeof retryErr.error === 'string' ? retryErr.error : null) ||
          (typeof retryErr.message === 'string' ? retryErr.message : null) ||
          `Request failed (${retryRes.status})`,
        retryRes.status,
        'API_ERROR'
      );
    } else {
      window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
      throw new ApiError('Session expired. Please sign in again.', 401, 'AUTH_REQUIRED');
    }
  }

  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiError('Invalid JSON response', res.status, 'PARSE_ERROR');
  }

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.error || json.message || `Request failed (${res.status})`,
      res.status,
      'API_ERROR'
    );
  }

  return json.data;
}

// ── Convenience helpers ──────────────────────────────────

function get<T>(path: string, requireAuth = false): Promise<T> {
  return request<T>('GET', path, undefined, requireAuth);
}

function post<T>(path: string, body: unknown, requireAuth = false): Promise<T> {
  return request<T>('POST', path, body, requireAuth);
}

// ── Market endpoints ─────────────────────────────────────

export function getMarketStats(): Promise<MarketStats> {
  return get<MarketStats>('/v2/market/stats');
}

export function getMarketTicker(): Promise<MarketTicker> {
  return get<MarketTicker>('/v2/market/ticker');
}

export function getListing(id: string): Promise<Listing> {
  return get<Listing>(`/v2/market/listing/${id}`);
}

export function searchListings(params: Partial<MarketSearchParams>): Promise<MarketSearchResponse> {
  return post<MarketSearchResponse>('/v2/market/search', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    ...params,
  });
}

// ── Data endpoints ───────────────────────────────────────

export function getPublicSensors(): Promise<PublicSensor[]> {
  return get<PublicSensor[]>('/v2/data/sensors/public');
}

export function getWatersheds(): Promise<Watershed[]> {
  return get<Watershed[]>('/v2/data/watersheds');
}

// ── Credits endpoints ────────────────────────────────────

export function purchaseCredits(params: PurchaseRequest): Promise<PurchaseResult> {
  return post<PurchaseResult>('/v2/credits/purchase', params, true);
}

export function submitCredits(
  params: CreditSubmission
): Promise<{ submissionId: string; status: string }> {
  return post('/v2/credits/submit', params, true);
}

export function getPortfolio(userId: string): Promise<PortfolioResponse> {
  return get<PortfolioResponse>(`/v2/credits/portfolio?userId=${userId}`, true);
}

// ── Blockchain endpoints ─────────────────────────────────

export function mintCertificate(params: MintRequest): Promise<MintResult> {
  return post<MintResult>('/v2/blockchain/mint', params, true);
}

export function getCertificate(id: string): Promise<Certificate> {
  return get<Certificate>(`/v2/blockchain/certificate/${id}`);
}

export function linkWallet(params: LinkWalletRequest): Promise<LinkWalletResult> {
  return post<LinkWalletResult>('/v2/wallet/link', params, true);
}

// ── Programs endpoints ───────────────────────────────────

export function getPrograms(): Promise<Program[]> {
  return get<Program[]>('/v2/programs');
}

export function getProgram(id: string): Promise<Program> {
  return get<Program>(`/v2/programs/${id}`);
}

export function calculateCredits(
  programId: string,
  params: CreditCalculationRequest
): Promise<CreditEstimate> {
  return post<CreditEstimate>(`/v2/programs/${programId}/calculate`, params, true);
}

// ── Device endpoints (Cloud) ─────────────────────────────

export function getDevices(userId: string): Promise<DeviceSummary[]> {
  return get<DeviceSummary[]>(`/v2/devices?userId=${userId}`, true);
}

export function getDevice(deviceId: string): Promise<Device> {
  return get<Device>(`/v2/devices/${deviceId}`, true);
}

export interface MetricsResponse {
  deviceId: string;
  metric: string;
  range: string;
  points: { timestamp: string; value: number }[];
  count: number;
}

export function getDeviceMetrics(
  deviceId: string,
  metric: string,
  range: string
): Promise<MetricsResponse> {
  return get<MetricsResponse>(
    `/v2/devices/${deviceId}/metrics?metric=${metric}&range=${range}`,
    true
  );
}

export function getDeviceAlerts(deviceId: string): Promise<Alert[]> {
  return get<Alert[]>(`/v2/devices/${deviceId}/alerts`, true);
}

export interface DeviceCheckResult {
  deviceId: string;
  exists: boolean;
  isCommissioned: boolean;
  status: string | null;
}

export function checkDevice(deviceId: string): Promise<DeviceCheckResult> {
  return post<DeviceCheckResult>('/v2/devices/check', { deviceId }, true);
}

export interface ConnectionTestResult {
  deviceId: string;
  connected: boolean;
  signal: string;
  latency: number | null;
  simulated: boolean;
  message: string;
}

export function testDeviceConnection(deviceId: string): Promise<ConnectionTestResult> {
  return post<ConnectionTestResult>('/v2/devices/test-connection', { deviceId }, true);
}

export interface CommissionRequest {
  deviceId: string;
  siteName?: string;
  siteId?: string;
  deviceName?: string;
  latitude?: number;
  longitude?: number;
  calibration?: Record<string, number>;
  userId?: string;
}

export interface CommissionResult {
  deviceId: string;
  siteId: string | null;
  commissionId: string;
  status: string;
  commissionedAt: string;
}

export function commissionDevice(params: CommissionRequest): Promise<CommissionResult> {
  return post<CommissionResult>('/v2/devices/commission', params, true);
}

// ── Site endpoints (Cloud) ───────────────────────────────

export function getSites(userId: string): Promise<Site[]> {
  return get<Site[]>(`/v2/sites?userId=${userId}`, true);
}

export interface CreateSiteRequest {
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  description?: string;
}

export function createSite(params: CreateSiteRequest): Promise<Site> {
  return post<Site>('/v2/sites', params, true);
}

// ── Alert endpoints (Cloud) ──────────────────────────────

export function getAlerts(userId: string): Promise<Alert[]> {
  return get<Alert[]>(`/v2/alerts?userId=${userId}`, true);
}

// ── Device Claim ─────────────────────────────────────────

export interface ClaimRequest {
  device_id: string;
  dev_eui: string;
  hw_revision?: string;
  fw_version?: string;
  sensors_detected?: string[];
}

export interface ClaimResult {
  device_id: string;
  app_key: string;
  already_claimed: boolean;
}

export function claimDevice(params: ClaimRequest): Promise<ClaimResult> {
  return post<ClaimResult>('/v2/devices/claim', params, true);
}

// ── Device Commands ──────────────────────────────────────

export interface DeviceCommandRequest {
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

export function sendDeviceCommand(
  deviceId: string,
  command: DeviceCommandRequest
): Promise<DeviceCommandResult> {
  return post<DeviceCommandResult>(`/v2/devices/${deviceId}/command`, command, true);
}

// ── Revenue Grade ────────────────────────────────────────

export interface RevenueGradeStatus {
  enabled: boolean;
  enabledAt: string | null;
  baselineType: string | null;
  baselineComplete: boolean;
  baselineProgress: { daysCurrent: number; daysTotal: number; percentComplete: number } | null;
  baselineParams: Record<string, number> | null;
  baselineLockedAt: string | null;
  wqtProjectId: string | null;
  wqtLinked: boolean;
  calibrationStatus: Record<string, string>;
  uptime30d: number | null;
  creditTotals: Record<string, number>;
  flowEstimate: { method: string; value: number; unit: string } | null;
  huc12Code: string | null;
  watershedName: string | null;
  eligibleCredits: string[];
}

export function getRevenueGradeStatus(deviceId: string): Promise<RevenueGradeStatus> {
  return get<RevenueGradeStatus>(`/v2/devices/${deviceId}/revenue-grade/status`, true);
}

export function enableRevenueGrade(
  deviceId: string,
  params?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return post(`/v2/devices/${deviceId}/revenue-grade/enable`, params || {}, true);
}

export function disableRevenueGrade(deviceId: string): Promise<void> {
  return post(`/v2/devices/${deviceId}/revenue-grade/disable`, {}, true);
}

export function updateRevenueGrade(
  deviceId: string,
  updates: Record<string, unknown>
): Promise<void> {
  return request('PUT', `/v2/devices/${deviceId}/revenue-grade`, updates, true);
}

// ── Calibrations ─────────────────────────────────────────

export interface CalibrationRecord {
  id: string;
  deviceId: string;
  probeType: string;
  calibratedAt: number;
  calibratedBy: string;
  standardsUsed: string[];
  offsetValue: number;
  slopeValue: number | null;
  photoUrls: string[];
  expiresAt: number;
  status: string;
}

export function getCalibrations(deviceId: string): Promise<CalibrationRecord[]> {
  return get<CalibrationRecord[]>(`/v2/devices/${deviceId}/calibrations`, true);
}

export function logCalibration(
  deviceId: string,
  calibration: {
    probe_type: string;
    standards_used: string[];
    calibrated_at?: string;
    offset_value?: number;
    slope_value?: number;
    photo_urls?: string[];
  }
): Promise<CalibrationRecord> {
  return post<CalibrationRecord>(`/v2/devices/${deviceId}/calibrations`, calibration, true);
}

// ── HUC/Watershed Lookup ─────────────────────────────────

export interface HUCLookupResult {
  huc12: string | null;
  name: string;
  state: string | null;
  impairments: string[];
  activeTmdl: boolean;
  tradingProgram: string | null;
  distance: number;
}

export function lookupHUC(lat: number, lng: number): Promise<HUCLookupResult> {
  return get<HUCLookupResult>(`/v2/sites/huc-lookup?lat=${lat}&lng=${lng}`, true);
}

// ── Account Linking ──────────────────────────────────────

export interface WQTLinkStatus {
  linked: boolean;
  linkedAt?: string;
  consentedDevices: string[];
  revokedAt?: string | null;
}

export function getWQTLinkStatus(): Promise<WQTLinkStatus> {
  return get<WQTLinkStatus>('/v2/account/link-status', true);
}

export function linkWQTAccount(
  deviceIds?: string[]
): Promise<{ linked: boolean; linkedAt: string }> {
  return post('/v2/account/link-wqt', { device_ids: deviceIds || [] }, true);
}

export function unlinkWQTAccount(): Promise<void> {
  return request('DELETE', '/v2/account/link-wqt', {}, true);
}

// ── Credit Projects ──────────────────────────────────────

export interface CreditProject {
  id: string;
  deviceId: string;
  siteName: string;
  huc12Code: string | null;
  watershedName: string | null;
  baselineType: string;
  baselineComplete: boolean;
  eligibleCredits: string[];
  status: string;
  totalCredits: Record<string, number>;
  createdAt: string;
}

export interface CreditAccrual {
  id: string;
  projectId: string;
  periodStart: number;
  periodEnd: number;
  creditType: string;
  amount: number;
  unit: string;
  baselineValue: number;
  measuredValue: number;
  uptimePct: number;
  calibrationValid: boolean;
  status: string;
}

export function registerCreditProject(params: Record<string, unknown>): Promise<CreditProject> {
  return post<CreditProject>('/v2/projects', params, true);
}

export function getCreditProject(projectId: string): Promise<CreditProject> {
  return get<CreditProject>(`/v2/projects/${projectId}`, true);
}

export function getCreditAccruals(projectId: string): Promise<CreditAccrual[]> {
  return get<CreditAccrual[]>(`/v2/projects/${projectId}/accruals`, true);
}

export function calculateProjectCredits(projectId: string): Promise<Record<string, unknown>> {
  return post(`/v2/projects/${projectId}/accruals/calculate`, {}, true);
}

export function submitProjectVerification(
  projectId: string,
  accrualIds?: string[]
): Promise<Record<string, unknown>> {
  return post(`/v2/projects/${projectId}/submit-verification`, { accrual_ids: accrualIds }, true);
}
