import '../styles.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'

import SiteLayout from '@/components/SiteLayout'
import { IS_MAINNET, WALLET_CONNECT_PROJECT_ID } from '@/constants'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai],
  [publicProvider()]
)

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true }
    }),
    new WalletConnectConnector({
      chains: [polygon, polygonMumbai],
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID ? WALLET_CONNECT_PROJECT_ID : '',
        showQrModal: true
      }
    })
  ]
}

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
  webSocketPublicClient
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig config={config}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </ThemeProvider>
    </WagmiConfig>
  )
}

export default App
