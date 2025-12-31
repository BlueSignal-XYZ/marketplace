/**
 * Virginia Nutrient Credit Exchange Services
 *
 * This module provides services for the Virginia Chesapeake Bay Watershed
 * Nutrient Credit Exchange program.
 */

// Credit Calculator
export { default as VirginiaCreditCalculator } from './creditCalculator';
export {
  CreditCalculationResult,
  validateCreditTransfer,
  calculateEffectivePrice,
  estimateCreditGeneration,
} from './creditCalculator';

// Project Service
export { default as projectService } from './projectService';
export {
  createProject,
  createProjectFromSite,
  linkDeviceToProject,
  unlinkDeviceFromProject,
  updateProjectStatus,
  submitForApproval,
  validateProjectForSubmission,
  getProjectSummary,
  searchProjects,
  getBasinOptions,
  getPracticeTypeOptions,
  getSourceTypeOptions,
} from './projectService';

// Re-export basin data for convenience
export {
  VIRGINIA_BASINS,
  UNCERTAINTY_RATIOS,
  OFFSET_FUND_PRICES,
  getBasinByCode,
  getBasinByCoordinates,
  getBasinByCounty,
  canTradeBetweenBasins,
  getExchangeRatio,
  generateCreditSerialNumber,
  parseCreditSerialNumber,
  calculateDeliveredCredits,
  getAllBasins,
  getBasinDisplayName,
  generateComplianceYear,
} from '../../data/virginiaBasins';
