import { Button, Space } from 'antd'

const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID ?? ''
const OIDC_AUTHORIZATION_ENDPOINT =
  process.env.OIDC_AUTHORIZATION_ENDPOINT ??
  'https://api-gateway.skymavis.com/oauth2/auth'
const OIDC_CALLBACK_URL =
  process.env.OIDC_CALLBACK_URL ?? 'http://localhost:3000/oauth2/callback'
const OIDC_SCOPE = process.env.OIDC_SCOPE ?? 'openid offline'

const requestLogin = () => {
  const query = new URLSearchParams({
    response_type: 'code',
    state: crypto.randomUUID(),
    client_id: OIDC_CLIENT_ID,
    redirect_uri: OIDC_CALLBACK_URL,
    scope: OIDC_SCOPE,
  })

  window.open(`${OIDC_AUTHORIZATION_ENDPOINT}?${query.toString()}`, '_self')
}

export default function Home() {
  return (
    <main>
      <Space direction="vertical">
        <Button onClick={requestLogin} type="primary">
          Case login in
        </Button>
        <Button href="/link-wallet" type="primary">
          Case not login in
        </Button>
      </Space>
    </main>
  )
}
