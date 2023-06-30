/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
  reactStrictMode: false,
  env: {
    OIDC_CALLBACK_URL: process.env.OIDC_CALLBACK_URL,
    SERVER_TOKEN_ENDPOINT: process.env.SERVER_TOKEN_ENDPOINT,
  },
}

module.exports = nextConfig
