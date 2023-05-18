import { AuthorizationCode } from "./authorize-code";
import { resolveUrl } from "./helpers";
import { ImplicitToken } from "./implicit-token";

export type Scope = "openid" | "offline";

export type ClientSettings = {
  server: string;
  clientId: string;
  clientSecret?: string;
  authorizationEndpoint: string;
  tokenEndpoint?: string;
  fetch?: typeof fetch;
};

export type OAuth2Endpoint = "tokenEndpoint" | "authorizationEndpoint";

const SSO_SERVER = "https://athena.skymavis.com";

export const generateQueryString = (params: Record<string, any>) => {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter((_k, v) => v !== undefined)
    )
  ).toString();
};

export class SkyMavisOAuth2Client {
  settings: ClientSettings;
  constructor(settings: ClientSettings) {
    this.settings = settings;
    this.settings.server ||= SSO_SERVER;
    this.settings.fetch ||= (...args) => globalThis.fetch(...args);
  }

  get authorizationCode(): AuthorizationCode {
    return new AuthorizationCode(this);
  }

  get implicitToken(): ImplicitToken {
    return new ImplicitToken(this);
  }

  getEndpoint(endpoint: OAuth2Endpoint): string {
    if (this.settings[endpoint]) {
      return resolveUrl(String(this.settings[endpoint]), this.settings.server);
    }
    switch (endpoint) {
      case "tokenEndpoint":
        return resolveUrl("/oauth2/token", this.settings.server);

      case "authorizationEndpoint": {
        return resolveUrl("/oauth2/auth", this.settings.server);
      }
    }
  }
}
