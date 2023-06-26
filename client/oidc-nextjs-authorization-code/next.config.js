/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../../.env' })

const nextConfig = {
  reactStrictMode: false,
  env: {
    CALLBACK_URL: process.env.CALLBACK_URL,
    SERVER_ENDPOINT: `http://localhost:${process.env.SERVER_PORT}`,
    CLIENT_ID: process.env.CLIENT_ID,
  },
}

module.exports = nextConfig
