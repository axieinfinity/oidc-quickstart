import { Form, Input, Modal, ModalProps } from 'antd'
import type { FC } from 'react'
import React, { useCallback, useState } from 'react'

const MFAModeConfigs = {
  otp: {
    value: 'otp',
    name: 'Authenticator code',
    maxLength: 6,
  },
  recovery: {
    value: 'recovery',
    name: 'Recovery code',
    maxLength: 10,
  },
} as const

export type MFAMode = keyof typeof MFAModeConfigs

type MFAModalProps = ModalProps & {
  isLoading?: boolean
  onSubmit: (_: { mode: MFAMode; code: string }) => void
}

const MFAModal: FC<MFAModalProps> = props => {
  const { isLoading = false, onSubmit = () => {}, ...rest } = props
  const [form] = Form.useForm()
  const [mode, setMode] = useState<MFAMode>('otp')

  const onSwitchMode = useCallback(() => {
    form.resetFields()
    setMode(mode === 'recovery' ? 'otp' : 'recovery')
  }, [mode])

  const onFinish = useCallback(
    async (values: { code: string }) => {
      const { code } = values

      if (isLoading) return

      onSubmit({
        mode,
        code,
      })
    },
    [isLoading, mode, onSubmit],
  )

  return (
    <Modal
      title="Security verification"
      onOk={form.submit}
      confirmLoading={isLoading}
      {...rest}
    >
      <Form form={form} onFinish={onFinish}>
        <div style={{ marginBottom: 8 }}>
          Enter your authentication code below
        </div>
        <Form.Item
          style={{ marginBottom: 0 }}
          name="code"
          rules={[{ required: true, message: 'Please fill out this field!' }]}
        >
          <Input
            autoFocus
            maxLength={MFAModeConfigs[mode].maxLength}
            placeholder={MFAModeConfigs[mode].name}
          />
        </Form.Item>
        <Form.Item>
          <div
            style={{
              marginTop: 4,
              fontSize: 14,
              color: '#1677ff',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={onSwitchMode}
          >
            {mode === 'otp' ? 'Use recovery code' : 'Use authenticator code'}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default MFAModal
