import React, { useRef, useState } from 'react'
import QRCode from 'qrcode.react'
import { EIP1193Event, EIP1193Provider, InitialData } from './types'
import axios, { isAxiosError } from 'axios'

declare global {
  interface Window {
    ronin?: {
      provider: EIP1193Provider
      roninEvent: EventTarget
    }
  }
}

const SERVER_RONIN_NONCE_ENDPOINT =
  process.env.SERVER_RONIN_NONCE_ENDPOINT ??
  'http://localhost:8080/oauth2/ronin/fetch-nonce'
const SERVER_RONIN_TOKEN_ENDPOINT =
  process.env.SERVER_RONIN_TOKEN_ENDPOINT ??
  'http://localhost:8080/oauth2/ronin/token'

function generateSingingMessage({
  address,
  version = 1,
  chainId = 2020,
  nonce,
  issuedAt,
  expirationTime,
  notBefore,
}: {
  address: string
  version?: number
  chainId: number
  nonce: string
  issuedAt: string
  expirationTime: string
  notBefore: string
}) {
  const { host, origin } = window.location

  return `${host} wants you to sign in with your Ronin account:
${address.replace('0x', 'ronin:').toLowerCase()}

I accept the Terms of Use (https://axieinfinity.com/terms-of-use) and the Privacy Policy (https://axieinfinity.com/privacy-policy)

URI: ${origin}
Version: ${version}
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAt}
Expiration Time: ${expirationTime}
Not Before: ${notBefore}`
}

const setupEventListeners = (provider?: EIP1193Provider) => {
  if (!provider) return

  provider.on(EIP1193Event.CONNECT, () => {
    provider.emit(EIP1193Event.CONNECT)
  })

  provider.on(EIP1193Event.DISCONNECT, (code?: string, reason?: string) => {
    provider.emit(EIP1193Event.DISCONNECT, code, reason)
  })

  provider.on(EIP1193Event.ACCOUNTS_CHANGED, (accounts: string[]) => {
    provider.emit(EIP1193Event.ACCOUNTS_CHANGED, accounts)
  })

  provider.on(EIP1193Event.CHAIN_CHANGED, (chainId: number) => {
    provider.emit(EIP1193Event.CHAIN_CHANGED, chainId)
  })
}

export default function Home() {
  const providerRef = useRef<EIP1193Provider | null>(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState('')

  const connectRoninExtension = async (): Promise<InitialData | null> => {
    if (!window?.ronin) {
      setError('Wallet is not installed.')
      return null
    }

    const provider = window.ronin.provider
    providerRef.current = provider
    setupEventListeners()

    await provider.request?.({
      method: 'eth_requestAccounts',
    })

    const [accounts, chainId] = (await Promise.all([
      provider.request?.({
        method: 'eth_accounts',
      }),
      provider.request?.({
        method: 'eth_chainId',
      }),
    ])) as [string[], string]

    return {
      account: accounts[0],
      chainId: parseInt(chainId, 16),
    }
  }

  const linkRoninWallet = async () => {
    try {
      const connectData = await connectRoninExtension()

      if (!connectData) return

      const { account: address, chainId } = connectData

      const {
        data: { nonce, issued_at, not_before, expiration_time },
      } = await axios({
        url: SERVER_RONIN_NONCE_ENDPOINT,
        params: {
          address,
        },
      })

      const message = generateSingingMessage({
        address,
        chainId,
        nonce,
        issuedAt: issued_at,
        notBefore: not_before,
        expirationTime: expiration_time,
      })

      if (!providerRef.current) return

      const signature = await providerRef.current.request({
        method: 'personal_sign',
        params: [message, address],
      })

      const { data } = await axios({
        url: SERVER_RONIN_TOKEN_ENDPOINT,
        method: 'POST',
        data: {
          address,
          message,
          signature,
        },
      })

      setToken(data.token)
    } catch (error: any) {
      console.log('error', error)
      if (isAxiosError(error)) {
        setError(error?.response?.data)
        return
      }

      setError(error?.message ?? error)
    }
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
        {(() => {
          if (error)
            return (
              <>
                <h1>Login failed!</h1>
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

          if (!token)
            return (
              <>
                <h1>Login</h1>
                <button
                  style={{
                    padding: '12px 32px',
                    marginBottom: 12,
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={linkRoninWallet}
                >
                  Connect Ronin Extension
                </button>
              </>
            )

          if (token)
            return (
              <>
                <h1>Login successful!</h1>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    width: 600,
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(token, null, 2)}
                </pre>
              </>
            )
        })()}
      </div>
    </main>
  )
}
