/**
 * Virginia Nutrient Credit Calculator Service
 *
 * Calculates nutrient credits based on Virginia's Chesapeake Bay TMDL
 * trading program methodology.
 *
 * Key Virginia Rules:
 * 1. Credits only valid within same basin and same compliance year
 * 2. Exception: Eastern Shore can acquire from Potomac (1:1) or Rappahannock (1.3:1)
 * 3. Nonpoint source credits have 2:1 uncertainty ratio
 * 4. Delivery factors are basin-specific
 * 5. Credits expire at end of compliance year (Dec 31)
 * 6. Reporting deadline is Feb 1 of following year
 */

import {
  VIRGINIA_BASINS,
  UNCERTAINTY_RATIOS,
  OFFSET_FUND_PRICES,
  getBasinByCode,
  calculateDeliveredCredits,
  generateCreditSerialNumber,
  canTradeBetweenBasins,
  getExchangeRatio,
  generateComplianceYear,
} from '../../data/virginiaBasins';

import { ReadingsAPI } from '../../scripts/back_door';

/**
 * Credit calculation result
 */
export class CreditCalculationResult {
  constructor({
    projectId,
    basinCode,
    complianceYear,
    nutrientType,
    rawReductionLbs,
    deliveryFactor,
    uncertaintyRatio,
    deliveredCreditsLbs,
    estimatedValueUSD,
    calculationMethod,
    dataSource,
    periodStart,
    periodEnd,
    readings = [],
  }) {
    this.projectId = projectId;
    this.basinCode = basinCode;
    this.complianceYear = complianceYear;
    this.nutrientType = nutrientType;
    this.rawReductionLbs = rawReductionLbs;
    this.deliveryFactor = deliveryFactor;
    this.uncertaintyRatio = uncertaintyRatio;
    this.deliveredCreditsLbs = deliveredCreditsLbs;
    this.estimatedValueUSD = estimatedValueUSD;
    this.calculationMethod = calculationMethod;
    this.dataSource = dataSource;
    this.periodStart = periodStart;
    this.periodEnd = periodEnd;
    this.readings = readings;
  }
}

/**
 * Virginia Credit Calculator
 *
 * Calculates nutrient credits from a project's monitoring data,
 * applying Virginia-specific delivery factors and uncertainty ratios.
 */
export class VirginiaCreditCalculator {
  /**
   * @param {Object} project - The credit-generating project
   * @param {Object} options - Calculator options
   */
  constructor(project, options = {}) {
    this.project = project;
    this.basin = getBasinByCode(project.basinCode);
    this.options = {
      useFloorPrice: false,  // Use Offset Fund floor prices for valuation
      ...options,
    };

    if (!this.basin) {
      throw new Error(`Invalid basin code: ${project.basinCode}`);
    }
  }

  /**
   * Calculate credits for a compliance year based on monitoring data
   *
   * @param {number} complianceYear - The year (e.g., 2025)
   * @param {Object} options - Calculation options
   * @returns {Object} - Calculation results for nitrogen and phosphorus
   */
  async calculateForComplianceYear(complianceYear, options = {}) {
    const yearData = generateComplianceYear(complianceYear);

    // Get monitoring data for the period
    const monitoringData = await this.getMonitoringData(
      yearData.startDate,
      yearData.endDate
    );

    // Calculate reductions from baseline
    const nitrogenReduction = this.calculateNutrientReduction(
      monitoringData,
      'nitrogen',
      this.project.baselineNitrogenLoad
    );

    const phosphorusReduction = this.calculateNutrientReduction(
      monitoringData,
      'phosphorus',
      this.project.baselinePhosphorusLoad
    );

    // Apply delivery factors and uncertainty ratios
    const nitrogenResult = this.applyFactors(
      nitrogenReduction,
      'nitrogen',
      complianceYear,
      yearData.startDate,
      yearData.endDate,
      monitoringData.nitrogenReadings
    );

    const phosphorusResult = this.applyFactors(
      phosphorusReduction,
      'phosphorus',
      complianceYear,
      yearData.startDate,
      yearData.endDate,
      monitoringData.phosphorusReadings
    );

    return {
      complianceYear,
      yearData,
      nitrogen: nitrogenResult,
      phosphorus: phosphorusResult,
      summary: {
        totalCreditsLbs: nitrogenResult.deliveredCreditsLbs + phosphorusResult.deliveredCreditsLbs,
        totalEstimatedValue: nitrogenResult.estimatedValueUSD + phosphorusResult.estimatedValueUSD,
        verificationTier: this.project.verificationTier,
        dataSource: monitoringData.source,
        readingCount: monitoringData.totalReadings,
      },
    };
  }

  /**
   * Get monitoring data from device readings or manual entries
   */
  async getMonitoringData(startDate, endDate) {
    const deviceIds = this.project.deviceIds || [];
    let allReadings = [];

    // Fetch readings from all assigned devices
    for (const deviceId of deviceIds) {
      try {
        const response = await ReadingsAPI.get(
          deviceId,
          1000,  // limit
          new Date(startDate).getTime(),
          new Date(endDate).getTime()
        );

        if (response?.readings) {
          allReadings = allReadings.concat(
            response.readings.map(r => ({
              ...r,
              deviceId,
              source: 'sensor',
            }))
          );
        }
      } catch (error) {
        console.warn(`Failed to fetch readings for device ${deviceId}:`, error);
      }
    }

    // Separate by nutrient type
    const nitrogenReadings = allReadings.filter(r =>
      ['nitrogen', 'nitrate', 'ammonia', 'TN', 'total_nitrogen'].includes(r.type?.toLowerCase())
    );

    const phosphorusReadings = allReadings.filter(r =>
      ['phosphorus', 'phosphate', 'TP', 'total_phosphorus'].includes(r.type?.toLowerCase())
    );

    return {
      source: allReadings.length > 0 ? 'sensor' : 'manual',
      totalReadings: allReadings.length,
      nitrogenReadings,
      phosphorusReadings,
      allReadings,
      periodStart: startDate,
      periodEnd: endDate,
    };
  }

  /**
   * Calculate nutrient reduction from baseline based on monitoring data
   */
  calculateNutrientReduction(monitoringData, nutrientType, baselineLoad) {
    const readings = nutrientType === 'nitrogen'
      ? monitoringData.nitrogenReadings
      : monitoringData.phosphorusReadings;

    if (readings.length === 0) {
      // No sensor data - use practice-based calculation
      return this.calculatePracticeBasedReduction(nutrientType);
    }

    // Calculate average concentration and flow
    // This is a simplified calculation - real implementation would need
    // flow-weighted concentrations and mass balance calculations
    const avgConcentration = this.calculateAverageConcentration(readings);
    const estimatedFlow = this.estimateAnnualFlow(monitoringData);

    // Calculate annual load from monitoring data
    // Load (lbs/year) = Concentration (mg/L) * Flow (MGD) * 8.34 * 365
    const currentLoad = avgConcentration * estimatedFlow * 8.34 * 365;

    // Reduction = Baseline - Current (if positive)
    const reduction = Math.max(0, baselineLoad - currentLoad);

    return reduction;
  }

  /**
   * Calculate practice-based reduction (when no sensor data available)
   * Uses established efficiencies for different BMP types
   */
  calculatePracticeBasedReduction(nutrientType) {
    const practiceEfficiencies = {
      // Practice type: { nitrogen: efficiency, phosphorus: efficiency }
      cover_crop: { nitrogen: 0.20, phosphorus: 0.10 },
      nutrient_management: { nitrogen: 0.15, phosphorus: 0.12 },
      forest_buffer: { nitrogen: 0.50, phosphorus: 0.45 },
      stream_restoration: { nitrogen: 0.30, phosphorus: 0.35 },
      urban_bmp: { nitrogen: 0.25, phosphorus: 0.30 },
      agricultural_bmp: { nitrogen: 0.35, phosphorus: 0.30 },
      land_conversion: { nitrogen: 0.60, phosphorus: 0.55 },
      oyster_aquaculture: { nitrogen: 0.08, phosphorus: 0.00 },  // Oysters remove N, not P directly
      septic_upgrade: { nitrogen: 0.50, phosphorus: 0.30 },
      wastewater_treatment: { nitrogen: 0.80, phosphorus: 0.85 },
    };

    const efficiency = practiceEfficiencies[this.project.practiceType];
    if (!efficiency) {
      console.warn(`Unknown practice type: ${this.project.practiceType}`);
      return 0;
    }

    const baselineLoad = nutrientType === 'nitrogen'
      ? this.project.baselineNitrogenLoad
      : this.project.baselinePhosphorusLoad;

    const practiceEfficiency = nutrientType === 'nitrogen'
      ? efficiency.nitrogen
      : efficiency.phosphorus;

    return baselineLoad * practiceEfficiency;
  }

  /**
   * Calculate average concentration from readings
   */
  calculateAverageConcentration(readings) {
    if (readings.length === 0) return 0;

    const validReadings = readings.filter(r =>
      typeof r.value === 'number' && !isNaN(r.value) && r.value >= 0
    );

    if (validReadings.length === 0) return 0;

    const sum = validReadings.reduce((acc, r) => acc + r.value, 0);
    return sum / validReadings.length;
  }

  /**
   * Estimate annual flow (simplified)
   * In production, this would use flow sensor data or watershed models
   */
  estimateAnnualFlow(monitoringData) {
    // Flow readings
    const flowReadings = monitoringData.allReadings.filter(r =>
      ['flow', 'discharge', 'Q'].includes(r.type?.toLowerCase())
    );

    if (flowReadings.length > 0) {
      const avgFlow = flowReadings.reduce((acc, r) => acc + r.value, 0) / flowReadings.length;
      return avgFlow;  // Assume MGD
    }

    // Default estimate based on acreage
    // Rough estimate: 1 inch/acre/year = 27,154 gallons
    // Assume 30 inches runoff for Virginia
    const annualGallons = this.project.acreage * 30 * 27154;
    return annualGallons / 365 / 1000000;  // Convert to MGD
  }

  /**
   * Apply delivery factors and uncertainty ratios to raw reduction
   */
  applyFactors(rawReductionLbs, nutrientType, complianceYear, periodStart, periodEnd, readings) {
    const deliveryFactor = nutrientType === 'nitrogen'
      ? this.basin.nitrogenDeliveryFactor
      : this.basin.phosphorusDeliveryFactor;

    const uncertaintyRatio = UNCERTAINTY_RATIOS[this.project.sourceType];

    const deliveredCredits = calculateDeliveredCredits(
      rawReductionLbs,
      deliveryFactor,
      uncertaintyRatio
    );

    // Estimate value
    const floorPrice = OFFSET_FUND_PRICES[nutrientType];
    const estimatedValue = deliveredCredits * floorPrice;

    return new CreditCalculationResult({
      projectId: this.project.id,
      basinCode: this.basin.code,
      complianceYear,
      nutrientType,
      rawReductionLbs: Math.round(rawReductionLbs * 100) / 100,
      deliveryFactor,
      uncertaintyRatio,
      deliveredCreditsLbs: Math.round(deliveredCredits * 100) / 100,
      estimatedValueUSD: Math.round(estimatedValue * 100) / 100,
      calculationMethod: readings.length > 0 ? 'sensor-based' : 'practice-based',
      dataSource: readings.length > 0 ? 'sensor' : 'manual',
      periodStart,
      periodEnd,
      readings: readings.slice(0, 100),  // Include sample of readings
    });
  }

  /**
   * Generate credit records from calculation results
   *
   * @param {Object} calculationResult - Result from calculateForComplianceYear
   * @param {string} ownerId - User ID who will own the credits
   * @param {number} startingSerial - Starting serial number
   * @returns {Array} - Array of credit objects ready to save
   */
  generateCredits(calculationResult, ownerId, startingSerial = 1) {
    const credits = [];
    const now = new Date().toISOString();
    const yearEnd = `${calculationResult.complianceYear}-12-31T23:59:59Z`;

    let serial = startingSerial;

    // Generate nitrogen credit if any
    if (calculationResult.nitrogen.deliveredCreditsLbs > 0) {
      credits.push({
        serialNumber: generateCreditSerialNumber(
          this.basin.code,
          calculationResult.complianceYear,
          'nitrogen',
          serial++
        ),
        projectId: this.project.id,
        basinCode: this.basin.code,
        complianceYear: calculationResult.complianceYear,
        nutrientType: 'nitrogen',
        quantityLbs: calculationResult.nitrogen.deliveredCreditsLbs,
        rawQuantityLbs: calculationResult.nitrogen.rawReductionLbs,
        deliveryFactor: calculationResult.nitrogen.deliveryFactor,
        uncertaintyRatio: calculationResult.nitrogen.uncertaintyRatio,
        generatedAt: now,
        expiresAt: yearEnd,
        verificationMethod: this.project.verificationTier,
        status: 'pending_verification',
        currentOwnerId: ownerId,
        originalOwnerId: ownerId,
        calculationMethod: calculationResult.nitrogen.calculationMethod,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Generate phosphorus credit if any
    if (calculationResult.phosphorus.deliveredCreditsLbs > 0) {
      credits.push({
        serialNumber: generateCreditSerialNumber(
          this.basin.code,
          calculationResult.complianceYear,
          'phosphorus',
          serial++
        ),
        projectId: this.project.id,
        basinCode: this.basin.code,
        complianceYear: calculationResult.complianceYear,
        nutrientType: 'phosphorus',
        quantityLbs: calculationResult.phosphorus.deliveredCreditsLbs,
        rawQuantityLbs: calculationResult.phosphorus.rawReductionLbs,
        deliveryFactor: calculationResult.phosphorus.deliveryFactor,
        uncertaintyRatio: calculationResult.phosphorus.uncertaintyRatio,
        generatedAt: now,
        expiresAt: yearEnd,
        verificationMethod: this.project.verificationTier,
        status: 'pending_verification',
        currentOwnerId: ownerId,
        originalOwnerId: ownerId,
        calculationMethod: calculationResult.phosphorus.calculationMethod,
        createdAt: now,
        updatedAt: now,
      });
    }

    return credits;
  }
}

/**
 * Validate a credit purchase/transfer between basins
 */
export function validateCreditTransfer(
  credit,
  buyerBasinCode,
  quantityLbs
) {
  const errors = [];
  const warnings = [];

  // Check basin compatibility
  if (!canTradeBetweenBasins(buyerBasinCode, credit.basinCode)) {
    errors.push(`Credits from ${credit.basinCode} cannot be used in ${buyerBasinCode}`);
  }

  // Check exchange ratio
  const exchangeRatio = getExchangeRatio(buyerBasinCode, credit.basinCode);
  if (exchangeRatio > 1) {
    const effectiveCredits = quantityLbs / exchangeRatio;
    warnings.push(
      `Cross-basin trade requires ${exchangeRatio}:1 ratio. ` +
      `${quantityLbs} lbs purchased = ${effectiveCredits.toFixed(2)} lbs effective credit`
    );
  }

  // Check expiration
  const now = new Date();
  const expiresAt = new Date(credit.expiresAt);
  if (expiresAt < now) {
    errors.push('Credit has expired');
  } else if (expiresAt.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
    warnings.push('Credit expires within 30 days');
  }

  // Check status
  if (credit.status !== 'verified' && credit.status !== 'listed') {
    errors.push(`Credit status "${credit.status}" is not available for purchase`);
  }

  // Check quantity
  if (quantityLbs > credit.quantityLbs) {
    errors.push(`Requested quantity (${quantityLbs}) exceeds available (${credit.quantityLbs})`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    exchangeRatio,
    effectiveCredits: quantityLbs / exchangeRatio,
  };
}

/**
 * Calculate the effective price per pound considering exchange ratios
 */
export function calculateEffectivePrice(
  pricePerLb,
  buyerBasinCode,
  sellerBasinCode
) {
  const exchangeRatio = getExchangeRatio(buyerBasinCode, sellerBasinCode);
  return pricePerLb * exchangeRatio;
}

/**
 * Get credit estimate without generating credits
 * Useful for showing potential credits before verification
 */
export async function estimateCreditGeneration(project, complianceYear) {
  const calculator = new VirginiaCreditCalculator(project);
  return await calculator.calculateForComplianceYear(complianceYear);
}

export default VirginiaCreditCalculator;
