/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This rewrites API requests to use the files in the /pages/api directory
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig