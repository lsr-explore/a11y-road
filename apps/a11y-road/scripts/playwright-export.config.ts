import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: '.',
  testMatch: 'export-manifest.ts',
  use: {
    baseURL,
  },
  // Single browser is sufficient for manifest export
  projects: [
    {
      name: 'export',
      use: { browserName: 'chromium' },
    },
  ],
  // No retries — export should succeed or fail clearly
  retries: 0,
  // No parallel — pages must be visited sequentially
  workers: 1,
});
