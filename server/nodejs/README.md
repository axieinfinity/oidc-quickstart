# Implementation for Node

Sample using Fastify.

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

### Run & Deploy

1. Create a `.env` file. Check out file `.env.example`:

```
## OIDC ENV
OIDC_CLIENT_ID=<your_client_id>
OIDC_CLIENT_SECRET=<your_client_secret>
OIDC_API_KEY=<your_api_key>
OIDC_SCOPE="openid offline"

# OIDC ENDPOINTS
OIDC_TOKEN_ENDPOINT=https://api-gateway.skymavis.one/account/oauth2/token
OIDC_USERINFO_ENDPOINT=https://api-gateway.skymavis.one/account/userinfo
```

2. Run: `pnpm install`
3. Run: `pnpm dev`

```
POST /oauth2/authorization-code/token
Host: http://localhost:8080
Content-Type: application/json

{
  code: <your_code>,
  redirect_uri: <your_callback_url>
}
```

```
POST /oauth2/authorization-code/refresh_token
Host: http://localhost:8080
Content-Type: application/json

{
  refresh_token: <your_refresh_token>
}
```

```
POST /oauth2/ropc/token
Host: http://localhost:8080
Content-Type: application/json

{
  email: <your_email>,
  password: <your_password>,
  captcha: <your_captcha>
}
```

```
POST /oauth2/ropc/mfa
Host: http://localhost:8080
Content-Type: application/json

{
  code: <your_code>,
  MFAtoken: <your_MFAtoken>
}
```

```
POST /oauth2/ropc/ronin/token
Host: http://localhost:8080
Content-Type: application/json

{
  message: <your_message>,
  signature: <your_signature>
}
```

```
POST /oauth2/ronin/fetch-nonce
Host: http://localhost:8080
Content-Type: application/x-www-form-urlencoded

address=<your_address>
```

```
GET /oauth2/userinfo
Host: http://localhost:8080
Content-Type: application/json
Authorization: Bearer <your_access_token>
```
