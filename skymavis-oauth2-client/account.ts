import { SkyMavisOAuth2Client } from "./client";

export class OAuth2Account {
  constructor(private readonly client: SkyMavisOAuth2Client) {}

  getUserInfo = async (params: {
    accessToken: string;
    apiKey: string;
  }): Promise<UserResponse> => {
    const resp = await this.client.settings.fetch?.(
      this.client.getEndpoint("userinfo"),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${params.accessToken}`,
          "X-API-KEY": params.apiKey,
        },
      }
    );
    if (resp && resp.ok) {
      return await resp.json();
    }
    throw await this.client.handleErrorResponse(resp!);
  };
}
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
