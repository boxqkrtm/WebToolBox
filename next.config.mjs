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
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
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
