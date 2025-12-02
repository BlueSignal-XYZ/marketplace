import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dual-mode build configuration for Marketplace + Cloud
// - Each build outputs ONLY the appropriate HTML file
// - Build target determined by BUILD_TARGET env variable
// - WQT build: uses index.html source
// - Cloud build: uses cloud.html source

export default defineConfig(({ mode }) => {
  const buildTarget = process.env.BUILD_TARGET;

  // Determine which HTML file to use as entry point
  const input = buildTarget === 'cloud' ? 'cloud.html' : 'index.html';

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        input: input
      }
    }
  };
});