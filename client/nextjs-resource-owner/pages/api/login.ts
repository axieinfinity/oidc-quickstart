import { generateQueryString } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'

const API_KEY = process.env.API_KEY ?? ''
const CLIENT_ID = process.env.CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.CLIENT_SECRET ?? ''

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email: username, password, captcha } = req.body

  try {
    const resp = await fetch(
      'https://api-gateway.skymavis.one/account/oauth2/token',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'x-api-key': API_KEY,
          'x-captcha': JSON.stringify(captcha),
        },
        body: generateQueryString({
          username,
          password,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'password',
          scope: 'openid offline',
        }),
      },
    )

    if (!resp.ok) {
      const error = await resp.clone().json()
      return res.status(resp.status).json(error)
    }

    const token = await resp.clone().json()
    return res.status(resp.status).json({
      token,
    })
  } catch {
    return res.status(400).json('Something went wrong.')
  }
}

export default handler
