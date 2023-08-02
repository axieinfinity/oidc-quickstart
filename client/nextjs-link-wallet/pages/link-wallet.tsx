import { EIP1193Provider, InitialData } from '@/utils/types'
import {
  SERVER_RONIN_LINK_WALLET_ENDPOINT,
  SERVER_RONIN_NONCE_ENDPOINT,
  SERVER_RONIN_TOKEN_ENDPOINT,
  WC_METADATA,
  generateSingingMessage,
  toRoninWalletUniversalLink,
} from '@/utils'
import { Alert, Button, Modal, Space } from 'antd'
import axios, { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import QRCode from 'qrcode.react'

declare global {
  interface Window {
    ronin?: {
      provider: EIP1193Provider
      roninEvent: EventTarget
    }
  }
}

export default function LinkWallet() {
  const router = useRouter()
  const accessToken = (router.query?.access_token ?? '') as string

  const providerRef = useRef<
    EIP1193Provider | InstanceType<typeof EthereumProvider> | null
  >(null)
  const [isShowUniversalLinkModal, setIsShowUniversalLinkModal] =
    useState(false)
  const [isShowQRCode, setIsShowQRCode] = useState(false)
  const [tokenResponse, setTokenResponse] = useState(null)
  const [uri, setUri] = useState('')
  const [error, setError] = useState('')

  const connectExtension = async (): Promise<InitialData | null> => {
    if (!window?.ronin) {
      setError('Wallet is not installed.')
      return null
    }

    const provider = window.ronin.provider
    providerRef.current = provider

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

  const connectMobileWallet = async (
    type: 'qrcode' | 'app',
  ): Promise<InitialData | null> => {
    const provider = await EthereumProvider.init(WC_METADATA)

    provider.on('display_uri', (uri: string) => {
      switch (type) {
        case 'qrcode': {
          setIsShowQRCode(true)
          return setUri(uri)
        }
        case 'app': {
          setIsShowUniversalLinkModal(true)
          return setUri(uri)
        }
      }
    })

    providerRef.current = provider

    await provider.disconnect()

    await provider.enable()

    const initialData = await provider.request<InitialData>({
      method: 'wallet_initialData',
    })

    if (!initialData) {
      const [accounts, chainId] = await Promise.all([
        provider.request<string[]>({
          method: 'eth_accounts',
        }),
        provider.request<number>({
          method: 'eth_chainId',
        }),
      ])

      return {
        chainId,
        account: accounts?.[0],
      }
    }

    return initialData
  }

  const signMessage = async (
    connectHandler: () => Promise<InitialData | null>,
  ) => {
    const connectData = await connectHandler()

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

    return {
      address,
      message,
      signature,
    }
  }

  const loginROPC = async (
    connectHandler: () => Promise<InitialData | null>,
  ) => {
    const signMessageData = await signMessage(connectHandler)

    if (!signMessageData) return

    const { address, message, signature } = signMessageData

    try {
      const { data } = await axios({
        url: SERVER_RONIN_TOKEN_ENDPOINT,
        method: 'POST',
        data: {
          address,
          message,
          signature,
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

  const linkWallet = async (
    connectHandler: () => Promise<InitialData | null>,
  ) => {
    const signMessageData = await signMessage(connectHandler)
    console.log('signMessageData', signMessageData)

    if (!signMessageData) return

    const { address, message, signature } = signMessageData

    try {
      const { data } = await axios({
        url: SERVER_RONIN_LINK_WALLET_ENDPOINT,
        method: 'POST',
        data: {
          access_token: accessToken,
          address,
          message,
          signature,
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

  if (error)
    return (
      <Alert
        message="Link wallet failed!"
        description={
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              width: 600,
              overflow: 'auto',
            }}
          >
            {JSON.stringify(error, null, 2)}
          </pre>
        }
        type="error"
        showIcon
      />
    )

  if (tokenResponse) {
    return (
      <div>
        <Alert
          style={{ width: 600 }}
          type="success"
          message="Congratulation!"
          description="Link wallet successful."
        />
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
      </div>
    )
  }

  if (!accessToken)
    return (
      <div>
        <h1>LINK WALLET</h1>
        <Space direction="vertical">
          <Button onClick={() => loginROPC(connectExtension)} type="primary">
            Using extension
          </Button>
          <Button
            onClick={() => loginROPC(() => connectMobileWallet('app'))}
            type="primary"
          >
            Using mobile wallet
          </Button>
          <Button
            onClick={() => loginROPC(() => connectMobileWallet('qrcode'))}
            type="primary"
          >
            Using QR code
          </Button>
          {isShowQRCode && <QRCode value={uri} size={178} />}
          <Modal
            open={isShowUniversalLinkModal}
            okButtonProps={{ href: toRoninWalletUniversalLink(uri) }}
            onCancel={() => setIsShowUniversalLinkModal(false)}
          >
            <a href={toRoninWalletUniversalLink(uri)}>
              Click to switch to mobile wallet
            </a>
          </Modal>
        </Space>
      </div>
    )

  if (accessToken)
    return (
      <div>
        <h1>LINK WALLET</h1>
        <Space direction="vertical">
          <Button onClick={() => linkWallet(connectExtension)} type="primary">
            Using extension
          </Button>
          <Button
            onClick={() => linkWallet(() => connectMobileWallet('app'))}
            type="primary"
          >
            Using mobile wallet
          </Button>
          <Button
            onClick={() => linkWallet(() => connectMobileWallet('qrcode'))}
            type="primary"
          >
            Using QR code
          </Button>
          {isShowQRCode && <QRCode value={uri} size={178} />}
          <Modal
            open={isShowUniversalLinkModal}
            okButtonProps={{ href: toRoninWalletUniversalLink(uri) }}
            onCancel={() => setIsShowUniversalLinkModal(false)}
          >
            <a href={toRoninWalletUniversalLink(uri)}>
              Click to switch to mobile wallet
            </a>
          </Modal>
        </Space>
      </div>
    )
}
