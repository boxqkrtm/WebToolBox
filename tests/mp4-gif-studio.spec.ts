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

test.describe('MP4, GIF Studio', () => {
  test('permanently redirects legacy media routes to the studio', async ({ request }) => {
    for (const route of legacyMediaRoutes) {
      const response = await request.get(route, { maxRedirects: 0 })

      expect(response.status(), route).toBe(308)
      expect(response.headers().location, route).toBe('/utils/mp4-gif-studio')
    }
  })
})
