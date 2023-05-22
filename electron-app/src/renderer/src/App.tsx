import Versions from './components/Versions'
import { useState } from 'react'
import icons from './assets/icons.svg'

function App(): JSX.Element {
  const [authenticating, setAuthenticating] = useState(false)
  const requestLogin = async (): Promise<void> => {
    setAuthenticating(true)
    const resp = await window.electron.ipcRenderer.invoke('request_login', 1)
    console.log('resp', resp)
    setAuthenticating(false)
  }
  return (
    <div className="container">
      <Versions></Versions>

      <svg className="hero-logo" viewBox="0 0 900 300">
        <use xlinkHref={`${icons}#electron`} />
      </svg>
      <h2 className="hero-text">
        You{"'"}ve successfully created an Electron project with React and TypeScript
      </h2>
      <p className="hero-tagline">
        Please try pressing <code>F12</code> to open the devTool
      </p>

      <div className="links">
        <button
          style={{
            marginTop: 32,
            padding: '12px 48px',
            borderRadius: 8,
            outline: 'none',
            border: '1px solid transparent',
            cursor: 'pointer'
          }}
          onClick={requestLogin}
        >
          {authenticating ? 'Logging in...' : 'Request Login'}
        </button>
      </div>
    </div>
  )
}

export default App
