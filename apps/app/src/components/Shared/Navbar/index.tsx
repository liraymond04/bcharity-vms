import { Inter } from '@next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppPersistStore } from '@/store/app'

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
    <div className="sticky z-20 top-0 flex justify-between bg-white bg-opacity-80 max-h-20 border-b-2 border-gray-100">
      <div className="flex items-center">
        <Link href="/" aria-current={pathname == '/' ? 'page' : undefined}>
          <img
            className="m-5 h-10 w-10"
            src="/logo.jpg "
            alt="BCharity logo"
          ></img>
        </Link>
        {screenSize == 'wideDesktop' && (
          <div
            className={`m-5 text-2xl text-violet-800 tracking-wider ${inter500.className}`}
          >
            BCharity
          </div>
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
                    href="/causes"
                    aria-current={pathname == '/causes' ? 'page' : undefined}
                  >
                    <div
                      className={`flex justify-center opacity-90 px-10 py-5 bg-gray-100 hover:text-purple-600 hover:cursor-pointer border-x-2 border-y-2 mt-[26px] ${
                        pathname == '/causes' ? 'text-purple-600' : 'text-black'
                      } ${inter500.className}`}
                    >
                      CAUSES
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
                          : 'text-black'
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
                          : 'text-black'
                      } ${inter500.className}`}
                    >
                      ORGANIZATIONS
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
                          : 'text-black'
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
              href="/causes"
              aria-current={pathname == '/causes' ? 'page' : undefined}
            >
              <button>
                <div
                  className={`text-lg p-3 rounded-lg hover:bg-gray-100 tracking-wider ${
                    pathname == '/causes'
                      ? 'text-purple-500 bg-white'
                      : 'text-black'
                  } ${inter500.className}`}
                >
                  CAUSES
                </div>
              </button>
            </Link>
            <Link
              href="/volunteers"
              aria-current={pathname == '/volunteers' ? 'page' : undefined}
            >
              <button>
                <div
                  className={`text-lg p-3 rounded-lg hover:bg-gray-100 tracking-wider ${
                    pathname == '/volunteers'
                      ? 'text-purple-500 bg-white'
                      : 'text-black'
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
                  className={`text-lg p-3 rounded-lg hover:bg-gray-100 tracking-wider ${
                    pathname == '/organizations'
                      ? 'text-purple-500 bg-white'
                      : 'text-black'
                  } ${inter500.className} ${auth ? '' : 'mr-10'}`}
                >
                  ORGANIZATIONS
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
                    className={`text-lg p-3 rounded-lg mr-10 hover:bg-gray-100 tracking-wider ${
                      pathname == '/dashboard'
                        ? 'text-purple-500 bg-white'
                        : 'text-black'
                    } ${inter500.className}`}
                  >
                    DASHBOARD
                  </div>
                </button>
              </Link>
            )}
          </div>
        )}
        <div className="my-auto mr-10">
          <TranslateButton />
        </div>
        <div className="my-auto mr-10">
          <MenuItems />
        </div>
      </div>
    </div>
  )
}

export default Navbar
