export const SSO_AUTHORIZATION_ENDPOINT =
  process.env.SSO_AUTHORIZATION_ENDPOINT ??
  'https://api-gateway.skymavis.one/oauth2/auth'
export const SERVER_TOKEN_ENDPOINT =
  process.env.SERVER_TOKEN_ENDPOINT ??
  'http://localhost:8080/oauth2/authorization-code/token'
export const CLIENT_ID =
  process.env.CLIENT_ID ?? 'f437dc2a-8b02-44ef-a8ac-273e701c6996'
