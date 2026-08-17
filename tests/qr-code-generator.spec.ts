import { test, expect } from '@playwright/test';

const DITHERED_QR_SOURCE_URL = 'https://codeberg.org/andrew-t/dithered-qr-codes';


test.describe('QR code generator', () => {
  test.use({ colorScheme: 'light', locale: 'en-US' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/utils/qr-code-generator');
    await page.waitForLoadState('networkidle');
  });

  test('opens the client-side dithered QR tool and supports WebP uploads', async ({ page }) => {
    await expect(page.getByTestId('dithered-qr-fun-button')).toHaveText('fun');

    await page.getByTestId('dithered-qr-fun-button').click();

    await expect(page.getByTestId('dithered-qr-panel')).toBeVisible();
    await expect(page.getByTestId('qr-code-canvas-container')).toBeHidden();
    await expect(page.getByTestId('dithered-qr-source-link')).toHaveAttribute(
      'href',
      DITHERED_QR_SOURCE_URL
    );
    await expect(page.getByTestId('dithered-qr-image-input')).toHaveAttribute(
      'accept',
      'image/*,.webp'
    );
    await page.getByTestId('dithered-qr-image-input').setInputFiles({
      name: 'sample.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        'base64'
      ),
    });
    await expect(page.getByTestId('dithered-qr-canvas')).toBeVisible();
  });
});
