/**
 * Mode Detection Utilities
 * Centralizes hostname-based mode detection for Cloud vs Marketplace.
 *
 * This avoids code duplication across:
 * - firebase.js
 * - LoginForm.jsx
 * - RegisterForm.jsx
 * - Welcome.jsx
 * - App.jsx
 */

/**
 * Detect if the current hostname is Cloud mode.
 * Cloud mode includes:
 * - cloud.bluesignal.xyz
 * - *.cloud.bluesignal.xyz (subdomains)
 * - cloud-bluesignal.web.app (Firebase hosting)
 * - ?app=cloud query param (dev/testing)
 *
 * @returns {boolean} - true if Cloud mode, false if Marketplace mode
 */
export const isCloudMode = () => {
  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);

  return (
    host === "cloud.bluesignal.xyz" ||
    host.endsWith(".cloud.bluesignal.xyz") ||
    host === "cloud-bluesignal.web.app" ||
    params.get("app") === "cloud"
  );
};

/**
 * Detect if the current hostname is Marketplace mode.
 * Marketplace mode includes:
 * - waterquality.trading
 * - *.waterquality.trading (subdomains)
 * - waterquality-trading.web.app (Firebase hosting)
 * - localhost (default for development)
 * - ?app=marketplace query param (dev/testing)
 *
 * @returns {boolean} - true if Marketplace mode
 */
export const isMarketplaceMode = () => {
  return !isCloudMode();
};

/**
 * Get the current mode as a string.
 *
 * @returns {'cloud' | 'marketplace'} - The current mode
 */
export const getAppMode = () => {
  return isCloudMode() ? "cloud" : "marketplace";
};
