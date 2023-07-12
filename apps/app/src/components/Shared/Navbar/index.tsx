import TranslateButton from '@components/Shared/TranslateButton'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { Inter } from '@next/font/google'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppPersistStore } from '@/store/app'

import MenuItems from './MenuItems'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

const inter700 = Inter({
  subsets: ['latin'],
  weight: ['700']
})

const Navbar: FC = () => {
  const { t } = useTranslation('common')
  const { isAuthenticated, currentUser } = useAppPersistStore()
  const [auth, setAuth] = useState<boolean>(false)

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }, [currentUser, isAuthenticated])

  interface NavItemProps {
    url: string
    name: string
    current: boolean
  }

  const NavItem = ({ url, name, current }: NavItemProps) => {
    return (
      <Link href={url} aria-current={current ? 'page' : undefined}>
        <Disclosure.Button
          className={clsx(
            'w-full text-left px-5 py-3 rounded-md font-black text-1xl tracking-wide ',
            {
              'text-purple-500 dark:text-white bg-gray-200 dark:bg-gray-800':
                current,
              'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800':
                !current
            }
          )}
        >
          {name}
        </Disclosure.Button>
      </Link>
    )
  }

  const NavItems = () => {
    const { pathname } = useRouter()

    return (
      <>
        <NavItem
          url="/causes"
          name={t('CAUSES')}
          current={pathname == '/causes'}
        />

        <NavItem
          url="/volunteers"
          name={t('VOLUNTEERS')}
          current={pathname == '/volunteers'}
        />

        <NavItem
          url="/organizations"
          name={t('ORGANIZATIONS')}
          current={pathname == '/organizations'}
        />

        {auth && (
          <NavItem
            url="/dashboard"
            name={t('DASHBOARD')}
            current={pathname == '/dashboard'}
          />
        )}
      </>
    )
  }

  return (
    <Disclosure
      as="nav"
      className="sticky h-21 w-full bg-white border-b dark:bg-gray-900 dark:border-b-gray-700/80"
    >
      {({ open }) => (
        <>
          <div className={inter500.className}>
            <div className="flex h-[110px] justify-between ">
              <div className="flex items-center">
                <Disclosure.Button className="inline-flex justify-center items-center mr-4 text-gray-500 rounded-md sm:hidden focus:outline-none">
                  <span className="sr-only">{t('Open main menu')}</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <Link href="/">
                  <div className="inline-flex flex-grow justify-between items-center font-bold text-blue-900">
                    <div className="text-3xl font-black">
                      <img
                        className="ml-10 w-20 h-100"
                        src="/logo.jpg"
                        alt="Logo"
                      />
                    </div>
                    <div className={inter700.className}>
                      <span className="flex text-indigo-800 fle-grow ml-3 mr-3 text-3xl">
                        BCharity
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="hidden sm:block sm:ml-10">
                  <div className="flex items-center space-x-4">
                    <div className="hidden lg:block">{/* <Search /> */}</div>
                    <NavItems />
                  </div>
                </div>
              </div>
              <div className="flex gap-8 items-center">
                <TranslateButton />
                <MenuItems />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="flex flex-col p-3 space-y-2">
              <div className="mb-2">{/* <Search hideDrodown /> */}</div>
              <NavItems />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar
