/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone mode for Docker builds
  output: 'standalone',
  
  // Optimize for production builds
  swcMinify: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Image optimization settings
  images: {
    unoptimized: false,
    domains: [],
  },
  
  // TypeScript settings
  typescript: {
    // Disable type checking during build (already checked in lint script)
    ignoreBuildErrors: false,
  },
  
  // ESLint settings
  eslint: {
    // Disable ESLint during build (already checked in lint script)
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
