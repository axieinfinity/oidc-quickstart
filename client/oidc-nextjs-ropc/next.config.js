/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../../.env' })

const nextConfig = {
  reactStrictMode: false,
  env: {
    SERVER_ENDPOINT: `http://localhost:${process.env.SERVER_PORT}`,
    GEETEST_ENDPOINT: process.env.GEETEST_ENDPOINT,
  },
}

module.exports = nextConfig
