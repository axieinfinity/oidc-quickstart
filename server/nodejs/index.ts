require('dotenv').config()
import Fastify, { FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import axios, { AxiosError, isAxiosError } from 'axios'

const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8080
const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID ?? ''
const API_KEY = process.env.API_KEY ?? ''
const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET ?? ''
const OIDC_SCOPE = process.env.OIDC_SCOPE ?? 'openid offline'

const OIDC_TOKEN_ENDPOINT =
  process.env.OIDC_TOKEN_ENDPOINT ??
  'https://api-gateway.skymavis.com/account/oauth2/token'
const OIDC_USERINFO_ENDPOINT =
  process.env.OIDC_USERINFO_ENDPOINT ??
  'https://api-gateway.skymavis.com/account/userinfo'
const OIDC_FETCH_NONCE_ENDPOINT =
  process.env.OIDC_FETCH_NONCE_ENDPOINT ??
  'https://athena.skymavis.com/v2/public/auth/ronin/fetch-nonce'

const app = Fastify()

app.register(cors, {
  methods: ['GET', 'PUT', 'POST'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.setErrorHandler(function (error, _, res) {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError
    const errorStatus = axiosError.response?.status
    const errorData = axiosError.response?.data
    return res.status(errorStatus ?? 400).send(errorData)
  }

  return res.status(400).send('Something went wrong.')
})

app.get('/ping', () => {
  return 'pong'
})

/* -------------------------------------------- */
/*              Authorization Code              */
/* -------------------------------------------- */

/* -------------- Exchange Token -------------- */
app.post(
  '/oauth2/authorization-code/token',
  async (
    req: FastifyRequest<{
      Body: {
        code: string
        redirect_uri: string
        code_verifier?: string
        authorization_method?: 'client_secret_basic' | 'client_secret_post'
      }
    }>,
  ) => {
    const { code, redirect_uri, code_verifier, authorization_method } = req.body

    const headers: Record<string, string> = {
      'content-type': 'application/x-www-form-urlencoded',
      'x-api-key': API_KEY,
    }

    const body: Record<string, string> = {
      code,
      redirect_uri,
      grant_type: 'authorization_code',
    }

    switch (authorization_method) {
      case 'client_secret_basic':
        headers.Authorization = `Basic ${btoa(
          `${OIDC_CLIENT_ID}:${OIDC_CLIENT_SECRET}`,
        )}`
        headers.token_endpoint_auth_method = authorization_method
        break
      default:
        body.client_id = OIDC_CLIENT_ID
        body.client_secret = OIDC_CLIENT_SECRET
    }

    if (code_verifier) {
      body.code_verifier = code_verifier
    }

    const { data } = await axios({
      url: OIDC_TOKEN_ENDPOINT,
      method: 'POST',
      headers,
      data: body,
    })

    return data
  },
)

/* -------------- Refresh Token -------------- */

app.post(
  '/oauth2/authorization-code/refresh_token',
  async (
    req: FastifyRequest<{
      Body: { refresh_token: string; authorization_method?: string }
    }>,
  ) => {
    const { refresh_token, authorization_method } = req.body

    const headers: Record<string, string> = {
      'content-type': 'application/x-www-form-urlencoded',
      'x-api-key': API_KEY,
    }

    const body: Record<string, string> = {
      refresh_token,
      grant_type: 'refresh_token',
    }

    switch (authorization_method) {
      case 'client_secret_basic':
        headers.Authorization = `Basic ${btoa(
          `${OIDC_CLIENT_ID}:${OIDC_CLIENT_SECRET}`,
        )}`
        headers.token_endpoint_auth_method = authorization_method
        break
      default:
        body.client_id = OIDC_CLIENT_ID
        body.client_secret = OIDC_CLIENT_SECRET
    }

    const { data } = await axios({
      url: OIDC_TOKEN_ENDPOINT,
      method: 'POST',
      headers,
      data: body,
    })

    return data
  },
)

/* -------------------------------------------- */
/*      RESOURCE OWNER PASSWORD CREDENTIALS     */
/* -------------------------------------------- */

/* -------------- Exchange Token -------------- */
app.post(
  '/oauth2/ropc/token',
  async (
    req: FastifyRequest<{
      Body: {
        email: string
        password: string
        captcha: {
          geetest_challenge: string
          geetest_validate: string
          geetest_seccode: string
        }
      }
    }>,
  ) => {
    const { email: username, password, captcha } = req.body

    const { data } = await axios({
      url: OIDC_TOKEN_ENDPOINT,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-api-key': API_KEY,
        'x-captcha': JSON.stringify(captcha),
      },
      data: {
        username,
        password,
        client_id: OIDC_CLIENT_ID,
        client_secret: OIDC_CLIENT_SECRET,
        scope: OIDC_SCOPE,
        grant_type: 'password',
      },
    })

    return data
  },
)

/* -------- Multi-factor Authentication ------- */
app.post(
  '/oauth2/ropc/mfa',
  async (
    req: FastifyRequest<{
      Body: { code: string; MFAtoken: string }
    }>,
  ) => {
    const { code, MFAtoken } = req.body

    const { data } = await axios({
      url: OIDC_TOKEN_ENDPOINT,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-api-key': API_KEY,
      },
      data: {
        grant_type: 'mfa-otp',
        otp: code,
        mfa_token: MFAtoken,
        client_id: OIDC_CLIENT_ID,
        client_secret: OIDC_CLIENT_SECRET,
      },
    })

    return data
  },
)

/* ---------- Ronin - Exchange Token ---------- */
app.post(
  '/oauth2/ronin/token',
  async (
    req: FastifyRequest<{
      Body: {
        message: string
        signature: string
      }
    }>,
  ) => {
    const { message, signature } = req.body

    const { data } = await axios({
      url: OIDC_TOKEN_ENDPOINT,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-api-key': API_KEY,
      },
      data: {
        message,
        signature,
        client_id: OIDC_CLIENT_ID,
        client_secret: OIDC_CLIENT_SECRET,
        scope: OIDC_SCOPE,
        grant_type: 'ronin',
      },
    })

    return data
  },
)

/* ------------- Link Ronin wallet ------------ */
app.post(
  '/oauth2/ronin/link-wallet',
  async (
    req: FastifyRequest<{
      Body: {
        message: string
        signature: string
        access_token: string
      }
    }>,
  ) => {
    const { message, signature, access_token } = req.body

    const { data } = await axios({
      url: OIDC_TOKEN_ENDPOINT,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-api-key': API_KEY,
      },
      data: {
        message,
        signature,
        access_token,
        grant_type: 'link-wallet',
        scope: OIDC_SCOPE,
        client_id: OIDC_CLIENT_ID,
        client_secret: OIDC_CLIENT_SECRET,
      },
    })

    return data
  },
)

/* -------------------------------------------- */
/*                    OTHERS                    */
/* -------------------------------------------- */

/* ------------ Ronin - Fetch Nonce ----------- */
app.get(
  '/oauth2/ronin/fetch-nonce',
  async (
    req: FastifyRequest<{
      Querystring: { address: string }
    }>,
  ) => {
    const { address } = req.query

    const { data } = await axios({
      url: OIDC_FETCH_NONCE_ENDPOINT,
      params: {
        address,
      },
    })

    return data
  },
)

/* ----------- Get User Information ----------- */
app.get('/oauth2/userinfo', async req => {
  const bearerToken = req.headers['authorization']
  const headers: Record<string, string> = {
    'x-api-key': API_KEY,
    authorization: `${bearerToken}`,
  }
  const { data } = await axios({
    url: OIDC_USERINFO_ENDPOINT,
    method: 'GET',
    headers,
  })

  return data
})

/* -------------------------------------------- */
const run = async () => {
  process.on('unhandledRejection', err => {
    console.error(err)
    process.exit(1)
  })

  app.listen({ port: PORT }, () => {
    console.log('Server is listening on', PORT)
  })
}

run()
