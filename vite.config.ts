// /vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Keep this config minimal + light so build doesn't get killed.
export default defineConfig({
  plugins: [react()],
  build: {
    // Turn off minification to reduce CPU / memory load during build
    minify: false,
    sourcemap: false,
    // A modern target avoids heavy legacy transforms
    target: "esnext",
  },
});