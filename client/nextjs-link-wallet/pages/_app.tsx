import { Col, Row } from 'antd'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col span={12}>
        <Row justify="center" align="middle">
          <Component {...pageProps} />
        </Row>
      </Col>
    </Row>
  )
}
