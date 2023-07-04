# Implementation for Nextjs

Sample using Nextjs.

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

### How to start

#### 1. Create a `.env` file follows file `.env.example`:

```shell
# OIDC ENV
OIDC_CALLBACK_URL=http://localhost:3000/oauth2/callback

# SERVER ENDPOINT
SERVER_TOKEN_ENDPOINT=http://localhost:8080/oauth2/authorization-code/token
```

#### 2. Run: 
`pnpm install && pnpm dev`
