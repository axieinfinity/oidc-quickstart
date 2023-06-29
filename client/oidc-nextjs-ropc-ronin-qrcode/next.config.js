/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../../.env' })

const nextConfig = {
  reactStrictMode: false,
  env: {
    CALLBACK_URL: process.env.CALLBACK_URL,
    SERVER_TOKEN_ENDPOINT: process.env.SERVER_TOKEN_ENDPOINT,
  },
}

module.exports = nextConfig
