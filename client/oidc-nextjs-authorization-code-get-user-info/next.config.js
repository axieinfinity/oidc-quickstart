/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
  reactStrictMode: false,
  env: {
    OIDC_CALLBACK_URL: process.env.OIDC_CALLBACK_URL,
    OIDC_AUTHORIZATION_ENDPOINT: process.env.OIDC_AUTHORIZATION_ENDPOINT,
    SERVER_TOKEN_ENDPOINT: process.env.SERVER_TOKEN_ENDPOINT,
    SERVER_USERINFO_ENDPOINT: process.env.SERVER_USERINFO_ENDPOINT,
    OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
    OIDC_SCOPE: process.env.OIDC_SCOPE,
  },
}

module.exports = nextConfig
