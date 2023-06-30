import CryptoJS, { SHA256 } from 'crypto-js'
import React from 'react'

const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID ?? ''
const OIDC_CALLBACK_URL =
  process.env.OIDC_CALLBACK_URL ?? 'http://localhost:3000/oauth2/callback'
const OIDC_AUTHORIZATION_ENDPOINT =
  process.env.OIDC_AUTHORIZATION_ENDPOINT ??
  'https://api-gateway.skymavis.com/account/oauth2/auth'

const OIDC_SCOPE = process.env.OIDC_SCOPE ?? ''

const generateRandomString = (length = 50) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  return result
}

const generateCodeChallenge = (codeVerifier: string) => {
  return SHA256(codeVerifier)
    .toString(CryptoJS.enc.Base64)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}
export default function Home() {
  const requestLogin = () => {
    const codeVerifier = generateRandomString()
    const codeChallenge = generateCodeChallenge(codeVerifier)

    localStorage.setItem('code_verifier', codeVerifier)

    const query = new URLSearchParams({
      state: crypto.randomUUID(),
      client_id: OIDC_CLIENT_ID,
      redirect_uri: OIDC_CALLBACK_URL,
      response_type: 'code',
      scope: OIDC_SCOPE,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    })

    window.open(`${OIDC_AUTHORIZATION_ENDPOINT}?${query.toString()}`, '_self')
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
