# Implementation for Nextjs

Sample using Nextjs.

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

### Run & Deploy

```
## OIDC ENV
OIDC_CLIENT_ID=<your_client_id>
OIDC_SCOPE="openid offline"
OIDC_CALLBACK_URL=http://localhost:3000/oauth2/callback


# AUTHORIZATION ENDPOINT
OIDC_SSO_AUTHORIZATION_ENDPOINT=https://api-gateway.skymavis.one/oauth2/auth
```

2. Run: `pnpm install`
3. Run: `pnpm dev`
