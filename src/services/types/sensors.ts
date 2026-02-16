/**
 * Sensor / environmental data service types — /v2/data/* endpoints.
 * Public sensor feeds, readings, watersheds.
 */
/// <reference types="geojson" />

import type { GeoLocation, OnlineStatus, Timestamped, PaginationParams, PaginatedResponse } from './common';

// ── Sensor Reading Types ──────────────────────────────────

export type ReadingType = 'pH' | 'TDS' | 'turbidity' | 'temperature' | 'ORP' | 'GPS';

export interface SensorReading {
  type: ReadingType;
  value: number;
  unit: string;
  timestamp: string;
}

// ── Public Sensor Feed (/v2/data/sensors/public) ──────────

export interface PublicSensor extends Timestamped {
  id: string;
  deviceId: string;
  name: string;
  location: GeoLocation;
  status: OnlineStatus;
  lastReadingAt: string;
  /** Latest readings snapshot */
  latestReadings: SensorReading[];
  /** Aggregated water quality index (0-100) */
  waterQualityIndex: number;
  /** Owner opted in to public sharing */
  isPublic: true;
  /** Watershed this sensor belongs to */
  watershedId?: string;
}

export interface PublicSensorListParams extends PaginationParams {
  /** Filter by watershed */
  watershedId?: string;
  /** Filter by status */
  status?: OnlineStatus;
  /** Bounding box for map queries */
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  /** Sort by quality/recency/location */
  sortBy?: 'waterQualityIndex' | 'lastReadingAt' | 'name';
  sortDirection?: 'asc' | 'desc';
}

export type PublicSensorListResponse = PaginatedResponse<PublicSensor>;

// ── Sensor Time-Series (/v2/data/sensors/:id/readings) ────

export interface SensorReadingsParams {
  sensorId: string;
  type: ReadingType;
  /** ISO 8601 range */
  startDate: string;
  endDate: string;
  /** Aggregation interval */
  interval?: '1h' | '6h' | '1d' | '1w';
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
  min?: number;
  max?: number;
  avg?: number;
}

export interface SensorTimeSeries {
  sensorId: string;
  type: ReadingType;
  unit: string;
  points: TimeSeriesPoint[];
  summary: {
    min: number;
    max: number;
    avg: number;
    count: number;
    coverage: number;  // percentage of expected readings received
  };
}

// ── Watersheds (/v2/data/watersheds) ──────────────────────

export interface Watershed extends Timestamped {
  id: string;
  name: string;
  state: string;
  region: string;
  /** Boundary polygon (GeoJSON) */
  boundary?: GeoJSON.Polygon;
  /** Aggregated stats */
  stats: WatershedStats;
}

export interface WatershedStats {
  activeSensors: number;
  totalReadings: number;
  avgWaterQualityIndex: number;
  qualityTrend: 'improving' | 'stable' | 'declining';
  nutrientLoading: {
    nitrogen: number;   // kg/yr estimated
    phosphorus: number;
  };
  activeCredits: number;
  participatingSensors: number;
  regulatoryContext?: string;
}

export interface WatershedDetail extends Watershed {
  sensors: PublicSensor[];
  /** Time-series of aggregated water quality */
  qualityHistory: TimeSeriesPoint[];
  /** Credits active in this watershed */
  creditSummary: {
    totalActive: number;
    totalRetired: number;
    avgPrice: number;
  };
}

// ── Water Quality Index ───────────────────────────────────

export type WaterQualityCategory =
  | 'excellent'    // 90-100
  | 'good'         // 70-89
  | 'fair'         // 50-69
  | 'poor'         // 25-49
  | 'critical';    // 0-24

export function getWaterQualityCategory(index: number): WaterQualityCategory {
  if (index >= 90) return 'excellent';
  if (index >= 70) return 'good';
  if (index >= 50) return 'fair';
  if (index >= 25) return 'poor';
  return 'critical';
}
