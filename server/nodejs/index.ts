require('dotenv').config({ path: '../../.env' })
import Fastify, { FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import axios, { AxiosError, isAxiosError } from 'axios'

type GeetestCaptcha = {
  geetest_challenge: string
  geetest_validate: string
  geetest_seccode: string
}

const PORT = Number(process.env.SERVER_PORT) || 8080
const SSO_ENDPOINT =
  process.env.SSO_ENDPOINT || 'https://api-gateway.skymavis.one'
const CLIENT_ID = process.env.CLIENT_ID
const API_KEY = process.env.API_KEY
const CLIENT_SECRET = process.env.CLIENT_SECRET

const app = Fastify()

app.register(cors, {
  methods: ['GET', 'PUT', 'POST'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.get('/ping', async () => {
  return 'pong\n'
})

app.post(
  '/oauth2/ropc/token',
  async (
    req: FastifyRequest<{
      Body: { email: string; password: string; captcha: GeetestCaptcha }
    }>,
    res,
  ) => {
    const { email: username, password, captcha } = req.body

    try {
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
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError
        const errorStatus = axiosError.response?.status
        const errorData = axiosError.response?.data
        return res.status(errorStatus ?? 400).send(errorData)
      }

      return res.status(400).send('Something went wrong.')
    }
  },
)

// app.post(
//   '/oauth2/authorization-code/token',
//   async (request: FastifyRequest<{ Body: ClientCredentials }>, reply) => {
//     try {
//       const body = request.body || {}

//       if (!body.code) {
//         throw new Error('Missing code')
//       }

//       body.redirectUri ||= process.env.CALLBACK_URL

//       const params = {
//         ...body,
//         clientSecret: process.env.CLIENT_SECRET,
//         apiKey: process.env.API_KEY,
//       } as GetTokenParams

//       return client.authorizationCode.getToken(params)
//     } catch (error) {
//       console.error(error)
//     }
//   },
// )

// app.get('/oauth2/userinfo', async (request, reply) => {
//   try {
//     const accessToken = request.headers['authorization'] as string
//     const user = await client.account.getUserInfo({
//       accessToken,
//       apiKey: process.env.API_KEY as string,
//     })
//     return user
//   } catch (error) {
//     console.error(error)
//   }
// })

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
