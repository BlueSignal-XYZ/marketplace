/**
 * Programs service types — /v2/programs/* endpoints.
 * Trading programs abstraction. Virginia is one instance.
 */

import type { Timestamped } from './common';
import type { NutrientType } from './market';

// ── Program ───────────────────────────────────────────────

export type ProgramStatus = 'active' | 'pilot' | 'upcoming' | 'archived';

export interface Program extends Timestamped {
  id: string;
  name: string; // e.g. "Virginia Nutrient Credit Exchange"
  shortName: string; // e.g. "VA-NCE"
  description: string;
  status: ProgramStatus;
  /** Geographic scope */
  region: string;
  state?: string;
  country: string;
  /** Supported nutrient types */
  nutrientTypes: NutrientType[];
  /** Regulatory framework info */
  regulatoryBody?: string;
  regulatoryUrl?: string;
  /** Program-specific configuration */
  config: ProgramConfig;
}

export interface ProgramConfig {
  /** Basins/sub-regions within this program */
  regions: ProgramRegion[];
  /** Whether delivery factors apply */
  hasDeliveryFactors: boolean;
  /** Whether exchange ratios apply */
  hasExchangeRatios: boolean;
  /** Uncertainty ratio applied to credits */
  uncertaintyRatio?: number;
  /** Minimum monitoring period (days) */
  minMonitoringPeriod?: number;
}

export interface ProgramRegion {
  id: string;
  name: string;
  /** Delivery factor for this region (multiplier) */
  deliveryFactor?: number;
  /** Exchange ratios to/from other regions */
  exchangeRatios?: Record<string, number>;
}

// ── Credit Calculation (/v2/programs/:id/calculate) ───────

export interface CreditCalculationRequest {
  programId: string;
  deviceId?: string;
  /** Sensor readings to calculate from */
  readings: CalculationReading[];
  regionId: string;
  nutrientType: NutrientType;
  /** Monitoring period */
  startDate: string;
  endDate: string;
}

export interface CalculationReading {
  timestamp: string;
  type: string; // pH, TDS, etc.
  value: number;
  unit: string;
}

export interface CreditEstimate {
  programId: string;
  regionId: string;
  nutrientType: NutrientType;
  /** Raw calculated credits before adjustments */
  rawCredits: number;
  /** Delivery factor applied */
  deliveryFactor: number;
  /** Uncertainty ratio applied */
  uncertaintyRatio: number;
  /** Final credit quantity after adjustments */
  finalCredits: number;
  /** Unit (typically kg) */
  unit: string;
  /** Breakdown of calculation steps */
  breakdown: CalculationStep[];
  /** Data quality assessment */
  dataQuality: {
    readingCount: number;
    coveragePercent: number;
    gapsDetected: number;
    qualityScore: number; // 0-100
  };
}

export interface CalculationStep {
  label: string;
  value: number;
  unit: string;
  description: string;
}

// ── Transfer Validation ───────────────────────────────────

export interface TransferValidation {
  valid: boolean;
  exchangeRatio?: number;
  adjustedQuantity?: number;
  reason?: string;
  warnings?: string[];
}

// ── ProgramService Interface ──────────────────────────────
// Virginia implements this. Future programs (Chesapeake Bay, Gulf Coast,
// Great Lakes, international) implement the same interface.

export interface ProgramService {
  getRegions(): ProgramRegion[];
  calculateCredits(
    readings: CalculationReading[],
    program: Program,
    regionId: string,
    nutrientType: NutrientType
  ): CreditEstimate;
  generateCredits(deviceId: string, program: Program, regionId: string): Promise<string[]>; // returns credit IDs
  validateTransfer(creditId: string, fromRegion: string, toRegion: string): TransferValidation;
}
