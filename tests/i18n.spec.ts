import { test, expect } from '@playwright/test';

test.describe('Language Detection Tests', () => {
  const languages = [
    { code: 'ko', title: '웹 유틸리티', subtitle: '유용한 도구 및 유틸리티 모음' },
    { code: 'en', title: 'Web Utils', subtitle: 'A collection of useful tools and utilities.' },
    { code: 'ja', title: 'ウェブユーティリティ', subtitle: '便利なツールとユーティリティのコレクション' },
    { code: 'zh', title: '网页工具', subtitle: '实用工具和实用程序集合' },
  ];

  languages.forEach(({ code, title, subtitle }) => {
    test(`should display ${code.toUpperCase()} language when browser language is ${code}`, async ({ page, context }) => {
      // Set browser locale before navigating
      await context.addInitScript(`
        Object.defineProperty(navigator, 'language', { value: '${code}', configurable: true });
        Object.defineProperty(navigator, 'languages', { value: ['${code}', 'en'], configurable: true });
      `);
      
      // Navigate to the home page
      await page.goto('/');

      // Wait for page to load and i18n to initialize
      await page.waitForLoadState('networkidle');

      // Wait a bit for language detection to complete
      await page.waitForTimeout(1000);

      // Check page title
      const pageTitle = await page.locator('h1').textContent();
      expect(pageTitle).toBe(title);

      // Check page subtitle
      const pageSubtitle = await page.locator('p.text-xl').textContent();
      expect(pageSubtitle).toBe(subtitle);

      // Check category cards
      const jsonCategory = await page.locator('a[href="/category/json"]').locator('h3').textContent();
      const sqlCategory = await page.locator('a[href="/category/sql"]').locator('h3').textContent();
      
      expect(jsonCategory).toBe('JSON');
      expect(sqlCategory).toBe('SQL');
    });
  });

  test('should persist language selection across page navigation', async ({ page, context }) => {
    // Set Korean locale
    await context.addInitScript(`
      Object.defineProperty(navigator, 'language', { value: 'ko', configurable: true });
      Object.defineProperty(navigator, 'languages', { value: ['ko', 'en'], configurable: true });
    `);
    
    // Start with Korean language
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check home page title is in Korean
    let pageTitle = await page.locator('h1').textContent();
    expect(pageTitle).toBe('웹 유틸리티');

    // Navigate to a category page
    await page.goto('/category/json');
    await page.waitForLoadState('networkidle');

    // Navigate back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check language is still Korean
    pageTitle = await page.locator('h1').textContent();
    expect(pageTitle).toBe('웹 유틸리티');
  });

  test('should fallback to English for unsupported languages', async ({ page }) => {
    // Set unsupported language
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7' });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should fallback to English
    const pageTitle = await page.locator('h1').textContent();
    expect(pageTitle).toBe('Web Utils');
  });
});
