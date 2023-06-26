import React, { useState } from 'react'
import { SHA256 } from 'crypto-js'
import { CaptchaLoadFailError, useBindCaptcha } from '@axieinfinity/captcha'
import MFAModal, { MFAMode } from './_MFAModal'
import axios, { AxiosError, isAxiosError } from 'axios'

const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT ?? 'http://localhost:8080'
const CLIENT_ID = process.env.CLIENT_ID ?? ''
const SSO_ENDPOINT =
  process.env.SSO_ENDPOINT || 'https://api-gateway.skymavis.one'

export default function Home() {
  const [loginLoading, setLoginLoading] = useState(false)
  const [MFALoading, setMFALoading] = useState(false)
  const [MFAData, setMFAData] = useState({
    open: false,
    token: '',
  })
  const [token, setToken] = React.useState(false)

  const onSubmitMFA = async ({
    mode,
    code,
  }: {
    mode: MFAMode
    code: string
  }) => {
    try {
      if (MFALoading) return

      setMFALoading(true)

      const { data } = await axios({
        baseURL: SERVER_ENDPOINT,
        url: '/oauth2/ropc/mfa',
        method: 'POST',
        data: {
          code,
          MFAtoken: MFAData.token,
        },
      })

      setMFALoading(false)

      setToken(data.token)

      setMFAData(prev => ({
        ...prev,
        open: false,
      }))
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          error: string
          error_description: string
        }>
        const errorData = axiosError.response?.data
      }
    }

    setMFALoading(false)
  }

  const onSubmitEmailPassword = async (values: {
    email: string
    password: string
  }) => {
    try {
      if (loginLoading) return

      setLoginLoading(true)

      const { email, password } = values

      const { data } = await axios({
        baseURL: SERVER_ENDPOINT,
        url: '/oauth2/ropc/token',
        method: 'POST',
        data: {
          email,
          password: SHA256(password).toString(),
        },
      })

      setLoginLoading(false)

      setToken(data.token)
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          error: string
          error_description: string
          mfa_token: string
        }>
        const errorStatus = axiosError.response?.status
        const errorData = axiosError.response?.data

        if (errorStatus === 403 && errorData?.error === 'mfa_required') {
          setMFAData({
            open: true,
            token: errorData?.mfa_token,
          })
          return
        }
      }

      setLoginLoading(false)
    }
  }

  const requestLogin = () => {
    const query = new URLSearchParams({
      state: crypto.randomUUID(),
      client_id: CLIENT_ID,
      response_type: 'code',
      scopes: 'openid',
      redirect_uri: `${origin}/oauth2/callback`,
    })

    window.open(`${SSO_ENDPOINT}/oauth2/auth?${query.toString()}`, '_self')
  }

  return (
    <main>
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
            <pre
              style={{ whiteSpace: 'pre-wrap', width: 600, overflow: 'auto' }}
            >
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
    </main>
  )
}
