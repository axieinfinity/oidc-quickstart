import { generateQueryString } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'

const API_KEY = process.env.API_KEY ?? ''
const CLIENT_ID = process.env.CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.CLIENT_SECRET ?? ''

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, MFAtoken } = req.body

  try {
    const resp = await fetch(
      'https://api-gateway.skymavis.one/account/oauth2/token',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'x-api-key': API_KEY,
        },
        body: generateQueryString({
          grant_type: 'mfa-otp',
          otp: code,
          mfa_token: MFAtoken,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
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
