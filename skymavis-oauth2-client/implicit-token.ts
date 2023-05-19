import { AuthorizationQueryParams } from "./authorize-code";
import { SkyMavisOAuth2Client, generateQueryString } from "./client";

export type GetImplicitParams = {
  redirectUri: string;
  state?: string;
  nonce?: string;
  scope?: string[];
};

export type ImplicitQueryParams = {
  nonce: string;
  response_type: "token" | "id_token" | "token id_token";
} & Omit<AuthorizationQueryParams, "response_type">;

export class ImplicitToken {
  constructor(private readonly client: SkyMavisOAuth2Client) {}

  async getImplicitUri(params: GetImplicitParams): Promise<string> {
    const query: ImplicitQueryParams = {
      client_id: this.client.settings.clientId,
      response_type: "token",
      redirect_uri: params.redirectUri,
      state: crypto.randomUUID(),
      nonce: crypto.randomUUID(),
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
}
