import CryptoJS, { SHA256 } from 'crypto-js'
import React from 'react'

const CLIENT_ID = process.env.CLIENT_ID ?? ''
const CALLBACK_URL =
  process.env.CALLBACK_URL ?? 'http://localhost:3000/oauth2/callback'
const SSO_ENDPOINT =
  process.env.SSO_ENDPOINT || 'https://api-gateway.skymavis.one'

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
      client_id: CLIENT_ID,
      redirect_uri: CALLBACK_URL,
      response_type: 'code',
      scopes: 'openid',
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    })

    window.open(`${SSO_ENDPOINT}/oauth2/auth?${query.toString()}`, '_self')
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
