import { test, expect } from "@playwright/test";

test.describe("NTRIP scan API", () => {
  test("should reject non-POST methods", async ({ request }) => {
    const response = await request.get("/api/ntrip-scan");
    expect(response.status()).toBe(405);
    expect((await response.json()).code).toBe("methodNotAllowed");
  });

  for (const host of [
    "127.0.0.1",
    "localhost",
    "169.254.169.254",
    "10.0.0.1",
    "192.168.0.1",
    "[::1]",
    "::ffff:127.0.0.1",
  ]) {
    test(`should block internal address ${host}`, async ({ request }) => {
      const response = await request.post("/api/ntrip-scan", { data: { host, port: "2101" } });
      expect(response.status()).toBe(403);
      expect((await response.json()).code).toBe("blockedAddress");
    });
  }

  for (const [label, data, code] of [
    ["missing host", { port: 2101 }, "invalidHost"],
    ["URL as host", { host: "http://example.com", port: 2101 }, "invalidHost"],
    ["non-string host", { host: ["127.0.0.1"], port: 2101 }, "invalidHost"],
    ["non-numeric port", { host: "example.com", port: "abc" }, "invalidPort"],
    ["out-of-range port", { host: "example.com", port: 70000 }, "invalidPort"],
    ["non-NTRIP port", { host: "example.com", port: 22 }, "portNotAllowed"],
  ] as const) {
    test(`should reject ${label}`, async ({ request }) => {
      const response = await request.post("/api/ntrip-scan", { data });
      expect(response.status()).toBe(400);
      expect((await response.json()).code).toBe(code);
    });
  }
});
