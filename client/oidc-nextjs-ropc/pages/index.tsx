import React, { useState } from 'react'
import { Button, Col, Form, Input, Row, notification } from 'antd'
import { Typography } from 'antd'
import { SHA256 } from 'crypto-js'
import { CaptchaLoadFailError, useBindCaptcha } from '@axieinfinity/captcha'
import MFAModal, { MFAMode } from './_MFAModal'
import axios, { AxiosError, isAxiosError } from 'axios'

const GEETEST_ENDPOINT =
  process.env.GEETEST_ENDPOINT ??
  'https://captcha.skymavis.one/api/geetest/register'
const SERVER_ROPC_TOKEN_ENDPOINT =
  process.env.SERVER_ROPC_TOKEN_ENDPOINT ??
  'http://localhost:8080/oauth2/ropc/mfa'
const SERVER_ROPC_MFA_ENDPOINT =
  process.env.SERVER_ROPC_MFA_ENDPOINT ??
  'http://localhost:8080/oauth2/ropc/mfa'

const { Title } = Typography

export default function Home() {
  const [loginLoading, setLoginLoading] = useState(false)
  const [MFALoading, setMFALoading] = useState(false)
  const [MFAData, setMFAData] = useState({
    open: false,
    token: '',
  })
  const [token, setToken] = React.useState(null)
  const [notify, contextHolder] = notification.useNotification()
  const { requestCaptcha } = useBindCaptcha(GEETEST_ENDPOINT)

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
        url: SERVER_ROPC_MFA_ENDPOINT,
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

      notify.info({
        message: 'Login successful!',
      })
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          error: string
          error_description: string
        }>
        const errorData = axiosError.response?.data

        notify.error({
          message: errorData?.error,
          description: errorData?.error_description,
        })
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

      const [captcha, error] = await requestCaptcha()

      if (error instanceof CaptchaLoadFailError) {
        setLoginLoading(false)
        notify.error({
          message:
            'Captcha load failed. Please disable your adblocker and try again.',
        })
        return
      }

      if (!captcha) {
        setLoginLoading(false)
        notify.error({
          message: 'Verify captcha failed.',
        })
        return
      }

      const { email, password } = values

      const { data } = await axios({
        url: SERVER_ROPC_TOKEN_ENDPOINT,
        method: 'POST',
        data: {
          captcha,
          email,
          password: SHA256(password).toString(),
        },
      })

      setLoginLoading(false)

      setToken(data.token)

      notify.info({
        message: 'Login successful!',
      })
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

        notify.error({
          message: errorData?.error,
          description: errorData?.error_description,
        })
      }

      setLoginLoading(false)
    }
  }

  return (
    <main>
      {contextHolder}
      <MFAModal
        open={MFAData.open}
        onSubmit={onSubmitMFA}
        isLoading={MFALoading}
      />
      <Row justify="center" style={{ marginTop: 120 }}>
        <Col span={6}>
          {token ? (
            <div style={{ wordBreak: 'break-all' }}>
              <Title level={2}>Login successful!</Title>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(token, null, 2)}
              </pre>
            </div>
          ) : (
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={onSubmitEmailPassword}
            >
              <Form.Item wrapperCol={{ offset: 8 }}>
                <Title level={2}>Login</Title>
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: 'email', message: 'Invalid email!' },
                  { required: true, message: 'Please input your email!' },
                ]}
              >
                <Input type="" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loginLoading}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </Col>
      </Row>
    </main>
  )
}
