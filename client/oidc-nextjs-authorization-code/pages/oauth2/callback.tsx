import axios, { AxiosError, isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT ?? 'http://localhost:8080'

const Callback = () => {
  const router = useRouter()
  const { code } = router.query
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  const exchangeToken = async () => {
    try {
      if (!code) return

      const { data } = await axios({
        baseURL: SERVER_ENDPOINT,
        url: '/oauth2/authorization-code/token',
        method: 'POST',
        data: {
          code,
          redirect_uri: `${window.location.origin}/oauth2/callback`,
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
