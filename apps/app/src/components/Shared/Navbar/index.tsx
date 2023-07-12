import { Inter } from '@next/font/google'
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
  const { pathname } = useRouter()
  const { isAuthenticated, currentUser } = useAppPersistStore()
  const [auth, setAuth] = useState<boolean>(false)

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }, [currentUser, isAuthenticated])

  // interface NavItemProps {
  //   url: string
  //   name: string
  //   current: boolean
  // }

  return (
    <div className="sticky z-20 top-0 flex justify-between bg-white bg-opacity-80 max-h-[16vh] border-b-2 border-gray-100">
      <div className="flex items-center">
        <img
          className="m-5 h-10 w-10"
          src="https://bcharity.vercel.app/logo.jpg "
          alt="BCharity logo"
        ></img>
        <div className={`m-5 text-2xl text-violet-800 ${inter500.className}`}>
          BCharity
        </div>
      </div>
      <div className="flex w-[70vw] justify-around items-center">
        <a href="/causes">
          <button>
            <div
              className={`text-lg p-3 rounded-lg ${
                pathname == '/causes'
                  ? 'text-purple-900 bg-gray-200'
                  : 'text-black'
              } ${inter500.className}`}
            >
              CAUSES
            </div>
          </button>
        </a>
        <a href="/volunteers">
          <button>
            <div
              className={`text-lg p-3 rounded-lg ${
                pathname == '/volunteers'
                  ? 'text-purple-900 bg-gray-200'
                  : 'text-black'
              } ${inter500.className}`}
            >
              VOLUNTEERS
            </div>
          </button>
        </a>
        <a href="/organizations">
          <button>
            <div
              className={`text-lg p-3 rounded-lg ${
                pathname == '/organizations'
                  ? 'text-purple-900 bg-gray-200'
                  : 'text-black'
              } ${inter500.className}`}
            >
              ORGANIZATIONS
            </div>
          </button>
        </a>
        {auth && (
          <a href="/dashboard">
            <button>
              <div
                className={`text-lg p-3 rounded-lg ${
                  pathname == '/dashboard'
                    ? 'text-purple-900 bg-gray-200'
                    : 'text-black'
                } ${inter500.className}`}
              >
                DASHBOARD
              </div>
            </button>
          </a>
        )}
      </div>
      <MenuItems />
    </div>
  )
}

export default Navbar
