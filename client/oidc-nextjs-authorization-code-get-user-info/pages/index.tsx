import React from 'react'

const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID ?? ''
const OIDC_SSO_AUTHORIZATION_ENDPOINT = process.env.OIDC_SSO_AUTHORIZATION_ENDPOINT ?? 'https://api-gateway.skymavis.one/oauth2/auth'
const OIDC_CALLBACK_URL =
  process.env.OIDC_CALLBACK_URL ?? 'http://localhost:3000/oauth2/callback'
const OIDC_SCOPE =
  process.env.OIDC_SCOPE ?? 'openid offline'

export default function Home() {
  const requestLogin = () => {
    const query = new URLSearchParams({
      state: crypto.randomUUID(),
      client_id: OIDC_CLIENT_ID,
      redirect_uri: OIDC_CALLBACK_URL,
      response_type: 'code',
      scope: OIDC_SCOPE,
    })

    window.open(`${OIDC_SSO_AUTHORIZATION_ENDPOINT}?${query.toString()}`, '_self')
  }

  return (
    <main>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '100px',
        }}
      >
        <h1>Login</h1>
        <button
          style={{
            padding: '12px 32px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={requestLogin}
        >
          Continue with Sky Mavis SSO
        </button>
      </div>
    </main>
  )
}
