import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getRouteMeta, normalizePathname } from "@/lib/seo/routeMeta";

export const config = {
  runtime: "edge",
};

export default function handler(req: NextRequest) {
  const url = new URL(req.url);
  const inputPath = url.searchParams.get("path") || "/";
  const pathname = normalizePathname(inputPath);
  const meta = getRouteMeta(pathname);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          color: "#ffffff",
          background:
            "linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 45%, rgb(15, 118, 110) 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            opacity: 0.95,
            letterSpacing: "0.02em",
          }}
        >
          Web Tool Box
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.08 }}>
            {meta.title}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.25,
              color: "rgba(255,255,255,0.88)",
              maxWidth: "1060px",
            }}
          >
            {meta.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(255,255,255,0.84)",
          }}
        >
          <div>{meta.section ?? "Utilities"}</div>
          <div>{pathname}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

