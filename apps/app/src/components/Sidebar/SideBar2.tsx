import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import { useDisconnect } from 'wagmi'

import getAvatar from '@/lib/getAvatar'

import TabTitle from './TabTile'

export interface ITabProps {
  icon: React.ReactElement
  label: string
}

interface ISidebarProps {
  emptyTop?: boolean
  selectedIndex: number
  setSelectedIndex: (i: number) => void
  tabs: ITabProps[]
}

const Sidebar2: React.FC<ISidebarProps> = ({
  emptyTop,
  selectedIndex,
  setSelectedIndex,
  tabs
}) => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const { pathname } = useRouter()
  const { disconnect } = useDisconnect()

  const { profiles } = useAppStore()
  const { isAuthenticated, currentUser, setCurrentUser } = useAppPersistStore()

  const [auth, setAuth] = useState<boolean>(false)

  const { t } = useTranslation('common')

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }, [currentUser, isAuthenticated])

  return auth && currentUser ? (
    <div className="w-sidebar from-violet-400 to-violet-300 dark:from-violet-800 dark:to-violet-500 bg-gradient-to-b min-h-screen">
      <div className="flex flex-row ...">
        <button
          type="button"
          className="text-white ml-5 mt-5 mb-5 w-10 h-10 bg-opacity-0 bg-transparent hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-transparent dark:hover:bg-blue-200 dark:focus:ring-blue-300"
        >
          <svg
            className="w-5 h-5 rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
          <span className="sr-only">Icon description</span>
        </button>
        <div className="ml-20 mr-12"></div>
        <img
          className=" w-10 h-10 mt-7 rounded-full"
          src={getAvatar(currentUser)}
          alt="Rounded avatar"
        />
      </div>

      <div className="flex flex-col">
        {tabs.map((tab, i) => {
          return (
            <TabTitle
              key={i}
              selected={i === selectedIndex}
              onClick={() => setSelectedIndex(i)}
              {...tab}
            />
          )
        })}
      </div>
    </div>
  ) : (
    <div>
      <h1>bruuh rip</h1>
    </div>
  )
}

export default Sidebar2
