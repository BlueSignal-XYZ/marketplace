/**
 * useMode — reactive mode detection hook.
 *
 * Wraps the existing modeDetection utilities in a React hook
 * so components can reactively respond to the current platform mode.
 *
 * Usage:
 *   const { mode, isCloud, isMarketplace, isLanding } = useMode();
 */

import { useMemo } from 'react';
import { getAppMode, isCloudMode, isMarketplaceMode, isLandingMode } from '../../utils/modeDetection';

export type AppMode = 'cloud' | 'marketplace' | 'landing';

export interface UseModeResult {
  /** Current platform mode */
  mode: AppMode;
  /** True when running as BlueSignal Cloud (cloud.bluesignal.xyz) */
  isCloud: boolean;
  /** True when running as WQT Marketplace (waterquality.trading) */
  isMarketplace: boolean;
  /** True when running as BlueSignal Landing (bluesignal.xyz) */
  isLanding: boolean;
}

/**
 * Detect the current platform mode from hostname.
 *
 * Mode is determined once at mount and never changes during a session
 * (hostname doesn't change at runtime), so we memoize with an empty deps array.
 */
export function useMode(): UseModeResult {
  return useMemo(() => {
    const mode = getAppMode() as AppMode;
    return {
      mode,
      isCloud: isCloudMode(),
      isMarketplace: isMarketplaceMode(),
      isLanding: isLandingMode(),
    };
  }, []);
}
