/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  compress: false,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false }
    return config
  }
}

module.exports = nextConfig
