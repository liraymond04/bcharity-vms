import Loading from '@components/Loading'
import { useProfilesOwnedBy } from '@lens-protocol/react-web'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useTheme } from 'next-themes'
import { FC, ReactNode, Suspense, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAccount } from 'wagmi'

import { useAppStore } from '@/store/app'

const Navbar = dynamic(() => import('./Shared/Navbar'), { suspense: true })



interface Props {
  children: ReactNode
}

const SiteLayout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme()
  const { setProfiles } = useAppStore()
  const { address } = useAccount()

  const [authAddress, setAuthAddress] = useState<string>('')
  const { data: profiles } = useProfilesOwnedBy({
    address: authAddress
  })

  useEffect(() => {
    if (address) setAuthAddress(address)
  }, [address])

  useEffect(() => {
    if (profiles) setProfiles(profiles)
  }, [profiles, setProfiles])

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
