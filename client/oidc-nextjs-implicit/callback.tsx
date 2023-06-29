import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Callback = () => {
  const router = useRouter()
  const { access_token } = router.query
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!access_token) setError('No access token found.')
    else setToken(access_token as string)
  }, [access_token])

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
