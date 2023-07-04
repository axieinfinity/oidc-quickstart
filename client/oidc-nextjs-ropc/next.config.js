/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
  reactStrictMode: false,
  env: {
    GEETEST_ENDPOINT: process.env.GEETEST_ENDPOINT,
    SERVER_ROPC_TOKEN_ENDPOINT: process.env.SERVER_ROPC_TOKEN_ENDPOINT,
    SERVER_ROPC_MFA_ENDPOINT: process.env.SERVER_ROPC_MFA_ENDPOINT,
  },
}

module.exports = nextConfig
