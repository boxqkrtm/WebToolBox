import { test, expect } from "@playwright/test";

test.describe("Security headers", () => {
  test("should send security headers on pages", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["content-security-policy"]).toBe("frame-ancestors 'none'");
    expect(headers["permissions-policy"]).toContain("display-capture=(self)");
  });

  test("should not expose sample API routes", async ({ request }) => {
    expect((await request.get("/api/hello")).status()).toBe(404);
    expect((await request.get("/api/test")).status()).toBe(404);
  });
});
