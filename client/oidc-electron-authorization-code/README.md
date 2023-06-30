# Implementation for Electron

Sample using Electron.

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

### Run & Deploy

1. Add redirect uri

- Access <https://developers.skymavis.one/console/account-service/>
- Add your callback uri, default: `mavis-sso://oauth2/callback`

2. Create a `.env` file. Check out file `.env.example`:

```
## OIDC ENV
OIDC_CLIENT_ID=<your_client_id>
OIDC_SCOPE="openid offline"


# AUTHORIZATION ENDPOINT
OIDC_SSO_AUTHORIZATION_ENDPOINT=https://api-gateway.skymavis.one/oauth2/auth

# SERVER ENDPOINTS
SERVER_TOKEN_ENDPOINT=http://localhost:8080/oauth2/authorization-code/token

# ELECTRON ENV
CALLBACK_DEEPLINK=mavis-sso://oauth2/callback

```

3. Run: `pnpm install`
4. Run: `pnpm dev`
