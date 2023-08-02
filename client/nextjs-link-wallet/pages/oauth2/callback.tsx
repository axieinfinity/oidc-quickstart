import { SERVER_USERINFO_ENDPOINT } from '@/utils'
import { Alert, Button } from 'antd'
import axios, { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const SERVER_TOKEN_ENDPOINT =
  process.env.SERVER_TOKEN_ENDPOINT ??
  'http://localhost:8080/oauth2/authorization-code/token'
const OIDC_CALLBACK_URL =
  process.env.OIDC_CALLBACK_URL ?? 'http://localhost:3000/oauth2/callback'

type TTokenResponse = {
  access_token: string
}

const Callback = () => {
  const router = useRouter()
  const { code } = router.query
  const [tokenResponse, setTokenResponse] = useState<TTokenResponse | null>(
    null,
  )
  const [user, setUser] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState(null)

  const exchangeToken = async () => {
    try {
      if (!code) return

      const { data } = await axios<TTokenResponse>({
        url: SERVER_TOKEN_ENDPOINT,
        method: 'POST',
        data: {
          code,
          redirect_uri: OIDC_CALLBACK_URL,
        },
      })

      setTokenResponse(data)
    } catch (error: any) {
      if (isAxiosError(error)) {
        setError(error?.response?.data)
        return
      }

      setError(error?.message ?? error)
    }
  }

  const getUserInfo = async () => {
    try {
      if (!tokenResponse) return

      const { data } = await axios({
        url: SERVER_USERINFO_ENDPOINT,
        method: 'GET',
        headers: {
          authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })

      setUser(data)
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error?.response?.data)
      }
    }
  }

  useEffect(() => {
    if (code) exchangeToken()
  }, [code])

  useEffect(() => {
    if (tokenResponse) getUserInfo()
  }, [tokenResponse])

  return (
    <div>
      {(() => {
        if (error)
          return (
            <>
              <h1>SOMETHING WENT WRONG!</h1>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  width: 600,
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(error, null, 2)}
              </pre>
            </>
          )

        if (tokenResponse)
          return (
            <>
              {user && user?.roninAddress && (
                <Alert
                  style={{ width: 600, marginBottom: 24 }}
                  type="success"
                  message="Congratulation!"
                  description="You already have your own Ronin address."
                />
              )}

              <h1>TOKEN</h1>
              {tokenResponse && (
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    width: 600,
                    overflow: 'auto',
                    marginBottom: 24,
                  }}
                >
                  {JSON.stringify(tokenResponse, null, 2)}
                </pre>
              )}

              <h1>USER</h1>
              {user && (
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    width: 600,
                    overflow: 'auto',
                    marginBottom: 24,
                  }}
                >
                  {JSON.stringify(user, null, 2)}
                </pre>
              )}

              {user && !user?.roninAddress && (
                <Button
                  type="primary"
                  style={{ marginBottom: 24 }}
                  // Note: You should storage the access token some where instead.
                  onClick={() =>
                    router.push(
                      `/link-wallet?access_token=${tokenResponse.access_token}`,
                    )
                  }
                >
                  Next step
                </Button>
              )}
            </>
          )
      })()}
    </div>
  )
}

export default Callback
