import '../styles.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import SiteLayout from '@/components/SiteLayout'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    </ThemeProvider>


  )
}

export default App
