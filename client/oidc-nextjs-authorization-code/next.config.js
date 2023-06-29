/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../../.env' })

const nextConfig = {
  reactStrictMode: false,
  env: {
    CALLBACK_URL: process.env.CALLBACK_URL,
    SSO_AUTHORIZATION_ENDPOINT: process.env.SSO_AUTHORIZATION_ENDPOINT,
    SERVER_TOKEN_ENDPOINT: process.env.SERVER_TOKEN_ENDPOINT,
    CLIENT_ID: process.env.CLIENT_ID,
    SCOPE: process.env.SCOPE,
  },
}

module.exports = nextConfig
