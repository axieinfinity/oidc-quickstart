---
title: "OAuth2 Client"
description: Use OAuth2 Client to quickly start and integrate with SkyMavis SSO.
slug: "oauth2-client"
createdAt: "2023-05-09T08:21:15Z"
updatedAt: "2023-05-09T08:21:49Z"
category: "643c016c038be2000b6d196a"
---

# Integrate OAuth2 Client

## Introduction

The OAuth2 Client provides a fast and convenient way for people to integrate with SkyMavis SSO.

- No dependencies.
- [x] `authorization code flow` grant with optional [PKCE][1] support.
- [ ] `implicit flow` directly grant token.
- [ ] `password` and `client_credentials` grant ()
- [ ] OAuth2 endpoint discovery via the Server metadata document ([RFC8414][2]).
- [ ] OAuth2 Token Introspection ([RFC7662][3]).

## Interface

```ts
type ClientSettings = {
  server: string;
  clientId: string;
  authorizeEndpoint?: string;
  tokenEndpoint?: string;
  clientSecret?: string;
};

type GetImplicitParams = {
  redirectUri: string;
  state?: string;
  nonce?: string;
  scope?: string[];
};

export type AuthorizationQueryParams = {
  response_type: "code";
  client_id: string;
  redirect_uri: string;
  state?: string;
  scope?: string;
  code_challenge_method?: "plain" | "S256";
  code_challenge?: string;
};
```

## Usages

Create OAuth2 Client:

```ts
import { OAuth2Client, type ClientSettings } from "oauth2-client";

const options: ClientSettings = {
  // The base URI of your OAuth2 server
  server: "https://my-auth-server/",

  // OAuth2 client id
  clientId: "...",

  // OAuth2 client secret. Only required for 'client_credentials', 'password'
  // flows. You should not specify this for authorization_code.
  clientSecret: "...",

  // Token endpoint. Most flows need this.
  // If not specified we'll use the information for the discovery document
  // first, and otherwise default to /oauth2/token
  tokenEndpoint: "/oauth2/token",

  // Authorization endpoint.
  //
  // You only need this to generate URLs for authorization_code flows.
  // If not specified we'll use the information for the discovery document
  // first, and otherwise default to /oauth2/auth
  authorizationEndpoint: "/oauth2/auth",
};
const client = new OAuth2Client(options);
```

### Authoriaztion Code Flow:

The `authorization_code` flow is the flow for browser-based applications,
and roughly consists of 3 major steps:

1. Redirect the user to an authorization endpoint, where they log in.
2. Authorization endpoint redirects back to app with a 'code' query
   parameter.
3. The `code` is exchanged for a access and refresh token.

This library provides support for these steps, but there's no requirement
to use its functionality as the system is mostly stateless.

```ts
document.location = await client.authorizationCode.getAuthorizeUri({
  // URL in the app that the user should get redirected to after authenticating
  redirectUri: "https://my-app.example/oauth2/callback",
  // Optional string that can be sent along to the auth server. This value will
  // be sent along with the redirect back to the app verbatim.
  state: "some-string",
});
```

**Handling the redirect back to the app and obtain token**

```ts
import { extractQueryParams } from "oauth2-client";

const { code, state } = extractQueryParams(String(document.location));

const oauth2Token = await client.authorizationCode.getToken({
  redirectUri: "https://my-app.example/",
  code,
  state,
});
```

Send request to server to get token

```typescript title="server"
server.post(
  "/oauth2/token",
  async (request: FastifyRequest<{ Body: ClientCredentials }>, reply) => {
    try {
      const nodeOAuth2Client = new OAuth2Client({
        server: "OAUTH_SERVER",
        clientId: "...",
        tokenEndpoint: "/oauth2/token",
        authorizationEndpoint: "/oauth2/auth",
      });

      const body = request.body;

      const query = {
        grant_type: "authorization_code",
        code: body.code,
        state: body.state,
        redirect_uri: body.redirect_uri,
        client_id: oauth2Client.settings.clientId,
        client_secret: oauth2Client.settings.clientSecret,
      };

      return client.authorizationCode.getToken(query);
    } catch (error) {
      console.error(error);
    }
  }
);
```
