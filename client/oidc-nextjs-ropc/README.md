# Implementation for Nextjs

Sample using Nextjs.

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

### Run & Deploy

1. Create a `.env` file. Check out file `.env.example`:

```
# SERVER ENDPOINT
SERVER_ROPC_TOKEN_ENDPOINT=http://localhost:8080/oauth2/ropc/token
SERVER_ROPC_MFA_ENDPOINT=http://localhost:8080/oauth2/ropc/mfa

# CAPTCHA ENV
GEETEST_ENDPOINT=https://captcha.skymavis.one/api/geetest/register
```

2. Run: `pnpm install`
3. Run: `pnpm dev`
