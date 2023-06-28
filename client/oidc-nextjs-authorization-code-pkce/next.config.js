/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../../.env' })

const nextConfig = {
  reactStrictMode: false,
  env: {
    CALLBACK_URL: process.env.CALLBACK_URL,
    SERVER_ENDPOINT: `http://localhost:${process.env.SERVER_PORT}`,
    SERVER_TOKEN_ENDPOINT: process.env.SERVER_TOKEN_ENDPOINT,
    SSO_AUTHORIZATION_ENDPOINT: process.env.SSO_AUTHORIZATION_ENDPOINT,
    CLIENT_ID: process.env.CLIENT_ID,
  },
}

module.exports = nextConfig
