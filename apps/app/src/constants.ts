import { polygon, polygonAmoy } from 'wagmi/chains'

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_MAINNET = process.env.NEXT_PUBLIC_IS_MAINNET === 'true'

export const APP_NAME = 'BCharity VMS'
export const DESCRIPTION =
  'Next generation group-driven composable, decentralized, and permissionless public good Web3 built on blockchain.'
export const DEFAULT_OG = 'https://github.com/bcharity/assets'

// Git
export const GIT_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)
export const GIT_COMMIT_REF = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF

// Misc
export const CONTACT_EMAIL = 'admin@bcharity.net'
export const GOOD_API_URL = 'https://good-vms-api.vercel.app/'
export const PUBLIC_URL = process.env.NEXT_PUBLIC_URL
export const RELAY_ON =
  PUBLIC_URL === 'https://bcharity.net' ||
  PUBLIC_URL === 'http://localhost:3000'
    ? process.env.NEXT_PUBLIC_RELAY_ON === 'true'
    : false
export const CATEGORIES = [
  'Education',
  'Environment',
  'Animals',
  'Social',
  'Healthcare',
  'Sports and Leisure',
  'Disaster Relief',
  'Reduce Poverty',
  'Reduce Hunger',
  'Health',
  'Clean Water',
  'Gender Equality',
  'Affordable and Clean Energy',
  'Work Experience',
  'Technology',
  'Infrastructure',
  'Peace and Justice'
]

// Messages
export const ERROR_MESSAGE = 'Something went wrong!'
export const CONNECT_WALLET = 'Please connect your wallet.'
export const WRONG_NETWORK = IS_MAINNET
  ? 'Please change network to Polygon mainnet.'
  : 'Please change network to Polygon Amoy testnet.'
export const SIGN_ERROR = 'Failed to sign data'

export const VHR_TOKEN = '0x7e6a70e1e1b0cc0af51424bb70d98445a1af5cca'

// URLs
export const STATIC_ASSETS =
  'https://cdn.statically.io/gh/liraymond04/bcharity-assets/main/images'
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://amoy.polygonscan.com'
export const CORS_PROXY = 'https://corsproxy.io/?'
export const VHR_TOP_HOLDERS_URL = `https://amoy.polygonscan.com/token/tokenholderchart/${VHR_TOKEN}`
export const RARIBLE_URL = IS_MAINNET
  ? 'https://rarible.com'
  : 'https://rinkeby.rarible.com'
export const IMAGEKIT_URL_PROD = 'https://ik.imagekit.io/gznuz6k7b/'
export const IMAGEKIT_URL_DEV = 'https://ik.imagekit.io/ivzeeb1pg/'
export const ARWEAVE_GATEWAY = 'https://arweave.net'
export const IMAGEKIT_URL = IS_PRODUCTION ? IMAGEKIT_URL_PROD : IMAGEKIT_URL_DEV
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/'

// Web3
export const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
export const ALCHEMY_RPC = IS_MAINNET
  ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
  : `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_KEY}`

export const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
export const INFURA_PROJECT_SECRET =
  process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET

export const ARWEAVE_KEY = process.env.NEXT_PUBLIC_ARWEAVE_KEY

export const POLYGON_MAINNET = {
  ...polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon-rpc.com' }
}
export const POLYGON_AMOY = {
  ...polygonAmoy,
  name: 'Polygon Amoy',
  rpcUrls: { default: 'https://rpc-amoy.polygon.technology' }
}
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_AMOY.id

export const ERRORS = {
  notMined:
    'A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync.'
}

// Addresses
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const LENSHUB_PROXY = IS_MAINNET
  ? '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
  : '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
export const LENS_PERIPHERY = IS_MAINNET
  ? '0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f'
  : '0xD5037d72877808cdE7F669563e9389930AF404E8'
export const FREE_COLLECT_MODULE = IS_MAINNET
  ? '0x23b9467334bEb345aAa6fd1545538F3d54436e96'
  : '0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c'
export const DEFAULT_COLLECT_TOKEN = IS_MAINNET
  ? '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'

// Whitelisted currencies
export const CURRENCIES = {
  '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889': {
    symbol: 'WMATIC',
    name: 'Wrapped Matic'
  },
  '0x3C68CE8504087f89c640D02d133646d98e64ddd9': {
    symbol: 'WETH',
    name: 'WETH'
  },
  '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e': {
    symbol: 'USDC',
    name: 'USDC'
  },
  '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F': {
    symbol: 'DAI',
    name: 'DAI'
  },
  '0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E': {
    symbol: 'NCT',
    name: 'Toucan Protocol: Nature Carbon Tonne'
  }
}

//VHR and GOOD Conversion
export const GOOD_TOKEN = '0xd21932b453f0dC0918384442D7AaD5B033C4217B'
export const GIVE_DAI_LP = '0x4373C35bB4E55Dea2dA2Ba695605a768f011b4B9'
export const DAI_TOKEN = '0xf0728Bfe68B96Eb241603994de44aBC2412548bE'
export const VHR_TO_DAI_PRICE = 0.009

// Bundlr
export const BUNDLR_CURRENCY = 'matic'
export const BUNDLR_NODE_URL = IS_MAINNET
  ? 'https://node1.bundlr.network'
  : 'https://devnet.bundlr.network'
