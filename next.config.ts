import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // matikan di dev biar tidak ribet
  register: true,
  skipWaiting: true,
})

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
};

module.exports = withPWA(nextConfig)