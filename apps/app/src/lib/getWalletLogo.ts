import { STATIC_ASSETS } from 'src/constants'

/**
 * Helper function to get the static assets URL for the provided wallet type
 * @param name string of the wallet type
 * @returns the formatted static assets URL for the provided wallet type
 */
const getWalletLogo = (name: string): string => {
  switch (name) {
    case 'WalletConnect':
      return `${STATIC_ASSETS}/wallets/walletconnect.svg`
    default:
      return `${STATIC_ASSETS}/wallets/browser-wallet.svg`
  }
}

export default getWalletLogo
