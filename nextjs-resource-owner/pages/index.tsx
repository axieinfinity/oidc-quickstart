import React, { useState } from 'react'
import { Button, Col, Form, Input, Row, notification } from 'antd'
import { Typography } from 'antd'
import { SHA256 } from 'crypto-js'
import { CaptchaLoadFailError, useBindCaptcha } from '@axieinfinity/captcha'
import MFAModal, { MFAMode } from './_MFAModal'

const GEETEST_ENDPOINT = process.env.NEXT_PUBLIC_GEETEST_ENDPOINT

const { Title } = Typography

export default function Home() {
  const [loginLoading, setLoginLoading] = useState(false)
  const [MFALoading, setMFALoading] = useState(false)
  const [MFAData, setMFAData] = useState({
    open: false,
    token: '',
  })
  const [token, setToken] = React.useState(false)
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

      const resp = await fetch('/api/mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          MFAtoken: MFAData.token,
        }),
      })

      if (!resp.ok) {
        const { error, error_description, mfa_token } = await resp
          .clone()
          .json()

        if (resp.status === 403 && error === 'mfa_required') {
          setMFAData({
            open: true,
            token: mfa_token,
          })
          return
        }

        setMFALoading(false)

        notify.error({
          message: error,
          description: error_description,
        })
        return
      }

      const { token } = await resp.json()

      setToken(token)

      notify.info({
        message: 'Login successful!',
      })
    } catch {
      setMFALoading(false)
    }
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

      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          captcha,
          email,
          password: SHA256(password).toString(),
        }),
      })

      if (!resp.ok) {
        const { error, error_description, mfa_token } = await resp
          .clone()
          .json()

        if (resp.status === 403 && error === 'mfa_required') {
          setMFAData({
            open: true,
            token: mfa_token,
          })
          return
        }

        setLoginLoading(false)

        notify.error({
          message: error,
          description: error_description,
        })
        return
      }

      const { token } = await resp.json()

      setToken(token)

      notify.info({
        message: 'Login successful!',
      })
    } catch {
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
