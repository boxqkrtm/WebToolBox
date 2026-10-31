/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out for development with API routes
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), display-capture=(self), clipboard-write=(self), geolocation=(), payment=(), usb=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      '/utils/mp4-to-gif',
      '/utils/gif-crop',
      '/utils/gif-cutter',
      '/utils/gif-optimizer',
      '/utils/gif-speed-changer',
      '/utils/gif-to-mp4-webp',
      '/utils/video-cutter-encoder',
      '/category/gif',
    ].map((source) => ({
      source,
      destination: '/utils/mp4-gif-studio',
      permanent: true,
    }));
  },
};

export default nextConfig;
