import { OAuth2Account } from './account'
import { AuthorizationCode } from './authorize-code'
import { OAuth2Error } from './error'
import { ImplicitToken } from './implicit-token'
export type Scope = 'openid' | 'offline'
export type ClientSettings = {
  clientId: string
  server?: string
  authorizationEndpoint?: string
  tokenEndpoint?: string
  fetch?: typeof fetch
}
export type OAuth2Endpoint =
  | 'tokenEndpoint'
  | 'authorizationEndpoint'
  | 'userinfo'
export declare const generateQueryString: (
  params: Record<string, any>,
) => string
export declare class SkyMavisOAuth2Client {
  settings: ClientSettings
  constructor(settings: ClientSettings)
  get authorizationCode(): AuthorizationCode
  get implicitToken(): ImplicitToken
  get account(): OAuth2Account
  handleErrorResponse(response: Response): Promise<OAuth2Error>
  getEndpoint(endpoint: OAuth2Endpoint): string
}
