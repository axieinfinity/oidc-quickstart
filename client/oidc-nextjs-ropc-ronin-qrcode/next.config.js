/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
  reactStrictMode: false,
  env: {
    SERVER_RONIN_TOKEN_ENDPOINT: process.env.SERVER_RONIN_TOKEN_ENDPOINT,
    SERVER_RONIN_NONCE_ENDPOINT: process.env.SERVER_RONIN_NONCE_ENDPOINT,
  },
}

module.exports = nextConfig
