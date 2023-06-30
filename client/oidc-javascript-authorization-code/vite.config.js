import { defineConfig } from 'vite'
import dotenv from 'dotenv'

dotenv.config() // load env vars from .env

export default defineConfig({
  server: {
    port: 3000,
  },
  define: {
    SERVER_TOKEN_ENDPOINT: `"${process.env.SERVER_TOKEN_ENDPOINT}"`,
    OIDC_SSO_AUTHORIZATION_ENDPOINT: `"${process.env.OIDC_SSO_AUTHORIZATION_ENDPOINT}"`,
    OIDC_CLIENT_ID: `"${process.env.OIDC_CLIENT_ID}"`,
    OIDC_SCOPE: `"${process.env.OIDC_SCOPE}"`,
    OIDC_CALLBACK_URL: `"${process.env.OIDC_CALLBACK_URL}"`,
  },
})
