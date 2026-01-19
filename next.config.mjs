/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out for development with API routes
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
