import { AuthorizationQueryParams } from './authorize-code'
import { SkyMavisOAuth2Client } from './client'
export type GetImplicitParams = {
  redirectUri: string
  state?: string
  nonce?: string
  scope?: string[]
}
export type ImplicitQueryParams = {
  nonce: string
  response_type: 'token' | 'id_token' | 'token id_token'
} & Omit<AuthorizationQueryParams, 'response_type'>
export declare class ImplicitToken {
  private readonly client
  constructor(client: SkyMavisOAuth2Client)
  getImplicitUri(params: GetImplicitParams): Promise<string>
}
