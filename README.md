# SKY MAVIS SSO QUICK START

## Prerequisites

1. Request access to Sky Mavis Account and configure client settings.

   - Docs: <https://docs.skymavis.com/docs/sma-get-started>
   - Developer Portal: <https://developers.skymavis.one/>

2. When you have access to the Sky Mavis Account service, open the Developer Console > Products > OAuth 2.0 to configure the client-side settings.

   - CLIENT ID
   - CLIENT SECRET
   - SIGN IN REDIRECT URI (CALLBACK_URL)

<img src="https://files.readme.io/284792b-small-app-oauth-configuration.png" alt="MarineGEO circle logo"/>

3. Create a `.env` file at the root of your project directory and add environment variables you need for your project. Check out file `.env.example`:

```
## SKY MAVIS SSO ENV
CLIENT_SECRET=<your_client_secret>
API_KEY=<your_api_key>
CLIENT_ID=<your_client_id>
SCOPE="openid offline"
CALLBACK_URL=http://localhost:3000/oauth2/callback
SSO_AUTHORIZATION_ENDPOINT=https://api-gateway.skymavis.one/oauth2/auth
SSO_TOKEN_ENDPOINT=https://api-gateway.skymavis.one/account/oauth2/token
SSO_USERINFO_ENDPOINT=https://api-gateway.skymavis.one/account/userinfo
SSO_JWKS_ENDPOINT=https://api-gateway.skymavis.one/account/.well-known/jwks.json

# SERVER ENDPOINTS
SERVER_TOKEN_ENDPOINT=http://localhost:8080/oauth2/authorization-code/token
SERVER_REFRESH_TOKEN_ENDPOINT=http://localhost:8080/oauth2/authorization-code/refresh_token
SERVER_ROPC_TOKEN_ENDPOINT=http://localhost:8080/oauth2/ropc/token
SERVER_ROPC_MFA_ENDPOINT=http://localhost:8080/oauth2/ropc/mfa
SERVER_USERINFO_ENDPOINT=http://localhost:8080/oauth2/userinfo
SERVER_RONIN_NONCE_ENDPOINT=http://localhost:8080/oauth2/ronin/fetch-nonce
SERVER_RONIN_TOKEN_ENDPOINT=http://localhost:8080/oauth2/ronin/token

# ELECTRON ENV
CALLBACK_DEEPLINK=mavis-sso://oauth2/callback

# CAPTCHA ENV
GEETEST_ENDPOINT=https://captcha.skymavis.one/api/geetest/register
```

## How to run

1. Run Nodejs server:

```bash
cd server/nodejs
pnpm install && pnpm dev
```

2. Go to your favorite sample, install packages and start:

```bash
cd client/oidc-nextjs-ropc
pnpm install && pnpm dev
```
