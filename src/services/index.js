/**
 * BlueSignal Services Index
 *
 * Central export for all business logic services
 */

// Existing services
export { default as cloudMockAPI } from './cloudMockAPI';

// Commercial pipeline services
export { default as orderService } from './orderService';
export { default as customerService } from './customerService';
export { default as siteService } from './siteService';
export { default as commissionService } from './commissionService';
export { default as deviceLifecycleService } from './deviceLifecycleService';

// Re-export individual functions for convenience
export {
  createQuote,
  updateQuote,
  sendQuote,
  approveQuote,
  recordPayment,
  allocateDevicesToOrder,
  shipOrder,
  fulfillOrder,
  cancelOrder,
  getOrderWithDetails,
  checkOrderFulfillmentStatus,
} from './orderService';

export {
  createCustomer,
  updateCustomer,
  getCustomerWithDetails,
  getCustomerDevices,
  findOrCreateCustomer,
  sendOnboardingInvite,
  completeOnboarding,
  searchCustomers,
} from './customerService';

export {
  createSite,
  updateSite,
  getSiteWithDevices,
  addDeviceToSite,
  removeDeviceFromSite,
  getCustomerSites,
  searchSites,
  getSitesNearLocation,
  getSiteStatus,
} from './siteService';

export {
  initializeCommission,
  startCommission,
  updatePreDeploymentCheck,
  updateCommissioningCheck,
  runTests,
  uploadPhoto,
  submitSignature,
  completeCommission,
  activateDevice,
  getCommissionWithContext,
  getInstallerJobs,
} from './commissionService';

export {
  createDevice,
  transitionLifecycle,
  validateTransition,
  allocateToOrder,
  markShipped,
  markDelivered,
  markInstalled,
  markCommissioned,
  activate,
  setMaintenance,
  decommission,
  getInventorySummary,
  getAvailableDevices,
} from './deviceLifecycleService';
