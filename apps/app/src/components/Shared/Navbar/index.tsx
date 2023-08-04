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
    if (window.innerWidth >= 1050) {
      setScreenSize('wideDesktop')
    } else if (window.innerWidth >= 870) {
      setScreenSize('smallDesktop')
    } else {
      setScreenSize('phone')
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
  const { t } = useTranslation('common')
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
    <div className="sticky z-20 top-0 flex justify-between bg-white dark:bg-indigo-950 bg-opacity-80 max-h-20 border-b-2 border-gray-100 dark:border-violet-950">
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
          >
            BCharity
          </Link>
        )}
        {screenSize == 'phone' && (
          <div className="absolute left-20 top-7">
            <div className="flex-col items-center justify-center">
              <ul>
                <li onClick={displayWindow} className="hover:cursor-pointer">
                  <div
                    className={`w-8 h-1 my-1 rounded-sm" ${
                      showMenu ? 'bg-gray-400' : 'bg-black'
                    }`}
                  ></div>
                  <div
                    className={`w-8 h-1 my-1 rounded-sm " ${
                      showMenu ? 'bg-gray-400' : 'bg-black'
                    }`}
                  ></div>
                  <div
                    className={`w-8 h-1 my-1 rounded-sm " ${
                      showMenu ? 'bg-gray-400' : 'bg-black'
                    }`}
                  ></div>
                </li>
                {showMenu && (
                  <Link
                    href="/projetcs"
                    aria-current={pathname == '/projects' ? 'page' : undefined}
                  >
                    <div
                      className={`flex justify-center opacity-90 px-10 py-5 bg-gray-100 hover:text-purple-600 hover:cursor-pointer border-x-2 border-y-2 mt-[26px] ${
                        pathname == '/projects'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      PROJECTS
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
                      className={`flex justify-center opacity-90 px-10 py-5 bg-gray-100 hover:text-purple-600 hover:cursor-pointer border-x-2 border-b-2 ${
                        pathname == '/volunteers'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      VOLUNTEERS
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
                      className={`flex justify-center opacity-90 px-10 py-5 bg-gray-100 hover:text-purple-600 hover:cursor-pointer border-x-2 border-b-2 ${
                        pathname == '/organizations'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      ORGANIZATIONS
                    </div>
                  </Link>
                )}
                {showMenu && auth && (
                  <Link
                    href="/vhrs"
                    aria-current={pathname == '/vhrs' ? 'page' : undefined}
                  >
                    <div
                      className={`flex justify-center opacity-90 px-10 py-5 bg-gray-100 hover:text-purple-600 hover:cursor-pointer border-x-2 border-b-2 ${
                        pathname == '/vhrs'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      VHRs
                    </div>
                  </Link>
                )}
                {showMenu && auth && (
                  <Link
                    href="/dashboard"
                    aria-current={pathname == '/dashboard' ? 'page' : undefined}
                  >
                    <div
                      className={`flex justify-center opacity-90 px-10 py-5 bg-gray-100 hover:text-purple-600 hover:cursor-pointer border-x-2 border-b-2 ${
                        pathname == '/dashboard'
                          ? 'text-purple-600'
                          : 'text-black dark:text-sky-50'
                      } ${inter500.className}`}
                    >
                      DASHBOARD
                    </div>
                  </Link>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="flex">
        {!(screenSize == 'phone') && (
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
                >
                  PROJECTS
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
                >
                  VOLUNTEERS
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
                  } ${inter500.className} ${auth ? '' : 'mr-10'}`}
                >
                  ORGANIZATIONS
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
                >
                  VHRs
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
                    className={`text-lg p-3 rounded-lg mr-10 hover:bg-gray-100 dark:hover:bg-violet-800 bg-opacity-80 hover:bg-opacity-80 tracking-wider ${
                      pathname == '/dashboard'
                        ? 'text-purple-500 bg-white dark:text-indigo-300 dark:bg-violet-950'
                        : 'text-black dark:text-sky-50'
                    } ${inter500.className}`}
                  >
                    DASHBOARD
                  </div>
                </button>
              </Link>
            )}
          </div>
        )}
        <div className="relative my-auto mr-10">
          <TranslateButton />
        </div>
        <div className="my-auto mr-10">
          <ThemeButton />
        </div>
        <div className="my-auto mr-10">
          <MenuItems />
        </div>
      </div>
    </div>
  )
}

export default Navbar
