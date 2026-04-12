/**
 * Demo service — agent guardrail tests.
 *
 * These tests lock in the contract that `src/services/demo/` is the SOLE
 * entry point for demo-mode behavior. They back the "Demo mode is fully
 * isolated" core principle (CLAUDE.md Principle #3).
 *
 * If an agent (current or Mythos-class) attempts to reintroduce a parallel
 * mock flag in back_door.js or elsewhere, these tests do not catch that
 * directly — but the ESLint-scale audit in `src/services/demo/index.test.ts`
 * `scans for forbidden imports` test does. Together they bracket the rule.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isDemoMode, mockMarketplaceResponse, assertDemoMode } from './index';

describe('demo service (unified entry point)', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost', search: '' },
      writable: true,
    });
    vi.stubEnv('VITE_DEMO_MODE', '');
    vi.stubEnv('VITE_USE_MOCK_DATA', '');
    vi.stubEnv('VITE_USE_MARKETPLACE_MOCKS', '');
  });

  describe('isDemoMode', () => {
    it('returns false with no flags set', () => {
      expect(isDemoMode()).toBe(false);
    });

    it('honors VITE_DEMO_MODE', () => {
      vi.stubEnv('VITE_DEMO_MODE', 'true');
      expect(isDemoMode()).toBe(true);
    });

    it('honors legacy VITE_USE_MOCK_DATA alias', () => {
      vi.stubEnv('VITE_USE_MOCK_DATA', 'true');
      expect(isDemoMode()).toBe(true);
    });

    it('honors legacy VITE_USE_MARKETPLACE_MOCKS alias', () => {
      vi.stubEnv('VITE_USE_MARKETPLACE_MOCKS', 'true');
      expect(isDemoMode()).toBe(true);
    });

    it('honors localStorage toggle', () => {
      localStorage.setItem('bluesignal_demo_mode', 'true');
      expect(isDemoMode()).toBe(true);
    });

    it('honors ?demo=1 URL param', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost', search: '?demo=1' },
        writable: true,
      });
      expect(isDemoMode()).toBe(true);
    });
  });

  describe('mockMarketplaceResponse', () => {
    it('returns empty nfts array for events/listings', () => {
      expect(mockMarketplaceResponse('events/listings')).toEqual({ nfts: [] });
    });

    it('returns empty events array for events/all', () => {
      expect(mockMarketplaceResponse('events/all')).toEqual({ events: [] });
    });

    it('returns empty array for other events/* endpoints', () => {
      expect(mockMarketplaceResponse('events/listed')).toEqual([]);
    });

    it('returns listing-fee shape', () => {
      expect(mockMarketplaceResponse('get/listing_fee')).toEqual({ fee: 0 });
    });

    it('returns highest-bids shape', () => {
      expect(mockMarketplaceResponse('get/highest_bids')).toEqual({ bids: [] });
    });

    it('returns empty object for unknown endpoints (sane fallback)', () => {
      expect(mockMarketplaceResponse('seller/list_nft')).toEqual({});
    });
  });

  describe('assertDemoMode', () => {
    it('throws when demo mode is off', () => {
      expect(() => assertDemoMode('test-context')).toThrow(/production code path/);
    });

    it('does not throw when demo mode is on', () => {
      vi.stubEnv('VITE_DEMO_MODE', 'true');
      expect(() => assertDemoMode('test-context')).not.toThrow();
    });
  });
});
