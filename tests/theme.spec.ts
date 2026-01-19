import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test.use({ colorScheme: 'dark' });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/');
  });

  test('should have theme toggle button visible', async ({ page }) => {
    const themeToggleButton = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeToggleButton).toBeVisible();
  });

  test('should have dark class on initial load', async ({ page }) => {
    const htmlElement = page.locator('html');
    const hasDarkClass = await htmlElement.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkClass).toBe(true);
  });

  test('should toggle from dark to light mode', async ({ page }) => {
    const htmlElement = page.locator('html');
    const themeToggleButton = page.getByRole('button', { name: 'Toggle theme' });

    const hasDarkClassInitially = await htmlElement.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkClassInitially).toBe(true);

    await themeToggleButton.click();
    await page.waitForTimeout(100);

    const hasDarkClassAfterClick = await htmlElement.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkClassAfterClick).toBe(false);
  });

  test('should toggle from light to dark mode', async ({ page }) => {
    const htmlElement = page.locator('html');
    const themeToggleButton = page.getByRole('button', { name: 'Toggle theme' });

    await themeToggleButton.click();
    await page.waitForTimeout(100);

    const hasDarkClass = await htmlElement.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkClass).toBe(false);

    await themeToggleButton.click();
    await page.waitForTimeout(100);

    const hasDarkClassAfterSecondClick = await htmlElement.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkClassAfterSecondClick).toBe(true);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    const themeToggleButton = page.getByRole('button', { name: 'Toggle theme' });

    await themeToggleButton.click();
    await page.waitForTimeout(100);

    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('"light"');

    await themeToggleButton.click();
    await page.waitForTimeout(100);

    const newTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(newTheme).toBe('"dark"');
  });

  test('should change background color when toggling theme', async ({ page }) => {
    const htmlElement = page.locator('html');
    const mainDiv = page.locator('.min-h-screen');
    const themeToggleButton = page.getByRole('button', { name: 'Toggle theme' });

    const htmlClass = await htmlElement.evaluate(el => el.className);
    console.log('HTML class before click:', htmlClass);

    const darkBgColor = await mainDiv.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const darkBgVar = await mainDiv.evaluate(el => getComputedStyle(el).getPropertyValue('--background'));
    console.log('Dark background color:', darkBgColor);
    console.log('Dark background var:', darkBgVar);

    await themeToggleButton.click();
    await page.waitForTimeout(100);

    const htmlClassAfterClick = await htmlElement.evaluate(el => el.className);
    console.log('HTML class after click:', htmlClassAfterClick);

    const lightBgColor = await mainDiv.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const lightBgVar = await mainDiv.evaluate(el => getComputedStyle(el).getPropertyValue('--background'));
    console.log('Light background color:', lightBgColor);
    console.log('Light background var:', lightBgVar);

    expect(darkBgColor).not.toBe(lightBgColor);
  });

});

