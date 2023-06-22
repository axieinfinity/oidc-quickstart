import { v4 as uuid } from 'uuid'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import crypto from 'crypto'

export default function Login() {
  const router = useRouter()

  //Redirect user to Sky Mavis Account upon loading
  useEffect(() => {
    const authURL = 'https://api-gateway.skymavis.com/oauth2/auth'
    const clientID = 'YOUR_CLIENT_ID'
    const scopes = 'openid+offline+offline_access'
    const callBack = 'https://YOUR_APP_URL/oauth2/callback'

    let codeVerifier = generateRandomString(51)
    let code = generateCodeChallenge(codeVerifier)
    localStorage.setItem('codeVerifier', codeVerifier) //Store the codeVerifier

    let url =
      authURL +
      '?client_id=' +
      clientID +
      '&state=' +
      uuid() +
      '&scope=' +
      scopes +
      '&redirect_uri=' +
      encodeURIComponent(callBack) +
      '&response_type=code' +
      '&nonce=' +
      uuid() +
      '&code_challenge_method=S256' +
      '&code_challenge=' +
      code

    router.push(url)
  })

  return <></>
}

function generateRandomString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

function base64UrlEncode(buffer) {
  let base64 = buffer.toString('base64')
  base64 = base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  return base64
}

export function generateCodeChallenge(codeVerifier) {
  // Encode the code_verifier as bytes
  const codeVerifierBytes = Buffer.from(codeVerifier, 'ascii')

  // Hash the code_verifier using SHA-256
  const codeChallengeBytes = crypto
    .createHash('sha256')
    .update(codeVerifierBytes)
    .digest()

  // Encode the hashed code_verifier as Base64
  const codeChallenge = base64UrlEncode(codeChallengeBytes)

  return codeChallenge
}
