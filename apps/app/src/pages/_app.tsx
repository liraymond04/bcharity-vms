import '../styles.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { WagmiProvider } from 'wagmi'

import SiteLayout from '@/components/SiteLayout'
import { config } from '@/lib/config'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => {
  console.log(
    'using thirdweb client id',
    process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
  )
  return (
    <ThirdwebProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" attribute="class">
            <SiteLayout>
              <Component {...pageProps} />
            </SiteLayout>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThirdwebProvider>
  )
}

export default App
