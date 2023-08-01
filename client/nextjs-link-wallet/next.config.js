/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
  reactStrictMode: false,
  env: {
    OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
    OIDC_SCOPE: process.env.OIDC_SCOPE,
    OIDC_CALLBACK_URL: process.env.OIDC_CALLBACK_URL,
    OIDC_AUTHORIZATION_ENDPOINT: process.env.OIDC_AUTHORIZATION_ENDPOINT,
    SERVER_RONIN_TOKEN_ENDPOINT: process.env.SERVER_RONIN_TOKEN_ENDPOINT,
    SERVER_RONIN_NONCE_ENDPOINT: process.env.SERVER_RONIN_NONCE_ENDPOINT,
    LINK_WALLET_REDIRECT_URI: process.env.LINK_WALLET_REDIRECT_URI,
  },
}

module.exports = nextConfig
