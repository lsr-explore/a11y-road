/// <reference types="vitest" />

import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@a11y-road/a11y-kit': path.resolve(__dirname, '../../libs/a11y-kit/src/index.ts'),
      '@a11y-road/a11y-ui/components/ui/sidebar': path.resolve(
        __dirname,
        '../../libs/a11y-ui/src/components/ui/sidebar.tsx',
      ),
      '@a11y-road/a11y-ui': path.resolve(__dirname, '../../libs/a11y-ui/src/index.ts'),
    },
  },
  test: {
    root: __dirname,
    globals: true,
    environment: 'jsdom',
    reporters: ['tree'],
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: '../../coverage/apps/a11y-road',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/test-setup.ts', 'src/app/layout.tsx'],
    },
  },
});
