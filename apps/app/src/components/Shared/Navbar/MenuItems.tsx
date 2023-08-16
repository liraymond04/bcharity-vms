import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { Menu, Transition } from '@headlessui/react'
import {
  ArrowCircleRightIcon,
  CogIcon,
  LogoutIcon,
  PlusCircleIcon,
  SwitchHorizontalIcon,
  UserIcon
} from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { ProfileFragment as Profile } from '@lens-protocol/client'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GIT_COMMIT_SHA } from 'src/constants'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import { useDisconnect } from 'wagmi'

import getAvatar from '@/lib/getAvatar'
import isVerified from '@/lib/isVerified'

import Slug from '../Slug'
import Login from './Login'
import Create from './Login/Create'

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
)

const MenuItems: FC = () => {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)

  const { disconnect } = useDisconnect()

  const { profiles } = useAppStore()
  const { isAuthenticated, currentUser, setCurrentUser } = useAppPersistStore()

  const [auth, setAuth] = useState<boolean>(false)

  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.navbar.menuitems'
  })

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }, [currentUser, isAuthenticated])

  const [showCreate, setShowCreate] = useState<boolean>(false)

  return (
    <>
      {auth && currentUser ? (
        <Menu as="div">
          {({ open }) => (
            <>
              <Menu.Button
                as="img"
                src={getAvatar(currentUser)}
                className="w-8 h-8 rounded-full border cursor-pointer dark:border-gray-700/80"
                alt={currentUser?.handle}
              />
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="absolute right-0 py-1 mt-2 w-48 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
                >
                  <Menu.Item
                    as={NextLink}
                    href={`/settings`}
                    className={({ active }: { active: boolean }) =>
                      clsx({ 'dropdown-active': active }, 'menu-item')
                    }
                  >
                    <div suppressHydrationWarning>{t('logged-in')}</div>
                    <div className="truncate">
                      <Slug
                        className="font-bold"
                        slug={currentUser?.handle}
                        prefix="@"
                      />
                    </div>
                  </Menu.Item>
                  <div className="custom-divider" />
                  <Menu.Item
                    as={NextLink}
                    href={`/p/${
                      isVerified(currentUser?.id) ? 'organization' : 'volunteer'
                    }/${currentUser?.handle}`}
                    className={({ active }: { active: boolean }) =>
                      clsx({ 'dropdown-active': active }, 'menu-item')
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <UserIcon className="w-4 h-4" />
                      <div suppressHydrationWarning>{t('profile')}</div>
                    </div>
                  </Menu.Item>

                  <Menu.Item
                    as={NextLink}
                    href="/settings"
                    className={({ active }: { active: boolean }) =>
                      clsx({ 'dropdown-active': active }, 'menu-item')
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <CogIcon className="w-4 h-4" />
                      <div suppressHydrationWarning>{t('settings')}</div>
                    </div>
                  </Menu.Item>

                  <Menu.Item
                    as={NextLink}
                    href="/"
                    onClick={() => {
                      console.log(showCreate)
                      setShowCreate(true)
                    }}
                    className={({ active }: { active: boolean }) =>
                      clsx({ 'dropdown-active': active }, 'menu-item')
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <PlusCircleIcon className="w-4 h-4" />
                      <div suppressHydrationWarning>{t('create-profile')}</div>
                    </div>
                  </Menu.Item>
                  {profiles?.length > 1 && (
                    <>
                      <div className="custom-divider" />
                      <div className="overflow-auto m-2 max-h-36 no-scrollbar">
                        <div className="flex items-center px-4 pt-1 pb-2 space-x-1.5 text-sm font-bold text-gray-500">
                          <SwitchHorizontalIcon className="w-4 h-4" />
                          <div suppressHydrationWarning>{t('switch')}</div>
                        </div>
                        {profiles.map((profile: Profile, index: number) => (
                          <div
                            key={profile?.id}
                            className="block text-sm text-gray-700 rounded-lg cursor-pointer dark:text-gray-200"
                          >
                            <button
                              type="button"
                              className="flex items-center py-1.5 px-4 space-x-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => {
                                setCurrentUser(profiles[index])
                              }}
                            >
                              {currentUser?.id === profile?.id && (
                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              )}
                              <img
                                className="w-5 h-5 rounded-full border dark:border-gray-700/80"
                                height={20}
                                width={20}
                                src={getAvatar(profile)}
                                alt={profile?.handle}
                              />
                              <div className="truncate">{profile?.handle}</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="custom-divider" />
                  <Menu.Item
                    as={NextLink}
                    href="/"
                    onClick={() => {
                      if (
                        router.pathname === '/dashboard' ||
                        router.pathname === '/settings'
                      ) {
                        router.push('/')
                      }
                      setShowLoginModal(false)
                      setCurrentUser(null)
                      Cookies.remove('accessToken')
                      Cookies.remove('refreshToken')
                      localStorage.removeItem('bcharity.store')
                      if (disconnect) disconnect()
                    }}
                    className={({ active }: { active: boolean }) =>
                      clsx({ 'dropdown-active': active }, 'menu-item')
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <LogoutIcon className="w-4 h-4" />
                      <div suppressHydrationWarning>{t('logout')}</div>
                    </div>
                  </Menu.Item>

                  {currentUser && GIT_COMMIT_SHA && (
                    <>
                      <div className="custom-divider" />
                      <div className="py-3 px-6 text-xs flex items-center space-x-2">
                        <Link
                          href={`https://gitlab.com/bcharity/bcharity/-/commit/${GIT_COMMIT_SHA}`}
                          className="font-mono"
                          title="Git commit SHA"
                          target="_blank"
                          rel="noreferrer noopener"
                        ></Link>
                      </div>
                    </>
                  )}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      ) : (
        <>
          <Modal
            title={t('login')}
            icon={<ArrowCircleRightIcon className="w-5 h-5 text-brand" />}
            show={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          >
            <Login />
          </Modal>
          <Button
            icon={
              <img
                className="mr-0.5 w-4 h-4"
                height={16}
                width={16}
                src="/lens.png"
                alt="Lens Logo"
              />
            }
            onClick={() => {
              setShowLoginModal(!showLoginModal)
            }}
          >
            {t('login')}
          </Button>
        </>
      )}
      <Modal
        title={t('create-profile')}
        show={showCreate}
        onClose={() => {
          setShowCreate(false)
        }}
      >
        <div className="p-5">
          <Create isModal />
        </div>
      </Modal>
    </>
  )
}

export default MenuItems
