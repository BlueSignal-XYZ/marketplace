/**
 * Virginia Chesapeake Bay Watershed Nutrient Credit Exchange
 * Basin definitions and delivery factors
 *
 * Based on Virginia's nutrient credit trading program under the Chesapeake Bay TMDL.
 * Delivery factors are derived from the Chesapeake Bay Watershed Model.
 */

// Virginia has 5 major drainage basins in the Chesapeake Bay Watershed
export interface VirginiaBasin {
  id: string;
  code: string;
  name: string;
  fullName: string;
  // Delivery factors represent the fraction of nutrients that reach the Bay
  nitrogenDeliveryFactor: number;
  phosphorusDeliveryFactor: number;
  // Geographic bounds (approximate bounding box)
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  // Counties in this basin
  counties: string[];
  // Trading rules
  tradingRules: {
    canAcquireFrom: string[];  // Basin codes this basin can acquire credits from
    exchangeRatios: Record<string, number>;  // Exchange ratios when acquiring from other basins
  };
}

export const VIRGINIA_BASINS: Record<string, VirginiaBasin> = {
  ES: {
    id: 'va-eastern-shore',
    code: 'ES',
    name: 'Eastern Shore',
    fullName: 'Eastern Shore of Virginia',
    nitrogenDeliveryFactor: 1.0,
    phosphorusDeliveryFactor: 1.0,
    bounds: {
      north: 38.03,
      south: 36.95,
      east: -75.30,
      west: -76.10,
    },
    counties: ['Accomack', 'Northampton'],
    tradingRules: {
      // Eastern Shore can acquire from Potomac and Rappahannock
      canAcquireFrom: ['POT', 'RAP'],
      exchangeRatios: {
        POT: 1.0,  // 1:1 from Potomac
        RAP: 1.3,  // 1.3:1 from Rappahannock (buyer needs 30% more)
      },
    },
  },
  JAM: {
    id: 'va-james-river',
    code: 'JAM',
    name: 'James River',
    fullName: 'James River Basin',
    nitrogenDeliveryFactor: 0.92,
    phosphorusDeliveryFactor: 0.92,
    bounds: {
      north: 38.20,
      south: 36.60,
      east: -76.30,
      west: -80.50,
    },
    counties: [
      'Alleghany', 'Amelia', 'Amherst', 'Appomattox', 'Bath', 'Bedford',
      'Botetourt', 'Brunswick', 'Buckingham', 'Campbell', 'Charles City',
      'Charlotte', 'Chesterfield', 'Craig', 'Cumberland', 'Dinwiddie',
      'Fluvanna', 'Goochland', 'Greensville', 'Halifax', 'Hanover',
      'Henrico', 'Highland', 'Isle of Wight', 'James City', 'Lunenburg',
      'Lynchburg City', 'Mecklenburg', 'Nelson', 'New Kent', 'Norfolk',
      'Nottoway', 'Petersburg City', 'Pittsylvania', 'Powhatan',
      'Prince Edward', 'Prince George', 'Richmond City', 'Roanoke',
      'Rockbridge', 'Southampton', 'Suffolk', 'Surry', 'Sussex',
      'Virginia Beach', 'York',
    ],
    tradingRules: {
      canAcquireFrom: [],  // James River is isolated - within-basin only
      exchangeRatios: {},
    },
  },
  POT: {
    id: 'va-potomac-river',
    code: 'POT',
    name: 'Potomac River',
    fullName: 'Potomac River Basin',
    nitrogenDeliveryFactor: 0.58,
    phosphorusDeliveryFactor: 0.70,
    bounds: {
      north: 39.47,
      south: 37.88,
      east: -76.85,
      west: -79.75,
    },
    counties: [
      'Alexandria City', 'Arlington', 'Augusta', 'Clarke', 'Culpeper',
      'Fairfax', 'Falls Church City', 'Fauquier', 'Frederick',
      'Fredericksburg City', 'Greene', 'Harrisonburg City', 'Highland',
      'King George', 'Loudoun', 'Madison', 'Manassas City',
      'Manassas Park City', 'Orange', 'Page', 'Prince William',
      'Rappahannock', 'Rockingham', 'Shenandoah', 'Spotsylvania',
      'Stafford', 'Staunton City', 'Warren', 'Waynesboro City',
      'Winchester City',
    ],
    tradingRules: {
      canAcquireFrom: [],  // Within-basin only
      exchangeRatios: {},
    },
  },
  RAP: {
    id: 'va-rappahannock-river',
    code: 'RAP',
    name: 'Rappahannock River',
    fullName: 'Rappahannock River Basin',
    nitrogenDeliveryFactor: 0.78,
    phosphorusDeliveryFactor: 0.92,
    bounds: {
      north: 38.85,
      south: 37.70,
      east: -76.30,
      west: -78.55,
    },
    counties: [
      'Caroline', 'Culpeper', 'Essex', 'Fauquier', 'Fredericksburg City',
      'Greene', 'King George', 'Lancaster', 'Madison', 'Middlesex',
      'Northumberland', 'Orange', 'Rappahannock', 'Richmond County',
      'Spotsylvania', 'Stafford', 'Westmoreland',
    ],
    tradingRules: {
      canAcquireFrom: [],  // Within-basin only
      exchangeRatios: {},
    },
  },
  YOR: {
    id: 'va-york-river',
    code: 'YOR',
    name: 'York River',
    fullName: 'York River Basin',
    nitrogenDeliveryFactor: 0.90,
    phosphorusDeliveryFactor: 0.99,
    bounds: {
      north: 38.20,
      south: 37.08,
      east: -76.25,
      west: -78.10,
    },
    counties: [
      'Albemarle', 'Caroline', 'Charlottesville City', 'Essex',
      'Fluvanna', 'Gloucester', 'Goochland', 'Hanover', 'Henrico',
      'James City', 'King and Queen', 'King William', 'Louisa',
      'Mathews', 'New Kent', 'Orange', 'Spotsylvania', 'Williamsburg City',
      'York',
    ],
    tradingRules: {
      canAcquireFrom: [],  // Within-basin only
      exchangeRatios: {},
    },
  },
};

// Nutrient types
export type NutrientType = 'nitrogen' | 'phosphorus';

// Source types (affects uncertainty ratio)
export type SourceType = 'point_source' | 'nonpoint_source';

// Practice types for nonpoint source credits
export type PracticeType =
  | 'wastewater_treatment'
  | 'agricultural_bmp'
  | 'land_conversion'
  | 'stream_restoration'
  | 'cover_crop'
  | 'nutrient_management'
  | 'oyster_aquaculture'
  | 'urban_bmp'
  | 'septic_upgrade'
  | 'forest_buffer';

// Verification tiers
export type VerificationTier = 'self_reported' | 'third_party' | 'sensor_backed';

// Credit status
export type VirginiaCreditStatus =
  | 'pending_verification'
  | 'verified'
  | 'listed'
  | 'reserved'
  | 'sold'
  | 'retired'
  | 'expired';

// Uncertainty ratios per source type
export const UNCERTAINTY_RATIOS: Record<SourceType, number> = {
  point_source: 1.0,    // 1:1 - no uncertainty premium
  nonpoint_source: 2.0, // 2:1 - buyer needs 2 lbs for every 1 lb of obligation
};

// Virginia Nutrient Offset Fund prices (floor prices from VA general permit)
// These are the prices if you can't find credits on the open market
export const OFFSET_FUND_PRICES: Record<NutrientType, number> = {
  nitrogen: 5.08,     // $/lb N
  phosphorus: 11.15,  // $/lb P
};

// Compliance year interface
export interface ComplianceYear {
  year: number;
  startDate: string;      // ISO date string
  endDate: string;        // ISO date string
  reportingDeadline: string;  // Feb 1 of following year
  tradingOpen: boolean;
  status: 'upcoming' | 'active' | 'closed' | 'archived';
}

// Generate compliance year for a given year
export function generateComplianceYear(year: number): ComplianceYear {
  const now = new Date();
  const currentYear = now.getFullYear();

  let status: ComplianceYear['status'];
  if (year > currentYear) {
    status = 'upcoming';
  } else if (year === currentYear) {
    status = 'active';
  } else if (year >= currentYear - 1) {
    status = 'closed';
  } else {
    status = 'archived';
  }

  return {
    year,
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
    reportingDeadline: `${year + 1}-02-01`,
    tradingOpen: status === 'active' || status === 'closed',
    status,
  };
}

// Virginia project interface (credit-generating site)
export interface VirginiaProject {
  id: string;
  organizationId: string;
  basinId: string;
  name: string;
  description: string;
  sourceType: SourceType;
  practiceType: PracticeType;
  // Baseline loads established for the project
  baselineNitrogenLoad: number;   // lbs/year
  baselinePhosphorusLoad: number; // lbs/year
  baselineEstablishedAt: string;  // ISO date
  // Project details
  acreage: number;
  latitude: number;
  longitude: number;
  verificationTier: VerificationTier;
  status: 'draft' | 'pending_approval' | 'active' | 'suspended' | 'retired';
  // Associated BlueSignal devices
  deviceIds: string[];
  siteId?: string;  // Link to existing site if applicable
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Virginia credit interface
export interface VirginiaCredit {
  id: string;
  serialNumber: string;  // Format: VA-{BASIN}-{YEAR}-{N/P}-{SERIAL}
  projectId: string;
  basinCode: string;
  complianceYear: number;
  nutrientType: NutrientType;
  // Quantities
  quantityLbs: number;          // Delivered lbs (after delivery factor)
  rawQuantityLbs: number;       // Before delivery factor
  deliveryFactor: number;       // Applied delivery factor
  uncertaintyRatio: number;     // Applied uncertainty ratio
  // Verification
  generatedAt: string;
  expiresAt: string;            // End of compliance year
  verificationMethod: VerificationTier;
  verificationEvidenceUrl?: string;
  // Status
  status: VirginiaCreditStatus;
  // Ownership
  currentOwnerId: string;
  originalOwnerId: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Helper functions

/**
 * Get basin by code
 */
export function getBasinByCode(code: string): VirginiaBasin | undefined {
  return VIRGINIA_BASINS[code.toUpperCase()];
}

/**
 * Get basin by coordinates (approximate - checks bounding box)
 */
export function getBasinByCoordinates(lat: number, lng: number): VirginiaBasin | undefined {
  for (const basin of Object.values(VIRGINIA_BASINS)) {
    if (
      lat >= basin.bounds.south &&
      lat <= basin.bounds.north &&
      lng >= basin.bounds.west &&
      lng <= basin.bounds.east
    ) {
      return basin;
    }
  }
  return undefined;
}

/**
 * Get basin by county name
 */
export function getBasinByCounty(county: string): VirginiaBasin | undefined {
  const normalizedCounty = county.toLowerCase().trim();
  for (const basin of Object.values(VIRGINIA_BASINS)) {
    if (basin.counties.some(c => c.toLowerCase() === normalizedCounty)) {
      return basin;
    }
  }
  return undefined;
}

/**
 * Check if trading between two basins is allowed
 */
export function canTradeBetweenBasins(
  buyerBasinCode: string,
  sellerBasinCode: string
): boolean {
  if (buyerBasinCode === sellerBasinCode) {
    return true;  // Same basin always allowed
  }

  const buyerBasin = getBasinByCode(buyerBasinCode);
  if (!buyerBasin) return false;

  return buyerBasin.tradingRules.canAcquireFrom.includes(sellerBasinCode);
}

/**
 * Get exchange ratio when trading between basins
 * Returns 1.0 for same-basin trades
 */
export function getExchangeRatio(
  buyerBasinCode: string,
  sellerBasinCode: string
): number {
  if (buyerBasinCode === sellerBasinCode) {
    return 1.0;
  }

  const buyerBasin = getBasinByCode(buyerBasinCode);
  if (!buyerBasin) return 0;

  return buyerBasin.tradingRules.exchangeRatios[sellerBasinCode] || 0;
}

/**
 * Generate Virginia credit serial number
 * Format: VA-{BASIN}-{YEAR}-{N/P}-{6-digit serial}
 */
export function generateCreditSerialNumber(
  basinCode: string,
  year: number,
  nutrientType: NutrientType,
  sequenceNumber: number
): string {
  const nutrientCode = nutrientType === 'nitrogen' ? 'N' : 'P';
  const serial = String(sequenceNumber).padStart(6, '0');
  return `VA-${basinCode}-${year}-${nutrientCode}-${serial}`;
}

/**
 * Parse a credit serial number
 */
export function parseCreditSerialNumber(serialNumber: string): {
  basinCode: string;
  year: number;
  nutrientType: NutrientType;
  sequenceNumber: number;
} | null {
  const match = serialNumber.match(/^VA-([A-Z]{2,3})-(\d{4})-([NP])-(\d{6})$/);
  if (!match) return null;

  return {
    basinCode: match[1],
    year: parseInt(match[2], 10),
    nutrientType: match[3] === 'N' ? 'nitrogen' : 'phosphorus',
    sequenceNumber: parseInt(match[4], 10),
  };
}

/**
 * Calculate delivered credits after applying delivery factor and uncertainty ratio
 */
export function calculateDeliveredCredits(
  rawLbs: number,
  deliveryFactor: number,
  uncertaintyRatio: number
): number {
  // Raw reduction * delivery factor / uncertainty ratio = credits
  return (rawLbs * deliveryFactor) / uncertaintyRatio;
}

/**
 * Get all basins as array
 */
export function getAllBasins(): VirginiaBasin[] {
  return Object.values(VIRGINIA_BASINS);
}

/**
 * Get basin display name with code
 */
export function getBasinDisplayName(basinCode: string): string {
  const basin = getBasinByCode(basinCode);
  if (!basin) return basinCode;
  return `${basin.name} (${basin.code})`;
}
