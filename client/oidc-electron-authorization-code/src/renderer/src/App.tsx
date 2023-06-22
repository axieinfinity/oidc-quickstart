import { useState } from 'react'

function App(): JSX.Element {
  const [authenticating, setAuthenticating] = useState(false)

  const requestLogin = async (): Promise<void> => {
    setAuthenticating(true)
    const resp = await window.electron.ipcRenderer.invoke('request_login', 1)
    setAuthenticating(false)
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '200px',
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
        {authenticating ? 'Logging in...' : 'Continue with Sky Mavis SSO'}
      </button>
    </div>
  )
}

export default App
