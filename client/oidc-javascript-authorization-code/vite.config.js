import { defineConfig } from 'vite'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' }) // load env vars from .env

export default defineConfig({
  server: {
    port: 3000,
  },
  define: {
    SERVER_TOKEN_ENDPOINT: `"${process.env.SERVER_TOKEN_ENDPOINT}"`,
    SSO_AUTHORIZATION_ENDPOINT: `"${process.env.SSO_AUTHORIZATION_ENDPOINT}"`,
    CLIENT_ID: `"${process.env.CLIENT_ID}"`,
    SCOPE: `"${process.env.SCOPE}"`,
    CALLBACK_URL: `"${process.env.CALLBACK_URL}"`,
  },
})
