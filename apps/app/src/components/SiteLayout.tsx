import Loading from '@components/Loading'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FC, ReactNode, Suspense, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { getProfilesOwnedBy } from '@/lib/lens-protocol'
import { useAppStore, useCookies } from '@/store/app'

import GradientWrapper from './Shared/Gradient/GradientWrapper'
import { Button } from './UI/Button'
import { Modal } from './UI/Modal'

const Navbar = dynamic(() => import('./Shared/Navbar'), { suspense: true })
const Footer = dynamic(() => import('./Shared/Footer'), { suspense: true })

/**
 * Properties of {@link SiteLayout}
 */
export interface SiteLayoutProps {
  /**
   * React components wrapped by the component
   */
  children: ReactNode
}

/**
 * Component that defines the basic layout of the site, such as the HTML metadata
 * tags for the site head, {@link components.Shared.Navbar.Navbar}, {@link components.Shared.Footer},
 * and main page content.
 *
 * This component is where react toast messages from the {@link https://github.com/timolins/react-hot-toast | react-hot-toast} package
 * are handled and shown. The popup modal to accept/reject cookies is also managed
 * by the site layout component.
 */
const SiteLayout: FC<SiteLayoutProps> = ({ children }) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.site-layout'
  })

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
        <div
          className="mt-8 mx-16 flex justify-center text-xl text-red-600"
          suppressHydrationWarning
        >
          {t('warning')}
        </div>
        <div
          className="mt-4 mb-16 mx-16 justify-center flex space-x-1"
          suppressHydrationWarning
        >
          {t('warning')}
          <Link
            className="text-blue-400"
            href="/cookies"
            suppressHydrationWarning
          >
            {t('policy')}
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <Button
            className="mb-8 mr-16 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br"
            onClick={() => {
              setHasCookies(true)
            }}
            suppressHydrationWarning
          >
            {t('accept')}
          </Button>
          <Button
            className="mb-8 ml-16 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br border-red-600"
            onClick={() => {
              setShowCookiesPopup(false)
            }}
            suppressHydrationWarning
          >
            {t('decline')}
          </Button>
        </div>
      </Modal>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
      <Suspense fallback={<Loading />}>
        <div className="flex flex-col h-screen">
          <Navbar />

          <GradientWrapper className="grow">{children}</GradientWrapper>

          <div>
            <Footer />
          </div>
        </div>
      </Suspense>
    </>
  )
}

export default SiteLayout
