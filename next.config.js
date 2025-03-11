/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination: '/api/:path*',
            },
        ]
    },
}
eslint: {
    ignoreDuringBuilds: true,
},
module.exports = nextConfig
