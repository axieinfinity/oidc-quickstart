import React from 'react'

const CLIENT_ID = process.env.CLIENT_ID ?? ''
const SSO_AUTHORIZATION_ENDPOINT = process.env.SSO_AUTHORIZATION_ENDPOINT ?? ''
const CALLBACK_URL =
  process.env.CALLBACK_URL ?? 'http://localhost:3000/oauth2/callback'
const SSO_ENDPOINT =
  process.env.SSO_ENDPOINT || 'https://api-gateway.skymavis.one'

export default function Home() {
  const requestLogin = () => {
    const query = new URLSearchParams({
      state: crypto.randomUUID(),
      client_id: CLIENT_ID,
      redirect_uri: CALLBACK_URL,
      response_type: 'code',
      scopes: 'openid',
    })

    window.open(`${SSO_AUTHORIZATION_ENDPOINT}?${query.toString()}`, '_self')
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
