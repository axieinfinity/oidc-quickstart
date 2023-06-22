import { client, OAuth2Error } from '@/app/client'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  const body = await req.json()
  try {
    const resp = await client.authorizationCode.getToken({
      code: body.code,
      codeVerifier: body.codeVerifier,
      redirectUri: process.env.CALLBACK_URL as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      apiKey: process.env.API_KEY as string,
    })
    return NextResponse.json({
      success: true,
      data: resp,
    })
  } catch (ex) {
    if (ex instanceof OAuth2Error) {
      return NextResponse.json({
        success: false,
        error: {
          error: ex.error,
          error_description: ex.error_description,
          http_status: ex.http_status,
        },
      })
    }
  }
}
