# Implementation for Node

Sample using Fastify.

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

### Run & Deploy

1. Run: `pnpm install`
2. Run: `pnpm dev`

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
