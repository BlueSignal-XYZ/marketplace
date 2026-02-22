import { defineConfig } from 'vitest/config'
import path from 'path'

/**
 * Vitest config for integration tests.
 * These run against Firebase Emulator Suite — NOT in CI by default.
 *
 * Start emulators first:
 *   npx firebase emulators:start --only auth,database,functions
 *
 * Then run:
 *   npx vitest run --config vitest.integration.config.ts
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './src/tests/integration/setup.ts',
    include: ['src/tests/integration/**/*.test.{js,ts}'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
