/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../../.env' })

const nextConfig = {
  reactStrictMode: false,
  env: {
    CALLBACK_URL: process.env.CALLBACK_URL,
    SERVER_ENDPOINT: `http://localhost:${process.env.SERVER_PORT}`,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    API_KEY: process.env.API_KEY,
    CLIENT_ID: process.env.CLIENT_ID,
    GEETEST_ENDPOINT: process.env.GEETEST_ENDPOINT,
  },
}

module.exports = nextConfig
