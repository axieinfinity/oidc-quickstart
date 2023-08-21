export const WC_DEFAULT_PROJECT_ID = 'd2ef97836db7eb390bcb2c1e9847ecdc'
export const WC_SUPPORTED_CHAIN_IDS = [2020, 2021, 2022]
export const WC_RPC_MAP = {
  2020: 'https://api.roninchain.com/rpc',
  2021: 'https://saigon-testnet.roninchain.com/rpc',
  2022: 'https://hcm-devnet.skymavis.com/rpc',
}
export const WC_SUPPORTED_METHODS = [
  'eth_accounts',
  'eth_requestAccounts',
  'eth_sendTransaction',
  'eth_sign',
  'personal_sign',
  'eth_signTypedData',
  'eth_signTypedData_v4',
  'eth_getFreeGasRequests',
  'wallet_initialData',
]
export const SERVER_RONIN_NONCE_ENDPOINT =
  process.env.SERVER_RONIN_NONCE_ENDPOINT ??
  'http://localhost:8080/oauth2/ronin/fetch-nonce'
export const SERVER_RONIN_TOKEN_ENDPOINT =
  process.env.SERVER_RONIN_TOKEN_ENDPOINT ??
  'http://localhost:8080/oauth2/ronin/token'
export const SERVER_RONIN_LINK_WALLET_ENDPOINT =
  process.env.SERVER_RONIN_LINK_WALLET_ENDPOINT ??
  'http://localhost:8080/oauth2/ronin/link-wallet'
export const SERVER_USERINFO_ENDPOINT =
  process.env.SERVER_USERINFO_ENDPOINT ??
  'http://localhost:8080/oauth2/userinfo'

export const WC_METADATA = {
  projectId: WC_DEFAULT_PROJECT_ID,
  chains: WC_SUPPORTED_CHAIN_IDS,
  rpcMap: WC_RPC_MAP,
  methods: WC_SUPPORTED_METHODS,
  metadata: {
    name: 'Demo',
    description: 'Demo',
    icons: [],
    url: 'http://localhost:3000',
  },
  showQrModal: false,
  disableProviderPing: true,
}

export const toRoninWalletUniversalLink = (
  uri: string,
  prefix?: string,
): string => {
  prefix = prefix ?? 'https://wallet.roninchain.com/'
  const encoded = encodeURIComponent(uri)
  return `${prefix}auth-connect?uri=${encoded}`
}

export const generateSigningMessage = ({
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
}) => {
  const { hostname, pathname, origin } = window.location

  return `${hostname} wants you to sign in with your Ronin account:
${address.replace('0x', 'ronin:').toLowerCase()}

I accept the Terms of Use (https://axieinfinity.com/terms-of-use) and the Privacy Policy (https://axieinfinity.com/privacy-policy)

URI: ${origin + pathname}
Version: ${version}
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAt}
Expiration Time: ${expirationTime}
Not Before: ${notBefore}`
}

export const randomUUID = () => {
  const uuid = [
    Math.random().toString(36).substr(2, 8),
    Math.random().toString(36).substr(2, 4),
    Math.random().toString(36).substr(2, 4),
    Math.random().toString(36).substr(2, 4),
    Math.random().toString(36).substr(2, 4),
    Math.random().toString(36).substr(2, 4),
  ].join('-')
  return uuid
}
