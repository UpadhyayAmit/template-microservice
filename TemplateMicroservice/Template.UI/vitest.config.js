import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.js', // Path to your setup file if needed
    coverage: {
      provider: 'v8', // Use V8 as the coverage provider
      reporter: ['text', 'json', 'html'], // Coverage report formats
      include: ['src/**/*.{js,ts,tsx}'], // Files to include for coverage
      exclude: ['node_modules', 'test', '.storybook/*'], // Files to exclude from coverage
    },
  },
});
