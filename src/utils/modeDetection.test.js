import { describe, it, expect } from 'vitest';
import {
  isLandingMode,
  isSalesMode,
  isCloudMode,
  isMarketplaceMode,
  getAppMode,
} from './modeDetection';

const setLocation = (hostname, search = '') => {
  Object.defineProperty(window, 'location', {
    value: { hostname, search },
    writable: true,
  });
};

describe('modeDetection', () => {
  describe('isLandingMode', () => {
    it('returns true for bluesignal.xyz', () => {
      setLocation('bluesignal.xyz');
      expect(isLandingMode()).toBe(true);
    });

    it('returns true for www.bluesignal.xyz', () => {
      setLocation('www.bluesignal.xyz');
      expect(isLandingMode()).toBe(true);
    });

    it('returns true for sales.bluesignal.xyz', () => {
      setLocation('sales.bluesignal.xyz');
      expect(isLandingMode()).toBe(true);
    });

    it('returns true for sales-bluesignal.web.app', () => {
      setLocation('sales-bluesignal.web.app');
      expect(isLandingMode()).toBe(true);
    });

    it('returns true for ?app=landing', () => {
      setLocation('localhost', '?app=landing');
      expect(isLandingMode()).toBe(true);
    });

    it('returns false for cloud.bluesignal.xyz', () => {
      setLocation('cloud.bluesignal.xyz');
      expect(isLandingMode()).toBe(false);
    });

    it('returns false for sub.cloud.bluesignal.xyz', () => {
      setLocation('sub.cloud.bluesignal.xyz');
      expect(isLandingMode()).toBe(false);
    });

    it('returns false for waterquality.trading', () => {
      setLocation('waterquality.trading');
      expect(isLandingMode()).toBe(false);
    });
  });

  describe('isSalesMode (alias)', () => {
    it('is the same function as isLandingMode', () => {
      expect(isSalesMode).toBe(isLandingMode);
    });
  });

  describe('isCloudMode', () => {
    it('returns true for cloud.bluesignal.xyz', () => {
      setLocation('cloud.bluesignal.xyz');
      expect(isCloudMode()).toBe(true);
    });

    it('returns true for sub.cloud.bluesignal.xyz', () => {
      setLocation('sub.cloud.bluesignal.xyz');
      expect(isCloudMode()).toBe(true);
    });

    it('returns true for cloud-bluesignal.web.app', () => {
      setLocation('cloud-bluesignal.web.app');
      expect(isCloudMode()).toBe(true);
    });

    it('returns true for ?app=cloud', () => {
      setLocation('localhost', '?app=cloud');
      expect(isCloudMode()).toBe(true);
    });

    it('returns false for waterquality.trading', () => {
      setLocation('waterquality.trading');
      expect(isCloudMode()).toBe(false);
    });
  });

  describe('isMarketplaceMode', () => {
    it('returns true for waterquality.trading', () => {
      setLocation('waterquality.trading');
      expect(isMarketplaceMode()).toBe(true);
    });

    it('returns true for localhost', () => {
      setLocation('localhost');
      expect(isMarketplaceMode()).toBe(true);
    });

    it('returns false for cloud mode', () => {
      setLocation('cloud.bluesignal.xyz');
      expect(isMarketplaceMode()).toBe(false);
    });

    it('returns false for landing mode', () => {
      setLocation('bluesignal.xyz');
      expect(isMarketplaceMode()).toBe(false);
    });
  });

  describe('getAppMode', () => {
    it('returns "landing" for bluesignal.xyz', () => {
      setLocation('bluesignal.xyz');
      expect(getAppMode()).toBe('landing');
    });

    it('returns "cloud" for cloud.bluesignal.xyz', () => {
      setLocation('cloud.bluesignal.xyz');
      expect(getAppMode()).toBe('cloud');
    });

    it('returns "marketplace" for waterquality.trading', () => {
      setLocation('waterquality.trading');
      expect(getAppMode()).toBe('marketplace');
    });

    it('returns "marketplace" for localhost', () => {
      setLocation('localhost');
      expect(getAppMode()).toBe('marketplace');
    });
  });
});
