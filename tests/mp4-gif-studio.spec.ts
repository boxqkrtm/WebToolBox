import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, test } from '@playwright/test'

const legacyMediaRoutes = [
  '/utils/mp4-to-gif',
  '/utils/gif-crop',
  '/utils/gif-cutter',
  '/utils/gif-optimizer',
  '/utils/gif-speed-changer',
  '/utils/gif-to-mp4-webp',
  '/utils/video-cutter-encoder',
  '/category/gif',
]

function createAnimatedWebp() {
  const directory = mkdtempSync(join(tmpdir(), 'studio-webp-'))
  const outputPath = join(directory, 'animated-color.webp')
  execFileSync('python3', ['-c', `
from PIL import Image
frames = [Image.new('RGB', (48, 32), color) for color in ('#ff3b30', '#34c759', '#007aff')]
frames[0].save(${JSON.stringify(outputPath)}, format='WEBP', save_all=True, append_images=frames[1:], duration=[120, 120, 120], loop=0, quality=80)
`])
  return {
    name: 'animated-color.webp',
    mimeType: 'image/webp',
    buffer: readFileSync(outputPath),
  }
}

test.describe('MP4, GIF Studio', () => {
  test.use({ colorScheme: 'light', locale: 'en-US' })

  test('permanently redirects legacy media routes to the studio', async ({ request }) => {
    for (const route of legacyMediaRoutes) {
      const response = await request.get(route, { maxRedirects: 0 })

      expect(response.status(), route).toBe(308)
      expect(response.headers().location, route).toBe('/utils/mp4-gif-studio')
    }
  })

  test('allows WebP input', async ({ page }) => {
    await page.goto('/utils/mp4-gif-studio')
    await expect(page.locator('#mp4-gif-studio-upload')).toHaveAttribute(
      'accept',
      'video/*,image/gif,image/webp,.gif,.webp'
    )
  })

  test('analyzes and exports an animated WebP', async ({ page }) => {
    test.setTimeout(180_000)
    await page.goto('/utils/mp4-gif-studio')
    await page.locator('#mp4-gif-studio-upload').setInputFiles(createAnimatedWebp())

    await expect(page.getByText('Ready to edit')).toBeVisible({ timeout: 150_000 })
    await expect(page.getByRole('alert')).toHaveCount(0)
    await page.locator('#studio-auto-download').uncheck()
    await page.getByTestId('studio-export-button').click()
    await expect(page.getByTestId('studio-result')).toBeVisible({ timeout: 150_000 })
    await expect(page.getByTestId('studio-result').locator('video')).toBeVisible()
  })
})
