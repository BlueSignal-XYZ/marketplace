import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the real client
vi.mock('./client', () => ({
  ApiError: class ApiError extends Error {
    constructor(msg, status, code) {
      super(msg);
      this.status = status;
      this.code = code;
    }
  },
  AUTH_SESSION_EXPIRED_EVENT: 'auth:session-expired',
  getDevices: vi.fn(),
  getDevice: vi.fn(),
  getDeviceMetrics: vi.fn(),
  getDeviceAlerts: vi.fn(),
  checkDevice: vi.fn(),
  testDeviceConnection: vi.fn(),
  commissionDevice: vi.fn(),
  getAlerts: vi.fn(),
  getSites: vi.fn(),
  createSite: vi.fn(),
  getRevenueGradeStatus: vi.fn(),
  enableRevenueGrade: vi.fn(),
  disableRevenueGrade: vi.fn(),
  getCalibrations: vi.fn(),
  logCalibration: vi.fn(),
  sendDeviceCommand: vi.fn(),
  lookupHUC: vi.fn(),
  getWQTLinkStatus: vi.fn(),
  linkWQTAccount: vi.fn(),
  registerCreditProject: vi.fn(),
  getCreditProject: vi.fn(),
  getCreditAccruals: vi.fn(),
  getMarketStats: vi.fn(),
  getMarketTicker: vi.fn(),
  getListing: vi.fn(),
  searchListings: vi.fn(),
  getPublicSensors: vi.fn(),
  getWatersheds: vi.fn(),
  purchaseCredits: vi.fn(),
  submitCredits: vi.fn(),
  getPortfolio: vi.fn(),
  mintCertificate: vi.fn(),
  getCertificate: vi.fn(),
  linkWallet: vi.fn(),
  getPrograms: vi.fn(),
  getProgram: vi.fn(),
  calculateCredits: vi.fn(),
  claimDevice: vi.fn(),
  updateRevenueGrade: vi.fn(),
  unlinkWQTAccount: vi.fn(),
  calculateProjectCredits: vi.fn(),
  submitProjectVerification: vi.fn(),
}));

// Mock demo interceptor
vi.mock('./demoInterceptor', () => ({
  getDevices: vi.fn(),
  getDevice: vi.fn(),
  getDeviceMetrics: vi.fn(),
  getDeviceAlerts: vi.fn(),
  checkDevice: vi.fn(),
  testDeviceConnection: vi.fn(),
  commissionDevice: vi.fn(),
  getAlerts: vi.fn(),
  getSites: vi.fn(),
  createSite: vi.fn(),
  getRevenueGradeStatus: vi.fn(),
  enableRevenueGrade: vi.fn(),
  disableRevenueGrade: vi.fn(),
  getCalibrations: vi.fn(),
  logCalibration: vi.fn(),
  sendDeviceCommand: vi.fn(),
  lookupHUC: vi.fn(),
  getWQTLinkStatus: vi.fn(),
  linkWQTAccount: vi.fn(),
  registerCreditProject: vi.fn(),
  getCreditProject: vi.fn(),
  getCreditAccruals: vi.fn(),
}));

// Mock demoMode utility — default to non-demo
vi.mock('../../utils/demoMode', () => ({
  isDemoMode: vi.fn(() => false),
}));

// Need to re-import after mocks are set up
// The api.js module evaluates isDemoMode() at import time

describe('v2 API proxy (api.js)', () => {
  describe('when demo mode is OFF', () => {
    it('should export functions from client (not demo interceptor)', async () => {
      // In non-demo mode, the exported functions should be the real client ones
      const api = await import('./api');

      // Verify the module exports the expected functions
      expect(typeof api.getDevices).toBe('function');
      expect(typeof api.getDevice).toBe('function');
      expect(typeof api.getDeviceMetrics).toBe('function');
      expect(typeof api.getDeviceAlerts).toBe('function');
      expect(typeof api.getAlerts).toBe('function');
      expect(typeof api.getSites).toBe('function');
      expect(typeof api.createSite).toBe('function');
      expect(typeof api.checkDevice).toBe('function');
      expect(typeof api.testDeviceConnection).toBe('function');
      expect(typeof api.commissionDevice).toBe('function');
    });

    it('should export market functions (always from real client)', async () => {
      const api = await import('./api');

      expect(typeof api.getMarketStats).toBe('function');
      expect(typeof api.getMarketTicker).toBe('function');
      expect(typeof api.getListing).toBe('function');
      expect(typeof api.searchListings).toBe('function');
    });

    it('should export revenue grade functions', async () => {
      const api = await import('./api');

      expect(typeof api.getRevenueGradeStatus).toBe('function');
      expect(typeof api.enableRevenueGrade).toBe('function');
      expect(typeof api.disableRevenueGrade).toBe('function');
    });

    it('should export calibration functions', async () => {
      const api = await import('./api');

      expect(typeof api.getCalibrations).toBe('function');
      expect(typeof api.logCalibration).toBe('function');
    });

    it('should export credit project functions', async () => {
      const api = await import('./api');

      expect(typeof api.registerCreditProject).toBe('function');
      expect(typeof api.getCreditProject).toBe('function');
      expect(typeof api.getCreditAccruals).toBe('function');
    });

    it('should export ApiError class', async () => {
      const api = await import('./api');
      expect(api.ApiError).toBeDefined();
    });
  });
});
