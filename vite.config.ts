import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tri-mode build configuration for Marketplace + Cloud + Sales
// - Each build outputs ONLY the appropriate HTML file
// - Build target determined by BUILD_TARGET env variable
// - WQT build: uses index.html source (waterquality.trading)
// - Cloud build: uses cloud.html source (cloud.bluesignal.xyz)
// - Sales build: uses sales.html source (sales.bluesignal.xyz)

export default defineConfig(({ mode }) => {
  const buildTarget = process.env.BUILD_TARGET;

  // Determine which HTML file to use as entry point
  const inputMap: Record<string, string> = {
    cloud: 'cloud.html',
    sales: 'sales.html',
  };
  const input = inputMap[buildTarget || ''] || 'index.html';

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        input: input
      }
    }
  };
});