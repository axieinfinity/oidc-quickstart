import axios, { AxiosError, isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

const SERVER_TOKEN_ENDPOINT =
  process.env.SERVER_TOKEN_ENDPOINT ??
  'http://localhost:8080/oauth2/authorization-code/token'
const CALLBACK_URL =
  process.env.CALLBACK_URL ?? 'http://localhost:3000/oauth2/callback'

const Callback = () => {
  const router = useRouter()
  const { code } = router.query
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  const exchangeToken = async () => {
    try {
      const code_verifier = localStorage.getItem('code_verifier')

      if (!code || !code_verifier) return

      const { data } = await axios({
        url: SERVER_TOKEN_ENDPOINT,
        method: 'POST',
        data: {
          code,
          redirect_uri: CALLBACK_URL,
          code_verifier,
        },
      })

      setToken(data)
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
        </>
      )}

      {error && (
        <>
          <h1>Login failed!</h1>
          <pre style={{ whiteSpace: 'pre-wrap', width: 600, overflow: 'auto' }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </>
      )}
    </div>
  )
}

export default Callback
