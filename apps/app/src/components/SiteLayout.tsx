import Loading from '@components/Loading'
import { useProfilesOwnedBy } from '@lens-protocol/react-web'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useTheme } from 'next-themes'
import { FC, ReactNode, Suspense, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAccount } from 'wagmi'

import { useAppPersistStore, useAppStore } from '@/store/app'

import { Button } from './UI/Button'
import { Modal } from './UI/Modal'

const Navbar = dynamic(() => import('./Shared/Navbar'), { suspense: true })
const Footer = dynamic(() => import('./Shared/Footer'), { suspense: true })

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

  const { hasCookies, setHasCookies } = useAppPersistStore()
  const [showCookiesPopup, setShowCookiesPopup] = useState<boolean>(true)

  useEffect(() => {
    if (address) setAuthAddress(address)
  }, [address])

  useEffect(() => {
    if (profiles) setProfiles(profiles)
  }, [profiles, setProfiles])

  useEffect(() => {
    if (hasCookies) {
      setShowCookiesPopup(false)
    }
  }, [hasCookies])

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
  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />
      </Head>
      <Modal title="Cookies" show={showCookiesPopup} onClose={() => {}}>
        <Button
          onClick={() => {
            setHasCookies(true)
          }}
        >
          Allow cookies
        </Button>
      </Modal>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
      <Suspense fallback={<Loading />}>
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex-grow">{children}</div>
          <div>
            <Footer />
          </div>
        </div>
      </Suspense>
    </>
  )
}

export default SiteLayout
