# Implementation for Node

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

### Run & Deploy

#### 1. Create a `.env` file follows file `.env.example`:

```shell
# OIDC ENV
OIDC_CLIENT_ID=<your_client_id>
OIDC_CLIENT_SECRET=<your_client_secret>
API_KEY=<your_api_key>
OIDC_SCOPE="openid offline"

# OIDC ENDPOINTS
OIDC_TOKEN_ENDPOINT=https://api-gateway.skymavis.com/account/oauth2/token
OIDC_USERINFO_ENDPOINT=https://api-gateway.skymavis.com/account/userinfo
```

#### 2. Run server: 
```shell
pnpm install && pnpm dev
```
#### 3. APIs
##### APIs for authenticating with authorization code flow

```http
POST /oauth2/authorization-code/token
Host: http://localhost:8080
Content-Type: application/json

{
  code: <your_code>,
  redirect_uri: <your_callback_url>
}
```

```http
POST /oauth2/authorization-code/refresh_token
Host: http://localhost:8080
Content-Type: application/json

{
  refresh_token: <your_refresh_token>
}
```

##### APIs for authenticating with ROPC flow
```http
POST /oauth2/ropc/token
Host: http://localhost:8080
Content-Type: application/json

{
  email: <your_email>,
  password: <your_password>,
  captcha: <your_captcha>
}
```

```http
POST /oauth2/ropc/mfa
Host: http://localhost:8080
Content-Type: application/json

{
  code: <your_code>,
  MFAtoken: <your_MFAtoken>
}
```

```http
POST /oauth2/ropc/ronin/token
Host: http://localhost:8080
Content-Type: application/json

{
  message: <your_message>,
  signature: <your_signature>
}
```

```http
POST /oauth2/ronin/fetch-nonce
Host: http://localhost:8080
Content-Type: application/x-www-form-urlencoded

address=<your_address>
```

##### API to get user info
```http
GET /oauth2/userinfo
Host: http://localhost:8080
Content-Type: application/json
Authorization: Bearer <your_access_token>
```
