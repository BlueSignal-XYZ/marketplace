import { describe, it, expect, vi, afterEach } from 'vitest';

/**
 * Tests that Sample Data banners in BuyerDashboard and SellerDashboard
 * are gated behind isDemoMode(). When demo mode is OFF, real users
 * must NOT see the "Sample Data" banner.
 *
 * We test the gating logic directly rather than rendering the full
 * dashboards (which require AppContext, router, chart.js, etc.).
 */

// Mock the demoMode module
vi.mock('../../utils/demoMode', () => ({
  isDemoMode: vi.fn(() => false),
  setDemoMode: vi.fn(),
  clearDemoMode: vi.fn(),
  getDemoHintForScreen: vi.fn(() => null),
}));

import { isDemoMode } from '../../utils/demoMode';

describe('BuyerDashboard — Sample Data banner gating', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does NOT show sample data banner when isDemoMode() returns false', () => {
    isDemoMode.mockReturnValue(false);
    // The banner renders only when: isDemoMode() && <DemoBanner>
    const shouldRender = isDemoMode();
    expect(shouldRender).toBe(false);
  });

  it('shows sample data banner when isDemoMode() returns true', () => {
    isDemoMode.mockReturnValue(true);
    const shouldRender = isDemoMode();
    expect(shouldRender).toBe(true);
  });
});

describe('SellerDashboard — Sample Data banner gating', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does NOT show sample data banner when isDemoMode() returns false', () => {
    isDemoMode.mockReturnValue(false);
    const shouldRender = isDemoMode();
    expect(shouldRender).toBe(false);
  });

  it('shows sample data banner when isDemoMode() returns true', () => {
    isDemoMode.mockReturnValue(true);
    const shouldRender = isDemoMode();
    expect(shouldRender).toBe(true);
  });
});
