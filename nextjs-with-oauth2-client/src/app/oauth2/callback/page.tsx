'use client'
import { useEffect, useState } from 'react'
import { extractQueryParams } from '@/app/client'

const Callback = () => {
  const [user, setUser] = useState()
  const [token, setToken] = useState()

  const getUserInfo = async (accessToken: string) => {
    const user = await fetch('http://localhost:3000/api/oauth2/userinfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access-token': accessToken,
      },
    }).then(res => res.json())
    setUser(user)
  }

  const verifyOAuth2Callback = async () => {
    const codeVerifier = localStorage.getItem('codeVerifier')
    const { code } = extractQueryParams(location.href)
    if (code) {
      const resp = await fetch('http://localhost:3000/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, codeVerifier }),
      }).then(res => res.json())
      if (resp.success) {
        console.log('token:before', token)
        setToken(resp.data.access_token)
        console.log('token:after', token)
        getUserInfo(resp.data.access_token)
      }
    }
  }

  useEffect(() => {
    verifyOAuth2Callback()
  })
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        maxWidth: '500px',
        width: '100%',
        margin: 'auto',
        height: '100dvh',
      }}
    >
      <div style={{ padding: 32, width: '100%' }}>
        <div>
          <h2 style={{ fontWeight: 'bold' }}>Token</h2>
          <input
            value={token || 'authenticating...'}
            style={{ width: '100%', padding: 8, borderRadius: 8 }}
          />
        </div>
        <div>
          <h2 style={{ fontWeight: 'bold' }}>UserInfo</h2>
          <textarea
            value={JSON.stringify(user, null, 2) || 'authenticating...'}
            style={{
              width: '100%',
              minHeight: 200,
              borderRadius: 8,
              padding: 8,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Callback
