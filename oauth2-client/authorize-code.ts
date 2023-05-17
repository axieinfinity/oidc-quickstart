import { OAuth2Client, generateQueryString } from "./client";
import { getCodeChallenge, getWebCrypto } from "./helpers";

export type ClientSettings = {
  server: string;
  clientId: string;
  authorizeEndpoint?: string;
  tokenEndpoint?: string;
  clientSecret?: string;
};

export type GetAuthorizeParams = {
  redirectUri: string;
  state?: string;
  codeVerifier?: string;
  scope?: string[];
};
export type GetImplicitParams = {
  redirectUri: string;
  state?: string;
  nonce?: string;
  scope?: string[];
};
export type GetTokenParams = {
  code: string;
  redirect_uri: string;
  code_verifier?: string;
  state?: string;
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
export type ImplicitQueryParams = {
  nonce: string;
  response_type: "token" | "id_token" | "id_token token";
} & Omit<AuthorizationQueryParams, "response_type">;

export class AuthorizationCode {
  constructor(private readonly client: OAuth2Client) {}

  async getImplicitUri(params: GetImplicitParams): Promise<string> {
    const webCrypto = getWebCrypto();
    const query: ImplicitQueryParams = {
      client_id: this.client.settings.clientId,
      response_type: "id_token",
      redirect_uri: params.redirectUri,
      state: webCrypto.randomUUID(),
      nonce: webCrypto.randomUUID(),
    };
    if (params.state) {
      query.state = params.state;
    }
    if (params.scope) {
      query.scope = params.scope.join(" ");
    }
    if (params.nonce) {
      query.scope = params.nonce;
    }

    return `${this.client.getEndpoint(
      "authorizationEndpoint"
    )}?${generateQueryString(query)}`;
  }

  async getAuthorizeUri(params: GetAuthorizeParams): Promise<string> {
    const webCrypto = getWebCrypto();
    const codeChallenge = params.codeVerifier
      ? await getCodeChallenge(params.codeVerifier)
      : undefined;

    const query: AuthorizationQueryParams = {
      client_id: this.client.settings.clientId,
      response_type: "code",
      redirect_uri: params.redirectUri,
      code_challenge_method: codeChallenge?.[0],
      code_challenge: codeChallenge?.[1],
      state: webCrypto.randomUUID(),
    };
    if (params.state) {
      query.state = params.state;
    }
    if (params.scope) {
      query.scope = params.scope.join(" ");
    }

    return `${this.client.getEndpoint(
      "authorizationEndpoint"
    )}?${generateQueryString(query)}`;
  }

  async getToken(params: Record<string, any>): Promise<string>;
  async getToken(params: GetTokenParams) {
    const query = {
      client_id: this.client.settings.clientId,
      ...params,
    };
    const url = `${this.client.getEndpoint(
      "tokenEndpoint"
    )}?${generateQueryString(query)}`;

    const data = await this.client.settings
      .fetch?.(url, {
        method: "POST",
        body: generateQueryString(query),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return resp;
      });

    return data;
  }
}
