import { test, expect } from '@playwright/test';

const DITHERED_QR_GENERATOR_URL = 'https://www.andrewt.net/dithered-qr-codes';
const DITHERED_QR_SOURCE_URL = 'https://codeberg.org/andrew-t/dithered-qr-codes';

test.describe('QR code generator', () => {
  test.use({ colorScheme: 'light', locale: 'en-US' });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.open = ((url?: string | URL) => {
        document.body.dataset.openedUrl = String(url ?? '');
        return null;
      }) as typeof window.open;
    });
    await page.goto('/utils/qr-code-generator');
    await page.waitForLoadState('networkidle');
  });

  test('opens the dithered QR generator and credits its source', async ({ page }) => {
    await expect(page.getByTestId('dithered-qr-fun-button')).toHaveText('fun');
    await expect(page.getByTestId('dithered-qr-source-link')).toHaveAttribute(
      'href',
      DITHERED_QR_SOURCE_URL
    );
    await expect(page.getByTestId('dithered-qr-source-link')).toHaveAttribute('target', '_blank');

    await page.getByTestId('dithered-qr-fun-button').click();

    await expect(page.locator('body')).toHaveAttribute(
      'data-opened-url',
      DITHERED_QR_GENERATOR_URL
    );
  });
});
