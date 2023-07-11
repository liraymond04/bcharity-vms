import '../styles.css'

import { development, LensConfig, LensProvider } from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'

import SiteLayout from '@/components/SiteLayout'
import { IS_MAINNET } from '@/constants'

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development
}

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
      options: { projectId: '...', showQrModal: true }
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
      <LensProvider config={lensConfig}>
        <ThemeProvider defaultTheme="light" attribute="class">
          <SiteLayout>
            <Component {...pageProps} />
          </SiteLayout>
        </ThemeProvider>
      </LensProvider>
    </WagmiConfig>
  )
}

export default App
