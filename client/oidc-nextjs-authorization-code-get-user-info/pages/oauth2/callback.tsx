import axios, { AxiosError, isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

const SERVER_TOKEN_ENDPOINT =
  process.env.SERVER_TOKEN_ENDPOINT ??
  'http://localhost:8080/oauth2/authorization-code/token'
const OIDC_CALLBACK_URL =
  process.env.OIDC_CALLBACK_URL ?? 'http://localhost:3000/oauth2/callback'
const SERVER_USERINFO_ENDPOINT =
  process.env.SERVER_USERINFO_ENDPOINT ??
  'http://localhost:8080/oauth2/userinfo'

const Callback = () => {
  const router = useRouter()
  const { code } = router.query
  const [token, setToken] = useState<any>(null)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const exchangeToken = async () => {
    try {
      if (!code) return

      const { data } = await axios({
        url: SERVER_TOKEN_ENDPOINT,
        method: 'POST',
        data: {
          code,
          redirect_uri: OIDC_CALLBACK_URL,
        },
      })

      setToken(data)
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error?.response?.data)
      }
    }
  }

  const getUserInfo = async () => {
    try {
      if (!token) return

      const { data } = await axios({
        url: SERVER_USERINFO_ENDPOINT,
        method: 'GET',
        headers: {
          authorization: `Bearer ${data.access_token}`,
        },
      })

      setUser(data)
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error?.response?.data)
      }
    }
  }

  useEffect(() => {
    if (code) exchangeToken()
  }, [code])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 100,
      }}
    >
      {token && (
        <>
          <h1>Login successful!</h1>
          <pre style={{ whiteSpace: 'pre-wrap', width: 600, overflow: 'auto' }}>
            {JSON.stringify(token, null, 2)}
          </pre>

          <button
            style={{
              padding: '12px 32px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={getUserInfo}
          >
            Get User Info
          </button>

          <pre style={{ whiteSpace: 'pre-wrap', width: 600, overflow: 'auto' }}>
            {user ? JSON.stringify(user, null, 2) : ''}
          </pre>
        </>
      )}

      {error && (
        <>
          <h1>Failed!</h1>
          <pre style={{ whiteSpace: 'pre-wrap', width: 600, overflow: 'auto' }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </>
      )}
    </div>
  )
}

export default Callback
