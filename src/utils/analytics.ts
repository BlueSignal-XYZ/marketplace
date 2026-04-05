/**
 * Google Analytics 4 Integration
 *
 * Provides GA4 initialization and event tracking for the SPA.
 * No-ops gracefully if the measurement ID is missing or undefined,
 * so the app works fine without GA configured (local dev, CI, etc.).
 *
 * Usage:
 *   import { initGA, trackPageView, trackEvent } from '../utils/analytics';
 *   initGA(import.meta.env.VITE_GA4_MEASUREMENT_ID);
 *   trackPageView('/dashboard/main');
 *   trackEvent('device_commissioned', { deviceId: 'BS-001' });
 */

// Extend Window to include gtag + dataLayer
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

/**
 * Load the gtag.js script and configure GA4.
 * Safe to call multiple times — only initializes once.
 * No-ops if measurementId is falsy.
 */
export function initGA(measurementId?: string): void {
  if (!measurementId || typeof window === 'undefined' || initialized) return;
  initialized = true;

  // Inject the gtag.js script tag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize the dataLayer + gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // send_page_view: false — we track SPA navigations manually via trackPageView
  window.gtag('config', measurementId, { send_page_view: false });
}

/**
 * Track a virtual page view (SPA navigation).
 */
export function trackPageView(path: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', { page_path: path });
}

/**
 * Track a custom event.
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
