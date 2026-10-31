import { test, expect } from "@playwright/test";

test.describe("SVG Preview", () => {
  test.use({ colorScheme: "light", locale: "en-US" });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto("/utils/svg-preview");
    await page.waitForLoadState("networkidle");
  });

  test("should render SVG without running embedded scripts", async ({ page }) => {
    await page.getByTestId("tab-text").click();
    await page.getByTestId("svg-code-input").fill(
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" onload="parent.__svgScriptRan = true">' +
        '<script>parent.__svgScriptRan = true;</script>' +
        '<rect width="40" height="40" fill="red"/></svg>'
    );

    const preview = page.getByTestId("svg-preview-render");
    await expect(preview).toBeVisible();
    await expect
      .poll(() => preview.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth))
      .toBe(40);

    expect(await page.evaluate(() => (window as unknown as { __svgScriptRan?: boolean }).__svgScriptRan)).toBeUndefined();
  });
});
