/**
 * Market data service types — /v2/market/* endpoints.
 * Prices, volumes, activity, search.
 */

import type { PaginationParams, PaginatedResponse, SortParam } from './common';

// ── Market Stats (/v2/market/stats) ───────────────────────

export interface MarketStats {
  totalCreditsTraded: number;
  totalCreditsRetired: number;
  activeSensors: number;
  activeListings: number;
  totalVolume: number; // USD
  avgNitrogenPrice: number; // $/credit
  avgPhosphorusPrice: number; // $/credit
  nitrogenPriceChange24h: number; // percentage
  phosphorusPriceChange24h: number;
  last24hTransactions: number;
  last7dVolume: number;
}

// ── Market Ticker (/v2/market/ticker) ─────────────────────

export interface TickerData {
  nutrientType: NutrientType;
  price: number;
  change24h: number; // percentage
  change7d: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  sparkline7d: number[]; // 7-day price points for mini chart
}

export type MarketTicker = TickerData[];

// ── Nutrient Types ────────────────────────────────────────

export type NutrientType = 'nitrogen' | 'phosphorus' | 'combined';

// ── Verification Level ────────────────────────────────────

export type VerificationLevel =
  | 'sensor-verified' // BlueSignal IoT sensor + blockchain — premium
  | 'third-party' // Independent lab/auditor verified
  | 'self-reported' // Pending verification
  | 'rejected';

// ── Listing ───────────────────────────────────────────────

export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired' | 'cancelled';

export interface Listing {
  id: string;
  creditId: string;
  sellerId: string;
  sellerName: string;
  nutrientType: NutrientType;
  quantity: number; // kg
  pricePerCredit: number; // USD
  totalPrice: number;
  region: string;
  watershed?: string;
  vintage: string; // e.g. "2025" or "2024-Q3"
  verificationLevel: VerificationLevel;
  status: ListingStatus;
  deviceId?: string; // If sensor-verified
  programId?: string;
  certificateId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface ListingSummary {
  id: string;
  creditId: string;
  nutrientType: NutrientType;
  quantity: number;
  pricePerCredit: number;
  region: string;
  verificationLevel: VerificationLevel;
  sellerName: string;
  vintage: string;
  status: ListingStatus;
  createdAt: string;
}

// ── Search / Filter (/v2/market/search) ───────────────────

export interface MarketSearchParams extends PaginationParams {
  /** Filter by region/watershed */
  region?: string;
  watershed?: string;
  /** Filter by nutrient type */
  nutrientType?: NutrientType;
  /** Price range (USD per credit) */
  priceMin?: number;
  priceMax?: number;
  /** Vintage year or range */
  vintage?: string;
  /** Verification level filter */
  verificationLevel?: VerificationLevel;
  /** Trading program */
  programId?: string;
  /** Free-text search (matches credit ID, seller, region) */
  query?: string;
  /** Sort configuration */
  sort?: SortParam;
}

export type MarketSearchResponse = PaginatedResponse<ListingSummary>;

// ── Activity Feed ─────────────────────────────────────────

export type ActivityType = 'purchase' | 'listing' | 'retirement' | 'mint';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  nutrientType: NutrientType;
  quantity: number;
  price?: number;
  region: string;
  timestamp: string;
  /** Anonymized — "Buyer #4A2F" or seller display name for listings */
  actor: string;
}
