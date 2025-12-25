import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Tri-mode build configuration for Marketplace + Cloud + Sales
// - Each build outputs ONLY the appropriate HTML file
// - Build target determined by BUILD_TARGET env variable
// - WQT build: uses index.html source (waterquality.trading)
// - Cloud build: uses cloud.html source (cloud.bluesignal.xyz)
// - Sales build: uses sales.html source (sales.bluesignal.xyz)

// List of all VITE_ environment variables used by the app
// These will be explicitly injected at build time to ensure they work
// in all CI/CD environments (Cloudflare Pages, GitHub Actions, etc.)
const VITE_ENV_VARS = [
  // Firebase config
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
  'VITE_FIREBASE_DATABASE_URL',
  // Third-party API keys
  'VITE_ALCHEMY_API_KEY',
  'VITE_GOOGLE_MAPS_API_KEY',
  'VITE_LIVEPEER_API_KEY',
  // Build metadata
  'VITE_BUILD_VERSION',
  'VITE_DEBUG',
];

// Handle common typos/variations in env var names
// Maps canonical name -> alternate name to check
const ENV_VAR_ALIASES: Record<string, string> = {
  'VITE_FIREBASE_MESSAGING_SENDER_ID': 'VITE_FIREBASE_MESSAGE_SENDER_ID',
};

export default defineConfig(({ mode }) => {
  const buildTarget = process.env.BUILD_TARGET;

  // Load env from .env files (for local development)
  const envFromFiles = loadEnv(mode, process.cwd(), 'VITE_');

  // Merge with process.env (for CI/CD where vars are in shell environment)
  // process.env takes precedence over .env files for CI/CD flexibility
  const resolvedEnv: Record<string, string | undefined> = { ...envFromFiles };
  VITE_ENV_VARS.forEach(key => {
    // Check primary env var name
    if (process.env[key]) {
      resolvedEnv[key] = process.env[key];
    }
    // Check alias if primary not found (handles typos like MESSAGE vs MESSAGING)
    else if (ENV_VAR_ALIASES[key] && process.env[ENV_VAR_ALIASES[key]]) {
      resolvedEnv[key] = process.env[ENV_VAR_ALIASES[key]];
      console.warn(`[vite.config] Using alias ${ENV_VAR_ALIASES[key]} for ${key}`);
    }
  });

  // Build the define object to inject env vars at build time
  // This ensures env vars work regardless of how they're provided
  const define: Record<string, string> = {};
  VITE_ENV_VARS.forEach(key => {
    const value = resolvedEnv[key];
    define[`import.meta.env.${key}`] = JSON.stringify(value || '');
  });

  // Debug: Log which env vars are configured (names only, not values)
  const configuredVars = VITE_ENV_VARS.filter(key => resolvedEnv[key]);
  const missingVars = VITE_ENV_VARS.filter(key => !resolvedEnv[key]);
  console.log(`[vite.config] Build target: ${buildTarget || 'wqt (default)'}`);
  console.log(`[vite.config] Mode: ${mode}`);
  console.log(`[vite.config] Configured env vars (${configuredVars.length}/${VITE_ENV_VARS.length}):`, configuredVars);
  if (missingVars.length > 0) {
    console.warn(`[vite.config] Missing env vars:`, missingVars);
  }

  // Determine which HTML file to use as entry point
  const inputMap: Record<string, string> = {
    cloud: 'cloud.html',
    sales: 'sales.html',
  };
  const input = inputMap[buildTarget || ''] || 'index.html';

  return {
    plugins: [react()],
    define,
    build: {
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        input: input,
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/database'],
            ethers: ['ethers'],
          }
        }
      }
    }
  };
});