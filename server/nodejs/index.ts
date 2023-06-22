require('dotenv').config({ path: '../../.env' })
import Fastify from 'fastify'
import formbody from '@fastify/formbody'
import cors from '@fastify/cors'

const PORT = Number(process.env.PORT) || 8080
const app = Fastify()

app.register(formbody)

app.register(cors, {
  methods: ['GET', 'PUT', 'POST'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.get('/ping', async () => {
  return 'pong\n'
})

// app.post(
//   '/oauth2/token',
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
