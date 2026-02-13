import Head from "next/head";
import { getRouteMeta, normalizePathname } from "@/lib/seo/routeMeta";

type SeoHeadProps = {
  pathname: string;
};

const FALLBACK_SITE_URL = "https://web-tool-box.vercel.app";
const SITE_NAME = "Web Tool Box";

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_SITE_URL;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export function SeoHead({ pathname }: SeoHeadProps) {
  const baseUrl = getBaseUrl();
  const normalizedPath = normalizePathname(pathname);
  const meta = getRouteMeta(normalizedPath);

  const canonicalUrl = `${baseUrl}${normalizedPath}`;
  const ogImageUrl = `${baseUrl}/api/og?path=${encodeURIComponent(normalizedPath)}`;
  const pageTitle = normalizedPath === "/" ? meta.title : `${meta.title} | ${SITE_NAME}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Head>
  );
}

