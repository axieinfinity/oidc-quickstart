import { useState } from 'react'

function App(): JSX.Element {
  const [token, setToken] = useState('')
  const requestLogin = async (): Promise<void> => {
    const { token } = await window.electron.ipcRenderer.invoke(
      'request_login',
      1,
    )

    if (token) setToken(token)
  }
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
          <pre style={{ whiteSpace: 'pre-wrap', width: 600, overflow: 'auto' }}>
            {JSON.stringify(token, null, 2)}
          </pre>
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
            Continue with Sky Mavis SSO
          </button>
        </>
      )}
    </div>
  )
}

export default App
