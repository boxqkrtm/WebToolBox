import { test, expect } from "@playwright/test";

test.describe("OG Metadata", () => {
  test.use({ colorScheme: "light", locale: "en-US" });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test("should expose OG and Twitter metadata on home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveTitle("Web Utils");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Web Utils");
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/api\/og\?path=%2F$/
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  });

  test("should expose route-specific OG metadata on util page", async ({ page }) => {
    await page.goto("/utils/csv-sorter");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveTitle("CSV Sorter | Web Tool Box");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "CSV Sorter | Web Tool Box"
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      "Sort CSV data with flexible column options."
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/api\/og\?path=%2Futils%2Fcsv-sorter$/
    );
  });

  test("should return png for known and unknown og routes", async ({ request }) => {
    const known = await request.get("/api/og?path=/utils/csv-sorter");
    expect(known.status()).toBe(200);
    expect(known.headers()["content-type"]).toContain("image/png");
    const knownBody = await known.body();
    expect(knownBody.byteLength).toBeGreaterThan(0);

    const unknown = await request.get("/api/og?path=/unknown-route");
    expect(unknown.status()).toBe(200);
    expect(unknown.headers()["content-type"]).toContain("image/png");
    const unknownBody = await unknown.body();
    expect(unknownBody.byteLength).toBeGreaterThan(0);
  });
});

