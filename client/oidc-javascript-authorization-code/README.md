# Single Sign-On (SSO) Implementation in Javascript

This guide will walk you through the process of implementing Single Sign-On (SSO) for your application. SSO allows users to log in once and gain access to multiple applications or services without the need to log in separately for each one.

## Prereqrisites

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

## Getting Started:

### Start Client:

1. Create a `.env` file follows file `.env.example`:

```
# OIDC ENV
OIDC_CLIENT_ID=<your_client_id>
OIDC_SCOPE="openid offline"
OIDC_CALLBACK_URL=http://localhost:3000/oauth2/callback


# AUTHORIZATION ENDPOINT
OIDC_AUTHORIZATION_ENDPOINT=https://api-gateway.skymavis.com/oauth2/auth

# SERVER ENDPOINTS
SERVER_TOKEN_ENDPOINT=http://localhost:8080/oauth2/authorization-code/token
```

2. Run: `pnpm install`
3. Run: `pnpm dev`
