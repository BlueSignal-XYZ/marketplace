/**
 * Demo Mode — Single Entry Point
 *
 * This module is the SOLE authority on whether demo/mock behavior is active
 * anywhere in the app. All consumers MUST import from here; no consumer
 * may re-check `VITE_DEMO_MODE`, `VITE_USE_MOCK_DATA`, or `VITE_USE_MARKETPLACE_MOCKS`
 * directly.
 *
 * Why: prior to v1.1 there were two parallel mock systems — the
 * `USE_MARKETPLACE_MOCKS` flag inside `back_door.js` and the
 * `demoInterceptor.js` / `cloudMockAPI.js` pipeline. They could disagree,
 * producing ambiguous states where some calls were mocked and others live.
 *
 * Now there is one function (`isDemoMode`) and one surface (`src/services/demo/`).
 *
 * The underlying detection lives in `src/utils/demoMode.ts` for backward
 * compatibility with existing imports — this file is the forward-facing contract.
 *
 * See: CLAUDE.md "Single demo-mode entry point — 2026-04-12" ADR.
 */

import {
  isDemoMode as _isDemoMode,
  setDemoMode as _setDemoMode,
  clearDemoMode as _clearDemoMode,
  getDemoHintForScreen as _getDemoHintForScreen,
} from '../../utils/demoMode';

/**
 * Returns true if demo/mock mode is active. The single source of truth.
 *
 * Active if any of:
 * - localStorage `bluesignal_demo_mode === 'true'` (user toggle)
 * - URL query `?demo=1`
 * - env var `VITE_DEMO_MODE === 'true'`
 * - env var `VITE_USE_MOCK_DATA === 'true'` (legacy alias, still honored)
 * - env var `VITE_USE_MARKETPLACE_MOCKS === 'true'` (legacy alias, still honored)
 */
export function isDemoMode(): boolean {
  if (_isDemoMode()) return true;

  // Honor legacy env-var aliases so a rollback to the previous flags still works.
  // These are deprecated — new code must not read them directly.
  //
  // Use direct `import.meta.env.KEY` access (not an extracted `env` variable) so
  // Vite/vitest can statically rewrite the reference — otherwise `vi.stubEnv`
  // in tests never reaches this read. Matches the pattern in `demoMode.ts`.
  try {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') return true;
    if (import.meta.env.VITE_USE_MARKETPLACE_MOCKS === 'true') return true;
  } catch {
    // import.meta may not exist in certain test environments
  }
  return false;
}

export const setDemoMode = _setDemoMode;
export const clearDemoMode = _clearDemoMode;
export const getDemoHintForScreen = _getDemoHintForScreen;

/**
 * Shape-preserving mock responder for marketplace POST endpoints.
 *
 * Used by back_door.js when demo mode is active, replacing the former
 * inline `USE_MARKETPLACE_MOCKS` branch. Keeping it here means there is
 * exactly one place to extend when new marketplace endpoints need mocks.
 *
 * @param endpoint  e.g. "events/listings", "buyer/buy_nft"
 * @returns a minimal response shape the UI can consume without crashing
 */
export function mockMarketplaceResponse(endpoint: string): unknown {
  if (endpoint === 'events/listings') return { nfts: [] };
  if (endpoint === 'events/all') return { events: [] };
  if (endpoint.startsWith('events/')) return [];
  if (endpoint === 'get/listing_fee') return { fee: 0 };
  if (endpoint === 'get/highest_bids') return { bids: [] };
  // Default: empty object so callers using `.data ?? {}` get a sane fallback.
  return {};
}

/**
 * Guard helper — throws if called outside demo mode. Useful in tests and
 * dev-only code paths to catch accidental production invocation.
 */
export function assertDemoMode(context: string): void {
  if (!isDemoMode()) {
    throw new Error(
      `[demo] assertDemoMode('${context}') called while demo mode is off. ` +
        'This indicates a production code path is leaking into mock-only code.'
    );
  }
}
