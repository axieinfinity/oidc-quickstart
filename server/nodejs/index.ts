require('dotenv').config({ path: '../../.env' })
import Fastify, { FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import axios, { AxiosError, isAxiosError } from 'axios'

const PORT = Number(process.env.SERVER_PORT) ?? 8080
const CLIENT_ID = process.env.CLIENT_ID ?? ''
const API_KEY = process.env.API_KEY ?? ''
const CLIENT_SECRET = process.env.CLIENT_SECRET ?? ''
const SSO_ENDPOINT =
  process.env.SSO_ENDPOINT ?? 'https://api-gateway.skymavis.one'

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
        headers.Authorization = `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        headers.token_endpoint_auth_method = authorization_method
        break
      default:
        body.client_id = CLIENT_ID
        body.client_secret = CLIENT_SECRET
    }

    if (code_verifier) {
      body.code_verifier = code_verifier
    }

    const { data } = await axios({
      baseURL: SSO_ENDPOINT,
      url: `/account/oauth2/token`,
      method: 'POST',
      headers,
      data: body,
    })

    return {
      data,
    }
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
      baseURL: SSO_ENDPOINT,
      url: 'account/oauth2/token',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-api-key': API_KEY,
        'x-captcha': JSON.stringify(captcha),
      },
      data: {
        username,
        password,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'password',
        scope: 'openid offline',
      },
    })

    return {
      token: data,
    }
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
      baseURL: SSO_ENDPOINT,
      url: 'account/oauth2/token',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-api-key': API_KEY,
      },
      data: {
        grant_type: 'mfa-otp',
        otp: code,
        mfa_token: MFAtoken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    })

    return {
      token: data,
    }
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
      baseURL: SSO_ENDPOINT,
      url: `/account/oauth2/token`,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-api-key': API_KEY,
      },
      data: {
        message,
        signature,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'ronin',
        scope: 'openid offline',
      },
    })

    return {
      token: data,
    }
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
      baseURL: 'https://athena.skymavis.one/',
      url: 'v2/public/auth/ronin/fetch-nonce',
      params: {
        address,
      },
    })

    return data
  },
)

/* ----------- Get User Information ----------- */
app.get('/oauth2/userinfo', async req => {
  const accessToken = req.headers['authorization']

  const headers: Record<string, string> = {
    'content-type': 'application/x-www-form-urlencoded',
    'x-api-key': API_KEY,
    authorization: `Bearer ${accessToken}`,
  }
  const { data } = await axios({
    baseURL: SSO_ENDPOINT,
    url: `account/userinfo`,
    method: 'GET',
    headers,
  })

  return {
    data,
  }
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
