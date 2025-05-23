/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com'],
  },
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig