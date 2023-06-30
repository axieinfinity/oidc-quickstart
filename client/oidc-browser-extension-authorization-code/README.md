# Single Sign-On (SSO) Implementation for Firefox/GoogleChrome extension

This guide will walk you through the process of implementing Single Sign-On (SSO) for your application. SSO allows users to log in once and gain access to multiple applications or services without the need to log in separately for each one.

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

### Run & Deploy

1. Create a `.env` file follows file `.env.example`:

```
# OIDC ENV
OIDC_CLIENT_ID=<your_client_id>
OIDC_CALLBACK_URL=http://localhost:3000/oauth2/callback
OIDC_SCOPE="openid offline"


# AUTHORIZATION ENDPOINT
OIDC_AUTHORIZATION_ENDPOINT=https://api-gateway.skymavis.com/oauth2/auth

# SERVER ENDPOINTS
SERVER_TOKEN_ENDPOINT=http://localhost:8080/oauth2/authorization-code/token
```

2. Run: `pnpm install`
3. Run: `pnpm dev:chrome`
4. Load extension:

  Load the extension in Chrome

- Open Chrome browser and navigate to chrome://extensions
- Select "Developer Mode" and then click "Load unpacked extension..."
- From the file browser, choose to extension/dev/chrome or > (extension/dev/chrome)

 Load the extension in Firefox

- Open Firefox browser and navigate to about:debugging
- Click "Load Temporary Add-on" and from the file browser, choose --> extension/dev/firefox

5. Add redirect uri

- Get uri: Right click on popup extension --> Inspect --> Console -->  Copy `SIGN IN REDIRECT URI` (Note: include '/')
- Access <https://developers.skymavis.com/console/account-service/>
- Add `SIGN IN REDIRECT URI`
