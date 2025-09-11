/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  eslint: {
    // Désactive ESLint pendant le build de production
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
