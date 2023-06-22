import { OAuth2Account } from './account'
import { AuthorizationCode } from './authorize-code'
import { OAuth2Error } from './error'
import { resolveUrl } from './helpers'
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

const SSO_SERVER = 'https://api-gateway.skymavis.com'

export const generateQueryString = (params: Record<string, any>) => {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter((_k, v) => v !== undefined),
    ),
  ).toString()
}

export class SkyMavisOAuth2Client {
  settings: ClientSettings
  constructor(settings: ClientSettings) {
    this.settings = settings
    this.settings.server ||= SSO_SERVER
    this.settings.fetch ||= (...args) => globalThis.fetch(...args)
  }

  get authorizationCode(): AuthorizationCode {
    return new AuthorizationCode(this)
  }

  get implicitToken(): ImplicitToken {
    return new ImplicitToken(this)
  }
  get account(): OAuth2Account {
    return new OAuth2Account(this)
  }

  async handleErrorResponse(response: Response): Promise<OAuth2Error> {
    let jsonError: any
    let errorDescription = 'Unknown Error'
    let error = 'Bad Request'

    if (
      response.headers.has('Content-Type') &&
      response.headers.get('Content-Type')!.startsWith('application/json')
    ) {
      jsonError = await response.json()
    }
    if (typeof jsonError?.error === 'string') {
      error = jsonError.error
    }
    if (typeof jsonError?.error_description === 'string') {
      errorDescription = jsonError.error_description
    }
    if (response.status === 401) {
      errorDescription = jsonError.message || 'Invalid authenticate credentials'
      error = 'UnAuthorize'
    }

    return new OAuth2Error(error, errorDescription, response.status)
  }

  getEndpoint(endpoint: OAuth2Endpoint): string {
    if (this.settings[endpoint]) {
      return resolveUrl(String(this.settings[endpoint]), this.settings.server)
    }
    switch (endpoint) {
      case 'tokenEndpoint':
        return resolveUrl('/account/oauth2/token', this.settings.server)

      case 'userinfo': {
        return resolveUrl('/account/userinfo', this.settings.server)
      }
      case 'authorizationEndpoint': {
        return resolveUrl('/oauth2/auth', this.settings.server)
      }
    }
  }
}
