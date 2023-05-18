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

  //[default = 'https://athena.skymavis.com']
  server?: string;
  //[default = '/oauth2/oauth']
  authorizationEndpoint?: string;
  //[default = '/oauth2/token']
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

```ts
import { extractQueryParams } from "oauth2-client";

const { code, state } = extractQueryParams(String(document.location));
// Exchange token
const oauth2Token = await client.authorizationCode.getToken({
  redirectUri: "https://my-app.example/",
  code,
  state,
});
```
