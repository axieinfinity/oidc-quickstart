# OAuth2 Client

## Introduction

The OAuth2 Client provides a fast and convenient way for people to integrate with SkyMavis SSO.
The SDK is written in Javascript, design with no dependencies, able to use on all Javascript Frameworks

## How it works

Sky Mavis OAuth2 Client expose methods implement the SSO Flow.

- [x] `Authorization Code Flow` grant with optional PKCE support.
- [ ] `Implicit Flow` directly grant token.
- [ ] `password` and `client_credentials` grant

## Usages

Instantiate the SkyMavisOAuth2Client:

```ts
export type Scope = "openid" | "offline";
export type ClientSettings = {
  clientId: string;
  clientSecret?: string;

  //[default = 'https://api-gateway.skymavis.com']
  server?: string;
  //[default = '/oauth2/oauth']
  authorizationEndpoint?: string;
  //[default = '/account/oauth2/token']
  tokenEndpoint?: string;
};

const client: ClientSettings = {
  clientId: "your_client_id",
};
```

### Authorization Code Flow

The `authorization_code` flow is the flow for browser-based applications,
and roughly consists of 3 major steps:

1. Redirect the user to an authorization endpoint, where they log in.
2. Authorization endpoint redirects back to app with a 'code' query
   parameter.
3. The `code` is exchanged for a access and refresh token.

This library provides support for these steps, but there's no requirement
to use its functionality as the system is mostly stateless.

#### 1. Request authorization code:

This library provides support for these steps, but there's no requirement
to use its functionality as the system is mostly stateless.

```ts

export type GetAuthorizeUriParams = {
  redirectUri: string;
  state?: string;
  codeVerifier?: string;
  scope?: string[];
};

const getAuthorizeParams={
  redirectUri: "https://my-app.example/oauth2/callback",
  state: "some-string",
} satisfies GetAuthorizeUriParams;

// Redirect to SSO Server
document.location = await client.authorizationCode.getAuthorizeUri(getAuthorizaParams);

```

#### 2. Handle authorization callback and exchange token:

_Interface_

```ts
export type AuthenticateMethod = "client_secret_basic" | "client_secret_post";

export type GetTokenParams = {
  code: string;
  apiKey: string;
  redirectUri: string;
  clientSecret: string;
  authorizeMethod?: AuthenticateMethod;
  codeVerifier?: string;
};

export type TokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};
```

```ts
import { extractQueryParams, GetTokenParams } from "oauth2-client";

const { code, state } = extractQueryParams(String(document.location));

const getTokenParams: GetTokenParams = {
  redirectUri: "https://my-app.example/",
  code: "authorize code",
  clientSecret: "client secret",
  codeVerifier: "codeVerifier",
  apiKey: "API_KEY",
};
// Exchange token
const oauth2Token: TokenResponse = await client.authorizationCode.getToken(
  getTokenParams
);
```

### Implicit Flow

Implicit Flow is a simplified authentication flow used in OAuth 2.0 and OpenID Connect protocols.
The Implicit Flow allows these applications to obtain access tokens and identity information directly from the authorization server, without involving a backend server or using client secrets.

_Interface_

```ts
export type GetImplicitParams = {
  redirectUri: string;
  state?: string;
  nonce?: string;
  scope?: string[];
};
```

```ts
const url = await client.implicitToken.getImplicitTokenUri({
  redirectUri: "https://my-app.example/oauth2/callback",
  nonce: "some-thing",
});
location.href = url;
```

⚠️⚠️⚠️ It's important to note that the Implicit Flow does not involve a separate token endpoint for token exchange, unlike other flows such as Authorization Code Flow with PKCE (Proof Key for Code Exchange).
The access token is directly included in the response from the authorization server,
making it accessible to the client-side JavaScript code.

### Get OAuth2 UserInfo

_Interface_

```ts
export type UserResponse = {
  addr: string;
  aud: string[];
  auth_time: number;
  email: string;
  iat: number;
  iss: string;
  name: string;
  rat: number;
  redirect_uri: string;
  roninAddress: string;
  status: string;
  sub: string;
  walletConnect?: string;
};
```

```ts
const resp: OAuthUser = await client.account.getUserInfo({
  apiKey: process.env.API_KEY as string,
  // access_token archive from client.authorizationCode.getToken(...)
  accessToken,
});
```
