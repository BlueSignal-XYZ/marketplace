import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dual-mode build configuration for Marketplace + Cloud
// - Each build outputs BOTH HTML files to the target dist folder
// - Firebase rewrites determine which HTML is served based on hosting target
// - WQT (dist-wqt) → index.html via Firebase rewrites
// - Cloud (dist-cloud) → cloud.html via Firebase rewrites

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",  // WaterQuality.Trading entry
        cloud: "cloud.html"  // BlueSignal Cloud entry
      }
    }
  }
});