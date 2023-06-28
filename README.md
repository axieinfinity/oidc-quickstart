# SKY MAVIS SSO QUICK START

## Prerequisites

1. Request access to Sky Mavis Account and configure client settings.

   - Docs: https://docs.skymavis.com/docs/sma-get-started
   - Developer Portal: https://developers.skymavis.one/

2. When you have access to the Sky Mavis Account service, open the Developer Console > Products > OAuth 2.0 to configure the client-side settings.

   - CLIENT ID
   - CLIENT SECRET
   - SIGN IN REDIRECT URI (CALLBACK_URL)

<img src="https://files.readme.io/284792b-small-app-oauth-configuration.png" alt="MarineGEO circle logo"/>

3. Create a `.env` file at the root of your project directory and add environment variables you need for your project. Check out file `.env.example`:

```
# COMMON ENV

CLIENT_ID=<your_client_id>
CALLBACK_URL=<http://localhost:3000/oauth2/callback>

# CLIENT ENV

GEETEST_ENDPOINT=<https://captcha.skymavis.one/api/geetest/register>

# SERVER ENV

SERVER_PORT=8080
SSO_ENDPOINT=<https://api-gateway.skymavis.one>
API_KEY=<your_api_key>
CLIENT_SECRET=<your_client_secret>

# ELECTRON ENV

CALLBACK_DEEPLINK=mavis-sso://oauth2/callback
```

## How to run

1. Go to your favorite sample, install packages. Example:

```bash
cd client/oidc-nextjs-ropc
pnpm install
```

2. Finally, start your sample. Example:

```bash
pnpm dev
```
