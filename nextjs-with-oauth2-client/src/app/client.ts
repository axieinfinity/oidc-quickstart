import {
  SkyMavisOAuth2Client,
  ClientSettings,
  extractQueryParams,
  generateCodeVerifier,
  OAuth2Error,
} from '../../../skymavis-oauth2-client/lib'

const settings: ClientSettings = {
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
}
export const client = new SkyMavisOAuth2Client(settings)

export { extractQueryParams, generateCodeVerifier, OAuth2Error }
