// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  use: {
    headless: false,
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

  webServer: [
    {
      command: 'npm run dev --prefix backend',
      url: 'http://localhost:3000/tasks',
      reuseExistingServer: true,
      timeout: 120000
    },
    {
      command: 'npm run dev --prefix frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120000
    }
  ],
});
