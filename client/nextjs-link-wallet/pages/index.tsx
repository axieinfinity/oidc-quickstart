import { randomUUID } from '@/utils'
import { Button, Space } from 'antd'
import { useRouter } from 'next/router'

const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID ?? ''
const OIDC_AUTHORIZATION_ENDPOINT =
  process.env.OIDC_AUTHORIZATION_ENDPOINT ??
  'https://api-gateway.skymavis.com/oauth2/auth'
const OIDC_CALLBACK_URL =
  process.env.OIDC_CALLBACK_URL ?? 'http://localhost:3000/oauth2/callback'
const OIDC_SCOPE = process.env.OIDC_SCOPE ?? 'openid offline'

export default function Home() {
  const router = useRouter()

  const requestLogin = (configs?: Record<string, string>) => {
    const query = new URLSearchParams({
      response_type: 'code',
      state: randomUUID(),
      client_id: OIDC_CLIENT_ID,
      redirect_uri: OIDC_CALLBACK_URL,
      scope: OIDC_SCOPE,
      ...(configs || {}),
    })

    router.push(`${OIDC_AUTHORIZATION_ENDPOINT}?${query.toString()}`)
  }

  return (
    <main>
      <h1>SCENARIOS</h1>
      <Space direction="vertical">
        <Button
          onClick={() =>
            requestLogin({
              providers: 'magic_link,email,apple,google,facebook',
            })
          }
          type="primary"
        >
          Case login in
        </Button>
        <Button onClick={() => router.push('/link-wallet')} type="primary">
          Case not login in
        </Button>
      </Space>
    </main>
  )
}
