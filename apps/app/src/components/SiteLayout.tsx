import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { FC, ReactNode, Suspense } from 'react'
import Loading from '@components/Loading'
import { Toaster } from 'react-hot-toast'

const Navbar = dynamic(() => import('./Shared/Navbar'), { suspense: true })



interface Props {
  children: ReactNode
}

const SiteLayout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme()

  const toastOptions = {
    style: {
      background: resolvedTheme === 'dark' ? '#18181B' : '',
      color: resolvedTheme === 'dark' ? '#fff' : ''
    },
    success: {
      className: 'border border-green-500',
      iconTheme: {
        primary: '#10B981',
        secondary: 'white'
      }
    },
    error: {
      className: 'border border-red-500',
      iconTheme: {
        primary: '#EF4444',
        secondary: 'white'
      }
    },
    loading: { className: 'border border-gray-300' }
  }
  const Footer = dynamic(() => import('./Shared/Footer'), { suspense: true })
  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />
      </Head>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
      <Suspense fallback={<Loading />}>
        <div>
          <Navbar />
          {children}
        </div>

      </Suspense>
      <div style={{ position: "absolute", bottom: 0, width:"100%" }}>
        
        <Footer/>
    
      </div>
    </>
  )
}

export default SiteLayout
