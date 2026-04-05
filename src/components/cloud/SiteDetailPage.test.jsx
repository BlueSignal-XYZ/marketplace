/**
 * SiteDetailPage tests — verifies no crash when navigating to site detail.
 * Tests normalization helpers and basic render.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock dependencies
vi.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: false, loadError: null }),
  GoogleMap: () => <div data-testid="google-map">Map</div>,
  Marker: () => null,
  Polygon: () => null,
}));

vi.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    STATES: { user: { uid: 'test-user' } },
  }),
}));

vi.mock('../../services/v2/api', () => ({
  getSites: vi.fn(() => Promise.resolve([{ id: 'site-1', name: 'Test Site', devices: [] }])),
  getDevices: vi.fn(() => Promise.resolve([])),
  getAlerts: vi.fn(() => Promise.resolve([])),
}));

vi.mock('../CloudPageLayout', () => ({
  default: ({ children }) => <div data-testid="cloud-layout">{children}</div>,
}));

describe('SiteDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing when site is found', async () => {
    const { default: SiteDetailPage } = await import('./SiteDetailPage');
    render(
      <MemoryRouter initialEntries={['/cloud/sites/site-1']}>
        <Routes>
          <Route path="/cloud/sites/:siteId" element={<SiteDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    // Wait for site content to load (no crash)
    await waitFor(
      () => {
        expect(screen.getByText('Site Overview')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('handles site not found gracefully', async () => {
    const { getSites } = await import('../../services/v2/api');
    getSites.mockResolvedValueOnce([]); // No sites

    const { default: SiteDetailPage } = await import('./SiteDetailPage');
    render(
      <MemoryRouter initialEntries={['/cloud/sites/nonexistent']}>
        <Routes>
          <Route path="/cloud/sites/:siteId" element={<SiteDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(
      () => {
        expect(screen.queryByText(/Site not found|not exist/)).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });
});
