import { test, expect } from '@playwright/test';

test.describe('Language Detection Tests', () => {
  test.use({ colorScheme: 'light' });

  test('should persist language selection across page navigation', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    const languageSelector = page.getByRole('combobox');
    await languageSelector.click();
    await page.waitForTimeout(100);
    await page.getByText('한국어').click();
    await page.waitForTimeout(200);

    let pageTitle = await page.locator('h1').textContent();
    expect(pageTitle).toBe('웹 유틸리티');

    await page.goto('/category/database');
    await page.waitForLoadState('networkidle');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    pageTitle = await page.locator('h1').textContent();
    expect(pageTitle).toBe('웹 유틸리티');
  });

  test('should display English language by default', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    const pageTitle = await page.locator('h1').textContent();
    expect(pageTitle).toBe('Web Utils');
  });

  test('should switch to Japanese language', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    const languageSelector = page.getByRole('combobox');
    await languageSelector.click();
    await page.waitForTimeout(100);
    await page.getByText('日本語').click();
    await page.waitForTimeout(200);

    const pageTitle = await page.locator('h1').textContent();
    expect(pageTitle).toBe('ウェブユーティリティ');
  });

  test('should switch to Chinese language', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    const languageSelector = page.getByRole('combobox');
    await languageSelector.click();
    await page.waitForTimeout(100);
    await page.getByText('中文').click();
    await page.waitForTimeout(200);

    const pageTitle = await page.locator('h1').textContent();
    expect(pageTitle).toBe('网页工具');
  });
});
