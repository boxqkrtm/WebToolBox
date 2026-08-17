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
        'iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAIAAADZSiLoAAAAG0lEQVR4nAXBgQEAIAzDINznvTyCEDrpJWeG+Y7yCILgHF5wAAAAAElFTkSuQmCC',
        'base64'
      ),
    })
    await expect(page.getByTestId('dithered-qr-canvas')).toBeVisible()
    const canvas = page.getByTestId('dithered-qr-canvas')
    await expect.poll(async () => canvas.evaluate((node) => (
      node instanceof HTMLCanvasElement ? node.width : 0
    ))).toBe(147)

    const pixels = await canvas.evaluate((node) => {
      if (!(node instanceof HTMLCanvasElement)) return null
      const context = node.getContext('2d')
      if (!context) return null
      const { data, width } = context.getImageData(0, 0, node.width, node.height)
      const at = (x: number, y: number) => {
        const index = (y * width + x) * 4
        return [data[index], data[index + 1], data[index + 2]]
      }
      let mixed = 0
      let colored = 0
      for (let y = 70; y < 90; y += 1) {
        for (let x = 70; x < 90; x += 1) {
          const [red, green, blue] = at(x, y)
          const [baseRed, baseGreen, baseBlue] = at(70, 70)
          if (red !== baseRed || green !== baseGreen || blue !== baseBlue) mixed += 1
          if (red !== green || green !== blue) colored += 1
        }
      }
      return {
        quiet: at(0, 0),
        finder: at(12, 12),
        finderRing: at(15, 15),
        finderCenter: at(21, 21),
        mixed,
        colored,
      }
    })

    expect(pixels).toMatchObject({
      quiet: [255, 255, 255],
      finder: [0, 0, 0],
      finderRing: [255, 255, 255],
      finderCenter: [0, 0, 0],
    })
    expect(pixels?.mixed).toBeGreaterThan(0)
    expect(pixels?.colored).toBeGreaterThan(0)
    await expect(page.getByTestId('dithered-qr-error')).toHaveCount(0)
  });
});
