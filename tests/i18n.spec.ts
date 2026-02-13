import { test, expect, type Page } from '@playwright/test';

test.describe('Language Detection Tests', () => {
  test.use({ colorScheme: 'light', locale: 'en-US' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  async function selectLanguage(page: Page, language: 'ko' | 'ja' | 'zh') {
    const optionLabel = language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'Chinese';
    await page.getByTestId('language-selector').click();
    await page.getByRole('option', { name: optionLabel }).click();
    await page.waitForTimeout(200);
  }

  test('should persist language selection across page navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await selectLanguage(page, 'ko');

    let selectedLanguage = await page.evaluate(() => localStorage.getItem('language'));
    expect(selectedLanguage).toBe('"ko"');
    await expect(page.locator('h1')).not.toHaveText('Web Utils');

    await page.goto('/category/database');
    await page.waitForLoadState('networkidle');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    selectedLanguage = await page.evaluate(() => localStorage.getItem('language'));
    expect(selectedLanguage).toBe('"ko"');
  });

  test('should display English language by default', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toHaveText('Web Utils');
  });

  test('should switch to Japanese language', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await selectLanguage(page, 'ja');

    const selectedLanguage = await page.evaluate(() => localStorage.getItem('language'));
    expect(selectedLanguage).toBe('"ja"');
    await expect(page.locator('h1')).not.toHaveText('Web Utils');
  });

  test('should switch to Chinese language', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await selectLanguage(page, 'zh');

    const selectedLanguage = await page.evaluate(() => localStorage.getItem('language'));
    expect(selectedLanguage).toBe('"zh"');
    await expect(page.locator('h1')).not.toHaveText('Web Utils');
  });
});
