/**
 * Virginia Nutrient Credit Exchange (NCE) — first program implementation.
 * Refactored from the existing Virginia-specific calculations.
 */

import type {
  ProgramService,
  ProgramMetadata,
  CreditCalculationInput,
  CreditCalculationResult,
  ValidationResult,
  ProgramDisplayRules,
} from './ProgramService';

const METADATA: ProgramMetadata = {
  id: 'va-nce',
  name: 'Virginia Nutrient Credit Exchange',
  shortName: 'VA NCE',
  state: 'Virginia',
  region: 'Chesapeake Bay Watershed',
  description:
    'The Virginia Nutrient Credit Exchange allows point and nonpoint sources to buy and sell nutrient reduction credits to meet Chesapeake Bay TMDL requirements.',
  regulatoryBody: 'Virginia Department of Environmental Quality (DEQ)',
  website: 'https://www.deq.virginia.gov/programs/water/nutrient-credit-exchange',
  supportedNutrients: ['nitrogen', 'phosphorus'],
  active: true,
};

// Virginia-specific trading ratios
const TRADING_RATIOS: Record<string, Record<string, number>> = {
  nitrogen: {
    'sensor-verified': 1.0,
    'third-party': 0.85,
    'self-reported': 0.6,
  },
  phosphorus: {
    'sensor-verified': 1.0,
    'third-party': 0.9,
    'self-reported': 0.65,
  },
};

// Virginia baseline: minimum removal before credits are generated
const BASELINES: Record<string, number> = {
  nitrogen: 5.0, // kg
  phosphorus: 1.0, // kg
};

// Program fee (percentage)
const PROGRAM_FEE_PCT = 0.05; // 5%

export class VirginiaNceProgram implements ProgramService {
  metadata = METADATA;

  calculateCredits(input: CreditCalculationInput): CreditCalculationResult {
    const baseline = this.getBaseline(input.nutrientType);
    const ratio = this.getTradingRatio(input.nutrientType, input.verificationLevel);

    const netRemoval = Math.max(0, input.removalKg - baseline);
    const rawCredits = netRemoval * ratio;
    const fee = rawCredits * PROGRAM_FEE_PCT;
    const credits = Math.max(0, rawCredits - fee);

    const notes: string[] = [];
    if (input.removalKg < baseline) {
      notes.push(
        `Removal (${input.removalKg} kg) is below baseline (${baseline} kg). No credits generated.`
      );
    }
    if (input.verificationLevel === 'self-reported') {
      notes.push(
        'Self-reported submissions receive reduced trading ratio. Consider sensor verification.'
      );
    }
    if (input.verificationLevel === 'sensor-verified' && input.deviceId) {
      notes.push(
        `Credits backed by device ${input.deviceId} — premium sensor-verified rate applied.`
      );
    }

    return {
      credits: Math.round(credits * 100) / 100,
      unit: 'kg',
      ratioApplied: ratio,
      baselineRemoval: baseline,
      netRemoval,
      programFee: Math.round(fee * 100) / 100,
      notes,
    };
  }

  validateSubmission(input: CreditCalculationInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!input.nutrientType || !['nitrogen', 'phosphorus'].includes(input.nutrientType)) {
      errors.push('Nutrient type must be "nitrogen" or "phosphorus".');
    }
    if (!input.removalKg || input.removalKg <= 0) {
      errors.push('Removal amount must be a positive number.');
    }
    if (!input.vintage) {
      errors.push('Vintage year is required.');
    }
    if (!input.verificationLevel) {
      errors.push('Verification level is required.');
    }

    // Virginia-specific validations
    if (input.removalKg > 10000) {
      warnings.push('Submissions over 10,000 kg require additional review.');
    }
    if (input.verificationLevel === 'self-reported') {
      warnings.push('Self-reported credits are subject to DEQ audit.');
    }

    const vintageYear = parseInt(input.vintage, 10);
    const currentYear = new Date().getFullYear();
    if (vintageYear && vintageYear < currentYear - 5) {
      errors.push('Credits older than 5 years are not eligible under Virginia NCE.');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  getDisplayRules(): ProgramDisplayRules {
    return {
      accentColor: '#0052CC',
      badgeLabel: 'VA NCE',
      creditUnit: 'credits',
      customFields: [
        { key: 'watershed', label: 'Watershed' },
        { key: 'dischargePoint', label: 'Discharge Point' },
        { key: 'tmclSegment', label: 'TMDL Segment' },
      ],
    };
  }

  getBaseline(nutrientType: 'nitrogen' | 'phosphorus'): number {
    return BASELINES[nutrientType] || 0;
  }

  getTradingRatio(nutrientType: 'nitrogen' | 'phosphorus', verificationLevel: string): number {
    return TRADING_RATIOS[nutrientType]?.[verificationLevel] || 0.5;
  }
}
