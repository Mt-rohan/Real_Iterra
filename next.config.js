// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack(config, { isServer }) {
    // Prevent crashes caused by @mediapipe/pose
    config.resolve.alias['@mediapipe/pose'] = false;
    return config;
  },
};

module.exports = nextConfig;
