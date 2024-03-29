# Implementation for Nextjs

Sample using Nextjs.

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/mavis/sky-mavis-account/guides/get-started) section to request access to Sky Mavis Account.

### How to start

#### 1. Create a `.env` file follows file `.env.example`

```shell
# OIDC ENV
OIDC_CLIENT_ID=<your_client_id>
OIDC_SCOPE="openid offline"
OIDC_CALLBACK_URL=http://localhost:3000/oauth2/callback


# AUTHORIZATION ENDPOINT
OIDC_AUTHORIZATION_ENDPOINT=https://api-gateway.skymavis.com/oauth2/auth

# SERVER ENDPOINTS
SERVER_RONIN_TOKEN_ENDPOINT=http://localhost:8080/oauth2/ronin/token
SERVER_RONIN_NONCE_ENDPOINT=http://localhost:8080/oauth2/ronin/fetch-nonce
```

#### 2. Run

`pnpm install && pnpm dev`
