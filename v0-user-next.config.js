/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    // Enable React Server Components
    serverComponents: true,
    // Enable App Router
    appDir: true,
  },
}

module.exports = nextConfig

