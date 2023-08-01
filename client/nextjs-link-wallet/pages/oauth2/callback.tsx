import { Button } from 'antd'
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

  useEffect(() => {
    if (code) exchangeToken()
  }, [code])

  return (
    <div>
      {(() => {
        if (error)
          return (
            <>
              <h1>Something went wrong!</h1>
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
              <h1>Login successful!</h1>
              <pre
                style={{ whiteSpace: 'pre-wrap', width: 600, overflow: 'auto' }}
              >
                {JSON.stringify(tokenResponse, null, 2)}
              </pre>
              <Button
                type="primary"
                // Note: You should storage the access token some where instead.
                href={`/link-wallet?access_token=${tokenResponse.access_token}`}
              >
                Next step
              </Button>
            </>
          )
      })()}
    </div>
  )
}

export default Callback
