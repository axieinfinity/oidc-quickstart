import { SkyMavisOAuth2Client, generateQueryString } from './client'
import { getCodeChallenge, getWebCrypto } from './helpers'

export class AuthorizationCode {
  constructor(private readonly client: SkyMavisOAuth2Client) {}

  async getAuthorizeUri(params: GetAuthorizeUriParams): Promise<string> {
    const webCrypto = getWebCrypto()

    const query: AuthorizationQueryParams = {
      client_id: this.client.settings.clientId,
      response_type: 'code',
      redirect_uri: params.redirectUri,
      state: webCrypto.randomUUID(),
    }

    if (params.codeVerifier) {
      const [algorithm, codeChallange] = await getCodeChallenge(
        params.codeVerifier,
      )
      query.code_challenge_method = algorithm
      query.code_challenge = codeChallange
    }

    if (params.state) {
      query.state = params.state
    }
    if (params.scope) {
      query.scope = params.scope.join(' ')
    }

    return `${this.client.getEndpoint(
      'authorizationEndpoint',
    )}?${generateQueryString(query)}`
  }

  async getToken(params: GetTokenParams): Promise<TokenResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-API-KEY': params.apiKey,
    }

    const query = {
      grant_type: 'authorization_code',
      code: params.code,
      redirect_uri: params.redirectUri,
    } as Record<string, string>

    if (params.codeVerifier) {
      query.code_verifier = params.codeVerifier
    }

    if (params?.authorizeMethod === 'client_secret_basic') {
      headers.Authorization = `Basic ${btoa(
        `${this.client.settings.clientId}:${params.clientSecret}`,
      )}`
      query.token_endpoint_auth_method = 'client_secret_basic'
    } else {
      query.client_id = this.client.settings.clientId
      query.client_secret = params.clientSecret || ''
    }

    const resp = await this.client.settings.fetch?.(
      this.client.getEndpoint('tokenEndpoint'),
      {
        method: 'POST',
        body: generateQueryString(query),
        headers,
      },
    )
    if (!resp) {
      throw new Error('Cannot parse the response from server')
    }
    if (resp.ok) {
      return (await resp.json()) as TokenResponse
    }

    throw await this.client.handleErrorResponse(resp)
  }
}

export type GetAuthorizeUriParams = {
  redirectUri: string
  state?: string
  codeVerifier?: string
  scope?: string[]
}
export type AuthenticateMethod = 'client_secret_basic' | 'client_secret_post'

export type TokenResponse = {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
}

export type GetTokenParams = {
  code: string
  apiKey: string
  redirectUri: string
  clientSecret: string
  authorizeMethod?: AuthenticateMethod
  codeVerifier?: string
}

export type AuthorizationQueryParams = {
  response_type: 'code'
  client_id: string
  redirect_uri: string
  state?: string
  scope?: string
  code_challenge_method?: 'plain' | 'S256'
  code_challenge?: string
}
