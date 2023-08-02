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
export const LINK_WALLET_REDIRECT_URI =
  process.env.LINK_WALLET_REDIRECT_URI ??
  'http://localhost:3000/link-wallet/callback'
export const SERVER_USERINFO_ENDPOINT =
  process.env.SERVER_USERINFO_ENDPOINT ??
  'http://localhost:8080/oauth2/userinfo'

export const WC_METADATA = {
  projectId: WC_DEFAULT_PROJECT_ID,
  chains: WC_SUPPORTED_CHAIN_IDS,
  rpcMap: WC_RPC_MAP,
  methods: WC_SUPPORTED_METHODS,
  metadata: {
    name: 'Sky Mavis Account',
    description: 'Connect to Ronin Wallet from Sky Mavis Account',
    icons: [],
    url: 'https://accounts.skymavis.com',
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

export const generateSingingMessage = ({
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
  return `accounts.skymavis.com wants you to sign in with your Ronin account:
  ${address
    .replace('0x', 'ronin:')
    .toLowerCase()}\n\nI accept the Terms of Use (https://axieinfinity.com/terms-of-use) and the Privacy Policy (https://axieinfinity.com/privacy-policy)\n\nURI: https://accounts.skymavis.com\nVersion: ${version}\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued At: ${issuedAt}\nExpiration Time: ${expirationTime}\nNot Before: ${notBefore}`
}
