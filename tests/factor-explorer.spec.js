const { test, expect } = require('@playwright/test');

test.describe('Factor Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('loads and shows one-number defaults', async ({ page }) => {
    await expect(page).toHaveTitle('Factor Explorer');
    await expect(page.locator('#singleExploreHint')).toHaveText('Waiting for a number...');
    await expect(page.locator('#factorResult')).toHaveText('Factors will appear here.');
    await expect(page.locator('#primeResult')).toHaveText('Prime factorisation will appear here.');
  });

  test('computes factor and prime results for one number', async ({ page }) => {
    await page.locator('#singleNumberInput').fill('36');

    await expect(page.locator('#singleExploreHint')).toContainText('Showing results for 36.');
    await expect(page.locator('#factorResult')).toContainText('Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36');
    await expect(page.locator('#primeResult')).toContainText('36 = 2 × 2 × 3 × 3');

    const compact = page.locator('#primeResult small');
    await expect(compact).toContainText('Compact: 2');
    await expect(compact.locator('sup').first()).toHaveText('2');
    await expect(compact.locator('sup').nth(1)).toHaveText('2');

    await expect(page.locator('#singleStatsWrap')).toBeVisible();
    await expect(page.locator('#singleStatsBody')).toContainText('Sum of factors');
    await expect(page.locator('#singleStatsBody')).toContainText('91');
  });

  test('computes gcd and lcm for two numbers', async ({ page }) => {
    await page.locator('#modeSelect').selectOption('two');
    await page.locator('#numA').fill('18');
    await page.locator('#numB').fill('24');

    await expect(page.locator('#gcdLcmResult')).toContainText('GCD(18, 24) = 6');
    await expect(page.locator('#gcdLcmResult')).toContainText('LCM(18, 24) = 72');
    await expect(page.locator('#twoStatsWrap')).toBeVisible();
  });

  test('shows validation for non-positive values in two-number mode', async ({ page }) => {
    await page.locator('#modeSelect').selectOption('two');
    await page.locator('#numA').fill('0');
    await page.locator('#numB').fill('10');

    await expect(page.locator('#gcdLcmResult')).toHaveText('Please enter two whole numbers greater than 0.');
    await expect(page.locator('#twoStatsWrap')).toBeHidden();
  });

  test('handles a large prime number correctly', async ({ page }) => {
    await page.locator('#singleNumberInput').fill('9973');

    await expect(page.locator('#factorResult')).toContainText('Factors of 9973: 1, 9973');
    await expect(page.locator('#primeResult')).toContainText('9973 = 9973');
    await expect(page.locator('#singleStatsBody')).toContainText('Prime number?');
    await expect(page.locator('#singleStatsBody')).toContainText('Yes');
  });

  test('keeps latest result after rapid input updates', async ({ page }) => {
    const input = page.locator('#singleNumberInput');
    await input.fill('12');
    await input.fill('24');
    await input.fill('36');

    await expect(page.locator('#singleExploreHint')).toContainText('Showing results for 36.');
    await expect(page.locator('#factorResult')).toContainText('Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36');
  });

  test('works on a mobile-sized viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.locator('#singleNumberInput').fill('48');
    await expect(page.locator('#factorResult')).toContainText('Factors of 48:');

    await page.locator('#modeSelect').selectOption('two');
    await page.locator('#numA').fill('21');
    await page.locator('#numB').fill('14');
    await expect(page.locator('#gcdLcmResult')).toContainText('GCD(21, 14) = 7');
    await expect(page.locator('#gcdLcmResult')).toContainText('LCM(21, 14) = 42');
  });
});
