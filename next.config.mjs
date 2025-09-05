/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
  // Use deployed backend (override via BACKEND_ORIGIN). Fallback keeps app working if env not set.
  destination: `${process.env.BACKEND_ORIGIN || 'https://aspiro-backend-6e9g.onrender.com'}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
