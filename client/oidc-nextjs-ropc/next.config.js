/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../../.env' })

const nextConfig = {
  reactStrictMode: false,
  env: {
    SERVER_ENDPOINT: `http://localhost:${process.env.SERVER_PORT}`,
    GEETEST_ENDPOINT: process.env.GEETEST_ENDPOINT,
    SERVER_ROPC_TOKEN_ENDPOINT: process.env.SERVER_ROPC_TOKEN_ENDPOINT,
    SERVER_ROPC_MFA_ENDPOINT: process.env.SERVER_ROPC_MFA_ENDPOINT,
  },
}

module.exports = nextConfig
