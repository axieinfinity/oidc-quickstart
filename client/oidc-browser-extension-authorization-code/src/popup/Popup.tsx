import React, { useEffect, useState } from 'react'
import { runtime, storage } from 'webextension-polyfill'

export const Popup = () => {
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(null)

  const requestLogin = () => {
    if (loading) return
    runtime.sendMessage({ type: 'login' })
    setLoading(true)
  }

  const handleGetToken = async () => {
    const { token = null } = await storage.local.get('token')
    setToken(token)
  }

  const resetLogin = () => {
    storage.local.remove('token')
    setToken(null)
    setLoading(false)
  }

  useEffect(() => {
    handleGetToken()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '100px',
      }}
    >
      {token ? (
        <>
          <h1>Login successful!</h1>
          <pre style={{ whiteSpace: 'pre-wrap', width: 200, overflow: 'auto' }}>
            {JSON.stringify(token, null, 2)}
          </pre>
          <button
            style={{
              padding: '12px 32px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              marginBottom: 50,
            }}
            onClick={resetLogin}
          >
            Reset
          </button>
        </>
      ) : (
        <>
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
            {loading ? 'Loading ... ' : 'Continue with Sky Mavis SSO'}
          </button>
        </>
      )}
    </div>
  )
}

export default Popup
