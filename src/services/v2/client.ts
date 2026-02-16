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
  PaginatedResponse,
  MarketStats,
  MarketTicker,
  MarketSearchParams,
  MarketSearchResponse,
  ListingSummary,
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
  requireAuth = false,
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
  try {
    res = await fetch(url, init);
  } catch (err: any) {
    throw new ApiError(
      err?.message || 'Network request failed',
      0,
      'NETWORK_ERROR',
    );
  }

  // 403: authenticated but not authorized — do NOT retry, return error normally
  if (res.status === 403) {
    let json: ApiResponse<T>;
    try {
      json = await res.json();
    } catch {
      throw new ApiError('Forbidden', 403, 'FORBIDDEN');
    }
    throw new ApiError(
      json.error || json.message || 'Forbidden',
      403,
      'API_ERROR',
    );
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
      const retryRes = await fetch(url, retryInit);
      if (retryRes.ok) {
        const retryJson = await retryRes.json();
        if (retryJson.success) return retryJson.data;
      }
      if (retryRes.status === 401) {
        window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
        throw new ApiError('Session expired. Please sign in again.', 401, 'AUTH_REQUIRED');
      }
      const retryErr = await retryRes.json().catch(() => ({}));
      throw new ApiError(
        (retryErr as any)?.error || (retryErr as any)?.message || `Request failed (${retryRes.status})`,
        retryRes.status,
        'API_ERROR',
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
      'API_ERROR',
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

export function searchListings(
  params: Partial<MarketSearchParams>,
): Promise<MarketSearchResponse> {
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

export function purchaseCredits(
  params: PurchaseRequest,
): Promise<PurchaseResult> {
  return post<PurchaseResult>('/v2/credits/purchase', params, true);
}

export function submitCredits(
  params: CreditSubmission,
): Promise<{ submissionId: string; status: string }> {
  return post('/v2/credits/submit', params, true);
}

export function getPortfolio(userId: string): Promise<PortfolioResponse> {
  return get<PortfolioResponse>(`/v2/credits/portfolio?userId=${userId}`, true);
}

// ── Blockchain endpoints ─────────────────────────────────

export function mintCertificate(
  params: MintRequest,
): Promise<MintResult> {
  return post<MintResult>('/v2/blockchain/mint', params, true);
}

export function getCertificate(id: string): Promise<Certificate> {
  return get<Certificate>(`/v2/blockchain/certificate/${id}`);
}

export function linkWallet(
  params: LinkWalletRequest,
): Promise<LinkWalletResult> {
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
  params: CreditCalculationRequest,
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
  range: string,
): Promise<MetricsResponse> {
  return get<MetricsResponse>(
    `/v2/devices/${deviceId}/metrics?metric=${metric}&range=${range}`,
    true,
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
