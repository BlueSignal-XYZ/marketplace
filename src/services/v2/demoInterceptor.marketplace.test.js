/**
 * Tests for demo marketplace (searchListings, getListing).
 * Verifies demo listings render when demo mode is active.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Force demo mode for these tests
vi.mock('../../utils/demoMode', () => ({
  isDemoMode: vi.fn(() => true),
}));

// Mock CloudMockAPI (not needed for marketplace tests)
vi.mock('../cloudMockAPI', () => ({}));

describe('demoInterceptor marketplace', () => {
  let searchListings;
  let getListing;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('./demoInterceptor');
    searchListings = mod.searchListings;
    getListing = mod.getListing;
  });

  it('searchListings returns demo listings with pagination', async () => {
    const result = await searchListings({ page: 1, limit: 20 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('pagination');
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThanOrEqual(3);
    expect(result.pagination).toMatchObject({
      page: 1,
      limit: 20,
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  it('demo listings have required fields for marketplace table', async () => {
    const result = await searchListings({ page: 1, limit: 20 });
    const first = result.data[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('creditId');
    expect(first).toHaveProperty('nutrientType');
    expect(first).toHaveProperty('quantity');
    expect(first).toHaveProperty('pricePerCredit');
    expect(first).toHaveProperty('region');
    expect(first).toHaveProperty('verificationLevel');
    expect(first).toHaveProperty('sellerName');
    expect(first).toHaveProperty('vintage');
  });

  it('searchListings filters by nutrientType', async () => {
    const result = await searchListings({ page: 1, limit: 20, nutrientType: 'nitrogen' });
    expect(result.data.every((l) => l.nutrientType === 'nitrogen')).toBe(true);
  });

  it('searchListings filters by verificationLevel', async () => {
    const result = await searchListings({ page: 1, limit: 20, verificationLevel: 'sensor-verified' });
    expect(result.data.every((l) => l.verificationLevel === 'sensor-verified')).toBe(true);
  });

  it('getListing returns a single listing by id', async () => {
    const listing = await getListing('demo-listing-1');
    expect(listing).toHaveProperty('id', 'demo-listing-1');
    expect(listing).toHaveProperty('creditId');
    expect(listing).toHaveProperty('nutrientType');
    expect(listing).toHaveProperty('quantity');
    expect(listing).toHaveProperty('pricePerCredit');
  });

  it('getListing throws for unknown id', async () => {
    await expect(getListing('nonexistent-id')).rejects.toThrow(/not found/);
  });
});
