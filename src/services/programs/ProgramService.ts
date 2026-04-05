/**
 * ProgramService Interface — abstracts trading programs.
 * Each program (Virginia NCE, Chesapeake Bay, etc.) implements this interface.
 * Credit calculation, validation, and display rules are program-specific.
 */

export interface ProgramMetadata {
  id: string;
  name: string;
  shortName: string;
  state: string;
  region: string;
  description: string;
  regulatoryBody: string;
  website: string;
  supportedNutrients: ('nitrogen' | 'phosphorus' | 'combined')[];
  active: boolean;
}

export interface CreditCalculationInput {
  nutrientType: 'nitrogen' | 'phosphorus';
  removalKg: number;
  deviceId?: string;
  verificationLevel: 'sensor-verified' | 'third-party' | 'self-reported';
  vintage: string;
  metadata?: Record<string, unknown>;
}

export interface CreditCalculationResult {
  credits: number;
  unit: string;
  ratioApplied: number;
  baselineRemoval: number;
  netRemoval: number;
  programFee: number;
  notes: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProgramDisplayRules {
  /** Color accent for program badge */
  accentColor: string;
  /** Badge label shown in marketplace */
  badgeLabel: string;
  /** Credit unit label (e.g., "credits", "offsets", "certificates") */
  creditUnit: string;
  /** Custom fields to display on listing detail */
  customFields: { key: string; label: string }[];
}

export interface ProgramService {
  /** Program metadata */
  metadata: ProgramMetadata;

  /** Calculate credits from removal data */
  calculateCredits(input: CreditCalculationInput): CreditCalculationResult;

  /** Validate a submission meets program requirements */
  validateSubmission(input: CreditCalculationInput): ValidationResult;

  /** Get display rules for this program in the UI */
  getDisplayRules(): ProgramDisplayRules;

  /** Get program-specific baseline (kg removed before credits start) */
  getBaseline(nutrientType: 'nitrogen' | 'phosphorus'): number;

  /** Get trading ratio (credits per kg removed) */
  getTradingRatio(nutrientType: 'nitrogen' | 'phosphorus', verificationLevel: string): number;
}
