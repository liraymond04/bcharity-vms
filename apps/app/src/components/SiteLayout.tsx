import Loading from '@components/Loading'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FC, ReactNode, Suspense, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAccount } from 'wagmi'

import getProfilesOwnedBy from '@/lib/lens-protocol/getProfilesOwnedBy'
import { useAppStore, useCookies } from '@/store/app'

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

  const { hasCookies, setHasCookies } = useCookies()
  const [showCookiesPopup, setShowCookiesPopup] = useState<boolean>(true)

  useEffect(() => {
    if (address) {
      getProfilesOwnedBy(address).then((profiles) => {
        setProfiles(profiles)
      })
    }
  }, [address, setProfiles])

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
      <Modal
        title=""
        size="md"
        show={showCookiesPopup}
        onClose={() => {
          setShowCookiesPopup(false)
        }}
      >
        <img
          className="mt-5 object-scale-down h-36 w-48 mx-auto"
          src="Cookie.jpg"
          alt="image description"
        ></img>
        <div className="mt-8 mb-16 mx-16 justify-center">
          We use cookies to improve your browsing experience, save your
          preferences and collect information on how you use our website. You
          can decline these cookies for a less personalized experience. For more
          information about cookies, please see our{' '}
          <Link className="text-blue-400" href="/cookies">
            Cookie Policy.
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <Button
            className="mb-8 mr-16 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br"
            onClick={() => {
              setHasCookies(true)
            }}
          >
            Accept cookies
          </Button>
          <Button
            className="mb-8 ml-16 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br border-red-600"
            onClick={() => {
              setShowCookiesPopup(false)
            }}
          >
            Decline cookies
          </Button>
        </div>
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
