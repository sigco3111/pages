/**
 * 목적: Playwright 설정. 로컬 서버(http://localhost:4321/pages/)에 대해 테스트 수행.
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4321/pages/',
  },
  webServer: {
    command: 'node scripts/serve-pages.mjs',
    url: 'http://localhost:4321/pages/',
    timeout: 30_000,
    reuseExistingServer: !process.env.CI,
  },
});


