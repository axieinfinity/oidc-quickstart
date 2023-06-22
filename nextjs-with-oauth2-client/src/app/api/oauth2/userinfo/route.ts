import { client, OAuth2Error } from '@/app/client'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.headers.get('access-token') as string
    const resp = await client.account.getUserInfo({
      apiKey: process.env.API_KEY as string,
      accessToken,
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
