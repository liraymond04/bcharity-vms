import { Inter } from '@next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppPersistStore } from '@/store/app'

import ThemeButton from '../ThemeButton'
import TranslateButton from '../TranslateButton'
import MenuItems from './MenuItems'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

const inter700 = Inter({
  subsets: ['latin'],
  weight: ['700']
})

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<string>('')

  const updateSize = () => {
    if (window.innerWidth >= 1300) {
      setScreenSize('wideDesktop')
    } else if (window.innerWidth >= 1150) {
      setScreenSize('smallDesktop')
    } else if (window.innerWidth >= 500) {
      setScreenSize('phone')
    } else {
      setScreenSize('smallPhone')
    }
  }

  const screenReload = useCallback(() => {
    updateSize()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [screenReload])

  return screenSize
}

const Navbar: FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.navbar'
  })
  const { pathname } = useRouter()
  const { isAuthenticated, currentUser } = useAppPersistStore()
  const [auth, setAuth] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const screenSize = useScreenSize()

  const displayWindow = () => {
    if (showMenu) {
      setShowMenu(false)
    } else {
      setShowMenu(true)
    }
  }

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }, [currentUser, isAuthenticated])

  return (
    <div className="sticky z-40 top-0 flex justify-between bg-accent-content dark:bg-info-content bg-opacity-80 max-h-20 border-b-2 border-gray-100 dark:border-violet-950">
      <div className="flex items-center">
        <Link href="/" aria-current={pathname == '/' ? 'page' : undefined}>
          <img
            className="m-5 h-10 w-auto"
            src="/logo.png"
            alt="BCharity logo"
          ></img>
        </Link>
        {screenSize == 'wideDesktop' && (
          <Link
            className={`m-5 text-2xl text-violet-800 dark:text-white tracking-wider ${inter500.className}`}
            href="/"
            suppressHydrationWarning
          >
            {t('name')}
          </Link>
        )}
        {(screenSize == 'phone' || screenSize == 'smallPhone') && (
          <div className="absolute left-20 top-7">
            <div className="flex-col items-center justify-center">
              <ul>
                <li onClick={displayWindow} className="hover:cursor-pointer">
                  <div
                    className={`w-8 h-1 my-1 rounded-sm" ${
                      showMenu
                        ? 'bg-gray-400 dark:bg-gray-600'
                        : 'bg-black dark:bg-gray-400'
                    }`}
                  ></div>
                  <div
                    className={`w-8 h-1 my-1 rounded-sm " ${
                      showMenu
                        ? 'bg-gray-400 dark:bg-gray-600'
                        : 'bg-black dark:bg-gray-400'
                    }`}
                  ></div>
                  <div
                    className={`w-8 h-1 my-1 rounded-sm " ${
                      showMenu
                        ? 'bg-gray-400 dark:bg-gray-600'
                        : 'bg-black dark:bg-gray-400'
                    }`}
                  ></div>
                </li>
                {showMenu && (
                  <Link
                    href="/projects"
                    aria-current={pathname == '/projects' ? 'page' : undefined}
                  >
                    <div
                      className={`flex justify-center px-10 py-5 bg-accent-content dark:bg-info-content hover:text-purple-600 hover:cursor-pointer border-x-2 border-y-2 mt-[26px] dark:border-[#312f66] ${
                        pathname == '/projects'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      <p
                        className="opacity-70 hover:opacity-100 duration-200"
                        suppressHydrationWarning
                      >
                        {t('projects')}
                      </p>
                    </div>
                  </Link>
                )}
                {showMenu && (
                  <Link
                    href="/volunteers"
                    aria-current={
                      pathname == '/volunteers' ? 'page' : undefined
                    }
                  >
                    <div
                      className={`flex justify-center px-10 py-5 bg-accent-content dark:bg-info-content hover:text-purple-600 hover:cursor-pointer border-x-2 border-b-2 dark:border-[#312f66] ${
                        pathname == '/volunteers'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      <p
                        className="opacity-70 hover:opacity-100 duration-200"
                        suppressHydrationWarning
                      >
                        {t('volunteers')}
                      </p>
                    </div>
                  </Link>
                )}
                {showMenu && (
                  <Link
                    href="/organizations"
                    aria-current={
                      pathname == '/organizations' ? 'page' : undefined
                    }
                  >
                    <div
                      className={`flex justify-center px-10 py-5 bg-accent-content dark:bg-info-content hover:text-purple-600 hover:cursor-pointer border-x-2 border-b-2 dark:border-[#312f66] ${
                        pathname == '/organizations'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      <p
                        className="opacity-70 hover:opacity-100 duration-200"
                        suppressHydrationWarning
                      >
                        {t('organizations')}
                      </p>
                    </div>
                  </Link>
                )}
                {showMenu && (
                  <Link
                    href="/vhrs"
                    aria-current={pathname == '/vhrs' ? 'page' : undefined}
                  >
                    <div
                      className={`flex justify-center px-10 py-5 bg-accent-content dark:bg-info-content hover:text-purple-600 hover:cursor-pointer border-x-2 border-b-2 dark:border-[#312f66] ${
                        pathname == '/vhrs'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      <p
                        className="opacity-70 hover:opacity-100 duration-200"
                        suppressHydrationWarning
                      >
                        {t('vhrs')}
                      </p>
                    </div>
                  </Link>
                )}
                {showMenu && auth && (
                  <Link
                    href="/dashboard"
                    aria-current={pathname == '/dashboard' ? 'page' : undefined}
                  >
                    <div
                      className={`flex justify-center px-10 py-5 bg-accent-content dark:bg-info-content hover:text-purple-600 hover:cursor-pointer border-x-2 border-b-2 dark:border-[#312f66] ${
                        pathname == '/dashboard'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      <p
                        className="opacity-70 hover:opacity-100 duration-200"
                        suppressHydrationWarning
                      >
                        {t('dashboard')}
                      </p>
                    </div>
                  </Link>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="flex">
        {!(screenSize == 'phone' || screenSize == 'smallPhone') && (
          <div className="flex w-[60] justify-around items-center">
            <Link
              href="/projects"
              aria-current={pathname == '/projects' ? 'page' : undefined}
            >
              <button>
                <div
                  className={`text-lg p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-violet-800 bg-opacity-80 hover:bg-opacity-80 tracking-wider ${
                    pathname == '/projects'
                      ? 'text-purple-500 bg-white dark:text-indigo-300 dark:bg-violet-950'
                      : 'text-black dark:text-sky-50'
                  } ${inter500.className}`}
                  suppressHydrationWarning
                >
                  {t('projects')}
                </div>
              </button>
            </Link>
            <Link
              href="/volunteers"
              aria-current={pathname == '/volunteers' ? 'page' : undefined}
            >
              <button>
                <div
                  className={`text-lg p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-violet-800 bg-opacity-80 hover:bg-opacity-80 tracking-wider ${
                    pathname == '/volunteers'
                      ? 'text-purple-500 bg-white dark:text-indigo-300 dark:bg-violet-950'
                      : 'text-black dark:text-sky-50'
                  } ${inter500.className}`}
                  suppressHydrationWarning
                >
                  {t('volunteers')}
                </div>
              </button>
            </Link>
            <Link
              href="/organizations"
              aria-current={pathname == '/organizations' ? 'page' : undefined}
            >
              <button>
                <div
                  className={`text-lg p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-violet-800 bg-opacity-80 hover:bg-opacity-80 tracking-wider ${
                    pathname == '/organizations'
                      ? 'text-purple-500 bg-white dark:text-indigo-300 dark:bg-violet-950'
                      : 'text-black dark:text-sky-50'
                  } ${inter500.className} ${auth ? '' : 'mr-4'}`}
                  suppressHydrationWarning
                >
                  {t('organizations')}
                </div>
              </button>
            </Link>
            <Link
              href="/vhrs"
              aria-current={pathname == '/vhrs' ? 'page' : undefined}
            >
              <button>
                <div
                  className={`text-lg p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-violet-800 bg-opacity-80 hover:bg-opacity-80 tracking-wider ${
                    pathname == '/vhrs'
                      ? 'text-purple-500 bg-white dark:text-indigo-300 dark:bg-violet-950'
                      : 'text-black dark:text-sky-50'
                  } ${inter500.className}`}
                  suppressHydrationWarning
                >
                  {t('vhrs')}
                </div>
              </button>
            </Link>
            {auth && (
              <Link
                href="/dashboard"
                aria-current={pathname == '/dashboard' ? 'page' : undefined}
              >
                <button>
                  <div
                    className={`text-lg p-3 rounded-lg mr-4 hover:bg-gray-100 dark:hover:bg-violet-800 bg-opacity-80 hover:bg-opacity-80 tracking-wider ${
                      pathname == '/dashboard'
                        ? 'text-purple-500 bg-white dark:text-indigo-300 dark:bg-violet-950'
                        : 'text-black dark:text-sky-50'
                    } ${inter500.className}`}
                    suppressHydrationWarning
                  >
                    {t('dashboard')}
                  </div>
                </button>
              </Link>
            )}
          </div>
        )}
        <div className="relative my-auto">
          <TranslateButton />
        </div>
        <div className="my-auto mr-4">
          <ThemeButton />
        </div>
        <div className="my-auto sm:mr-10 mr-4">
          <MenuItems />
        </div>
      </div>
    </div>
  )
}

export default Navbar
