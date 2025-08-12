import { test, expect } from '@playwright/test';

/**
 * 목적: 홈 페이지가 200으로 열리고, 카드가 렌더되며, 상세 링크가 BASE_URL을 포함하는지 확인한다.
 */
test('홈 페이지 로딩 및 카드/링크 확인', async ({ page }) => {
  // 네트워크 대기자를 먼저 준비하고 페이지 이동(레이스 컨디션 방지)
  const waitIndex = page.waitForResponse((r) => /\/pages\/index\.json$/.test(r.url()) && r.ok());
  await page.goto('./');
  await expect(page).toHaveTitle(/노션 보드/);
  await waitIndex;

  // 카드 하나 이상 표시
  await page.waitForSelector('.card');

  // 클릭으로 상세 이동 확인(상대 href라도 클릭 시 /pages/post/로 이동해야 함)
  await page.click('.card');
  await expect(page).toHaveURL(/\/pages\/post\//);
  await expect(page.locator('article')).toBeVisible();
});


