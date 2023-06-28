import { defineConfig } from 'vite'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' }) // load env vars from .env

export default defineConfig({
  server: {
    port: 3000,
  },
  define: {
    CLIENT_SECRET: `"${process.env.CLIENT_SECRET}"`,
    SSO_ENDPOINT: `"${process.env.SSO_ENDPOINT}"`,
    SERVER_ENDPOINT: `"${process.env.SERVER_ENDPOINT}"`,
    SERVER_TOKEN_ENDPOINT: `"${process.env.SERVER_TOKEN_ENDPOINT}"`,
    SSO_AUTHORIZATION_ENDPOINT: `"${process.env.SSO_AUTHORIZATION_ENDPOINT}"`,
    CLIENT_ID: `"${process.env.CLIENT_ID}"`,
    CALLBACK_URL: `"http://localhost:3000"`,
  },
})
