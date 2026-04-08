/**
 * useFirstTime — show-once components that self-destruct.
 *
 * Checks `user.dismissed[featureKey]` in Firebase. Shows feature once,
 * persists dismissal, never shows again. Falls back to localStorage
 * for unauthenticated users.
 *
 * Usage:
 *   const { isFirstTime, dismiss } = useFirstTime('marketplace-intro');
 *
 *   if (isFirstTime) {
 *     return <IntroCard onDismiss={dismiss} />;
 *   }
 */

import { useState, useCallback, useEffect } from 'react';

// ── Types ─────────────────────────────────────────────────

export interface UseFirstTimeResult {
  /** True if the user has NOT dismissed this feature yet */
  isFirstTime: boolean;
  /** Call to mark this feature as dismissed (persistent) */
  dismiss: () => void;
  /** Loading state while checking Firebase */
  isLoading: boolean;
}

interface UseFirstTimeOptions {
  /** Firebase user object with `uid` and `dismissed` map. Optional. */
  user?: { uid: string; dismissed?: Record<string, boolean> } | null;
  /** Callback to persist dismissal to Firebase. Optional. */
  onDismiss?: (featureKey: string) => Promise<void>;
}

// ── Constants ─────────────────────────────────────────────

const STORAGE_PREFIX = 'bs_dismissed_';

// ── Hook ──────────────────────────────────────────────────

export function useFirstTime(
  featureKey: string,
  options: UseFirstTimeOptions = {}
): UseFirstTimeResult {
  const { user, onDismiss } = options;
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check dismissal state on mount
  useEffect(() => {
    // 1. Check Firebase user dismissed map
    if (user?.dismissed?.[featureKey]) {
      setIsFirstTime(false);
      setIsLoading(false);
      return;
    }

    // 2. Fallback to localStorage for unauthenticated or missing user data
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${featureKey}`);
      if (stored === 'true') {
        setIsFirstTime(false);
      }
    } catch {
      // localStorage might be unavailable (private browsing, etc.)
    }

    setIsLoading(false);
  }, [featureKey, user]);

  const dismiss = useCallback(async () => {
    setIsFirstTime(false);

    // Persist to localStorage (always, as fast fallback)
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${featureKey}`, 'true');
    } catch {
      // Silently fail
    }

    // Persist to Firebase if callback provided
    if (onDismiss) {
      try {
        await onDismiss(featureKey);
      } catch (error) {
        console.error(`[useFirstTime] Failed to persist dismissal for "${featureKey}":`, error);
      }
    }
  }, [featureKey, onDismiss]);

  return { isFirstTime, dismiss, isLoading };
}
