/**
 * lazyWithRetry — wraps React.lazy with chunk-load error recovery.
 *
 * When a code-split chunk fails to load (e.g. after a new deployment
 * invalidates old chunk hashes), this detects the failure and triggers
 * a single page reload to fetch the updated entry point + chunks.
 *
 * Prevents the "text/html is not a valid JavaScript MIME type" error
 * that occurs when the SPA rewrite returns index.html instead of a
 * missing JS chunk.
 */

import React from 'react';

const RELOAD_KEY = '__chunk_reload';

export function lazyWithRetry(importFn) {
  return React.lazy(() =>
    importFn().catch((error) => {
      const isChunkError =
        error?.message?.includes('MIME type') ||
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Loading CSS chunk') ||
        error?.name === 'ChunkLoadError';

      // Only auto-reload once to prevent infinite loops
      const hasReloaded = sessionStorage.getItem(RELOAD_KEY);

      if (isChunkError && !hasReloaded) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        window.location.reload();
        // Return a never-resolving promise to prevent rendering while reloading
        return new Promise(() => {});
      }

      // Clear the flag on successful loads (will happen after reload)
      sessionStorage.removeItem(RELOAD_KEY);

      // Re-throw if it's not a chunk error or we already retried
      throw error;
    })
  );
}

// Clear the reload flag on successful app boot
if (typeof window !== 'undefined') {
  sessionStorage.removeItem(RELOAD_KEY);
}
