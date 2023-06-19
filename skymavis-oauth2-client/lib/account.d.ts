import { SkyMavisOAuth2Client } from './client'
export declare class OAuth2Account {
  private readonly client
  constructor(client: SkyMavisOAuth2Client)
  getUserInfo(params: {
    accessToken: string
    apiKey: string
  }): Promise<UserResponse>
}
export type UserResponse = {
  addr: string
  aud: string[]
  auth_time: number
  email: string
  iat: number
  iss: string
  name: string
  rat: number
  redirect_uri: string
  roninAddress: string
  status: string
  sub: string
  walletConnect?: string
}
