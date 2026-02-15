/**
 * Common / shared types used across all service contracts.
 */

// ── Pagination ────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ── API Envelope ──────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string>;
}

// ── Timestamps ────────────────────────────────────────────

export interface Timestamped {
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}

// ── Geolocation ───────────────────────────────────────────

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

// ── Sort / Filter ─────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export interface SortParam {
  field: string;
  direction: SortDirection;
}

// ── Status helpers ────────────────────────────────────────

export type OnlineStatus = 'online' | 'offline' | 'unknown';
