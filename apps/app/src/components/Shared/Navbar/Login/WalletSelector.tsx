import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { XCircleIcon } from '@heroicons/react/solid'
import getWalletLogo from '@/lib/getWalletLogo'
import Logger from '@/lib/logger'
import clsx from 'clsx'
import React, { Dispatch, FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork
} from 'wagmi'

import { useProfilesOwnedBy, useWalletLogin } from '@lens-protocol/react-web'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CHAIN_ID } from '@/constants'

interface Props {
  setHasConnected: Dispatch<boolean>
  setHasProfile: Dispatch<boolean>
}

const WalletSelector: FC<Props> = ({ setHasConnected, setHasProfile }) => {
  const { setProfiles } = useAppStore()
  const { setIsAuthenticated, setCurrentUser } = useAppPersistStore()

  const { chain } = useNetwork()

  const [mounted, setMounted] = useState(false)

  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending
  } = useWalletLogin()

  const { isConnected, connector: activeConnector } = useAccount()
  const { disconnectAsync } = useDisconnect()

  const { connectors, error, connectAsync } = useConnect()
  const [authAddress, setAuthAddress] = useState<string>('')
  const { data: profiles } = useProfilesOwnedBy({
    address: authAddress
  })

  const { t } = useTranslation('common')

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector })
      if (account) {
        setHasConnected(true)
      }
    } catch (error) {
      Logger.warn('[Sign Error]', error)
    }
  }

  const onLoginClick = async (connector: Connector) => {
    if (isConnected) {
      await disconnectAsync()
    }

    const { connector: connect } = await connectAsync({ connector })

    if (connect instanceof InjectedConnector) {
      const walletClient = await connect.getWalletClient()
      const auth = await login({
        address: walletClient.account.address
      })
      if (auth.isSuccess()) setAuthAddress(walletClient.account.address)
    }
  }

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (profiles) {
      if (profiles.length === 0) {
        setHasProfile(false)
      } else {
        setIsAuthenticated(true)
        setProfiles(profiles)
        setCurrentUser(profiles[0])
      }
    }
  }, [profiles])

  return activeConnector?.id ? (
    <div className="space-y-3">
      {chain?.id === CHAIN_ID ? (
        <Button
          size="lg"
          icon={
            <img
              className="mr-1 w-5 h-5"
              height={20}
              width={20}
              src="/lens.png"
              alt="Lens Logo"
            />
          }
          onClick={() => onLoginClick(activeConnector)}
        >
          {t('Sign-In with Lens')}
        </Button>
      ) : (
        <SwitchNetwork />
      )}
      {loginError && (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="w-5 h-5" />
          <div>{loginError.message}</div>
        </div>
      )}
    </div>
  ) : (
    <div className="space-y-3">
      {connectors.map((connector) => {
        return (
          <button
            type="button"
            key={connector.id}
            className={clsx(
              {
                'hover:bg-gray-100 dark:hover:bg-gray-700':
                  connector.id !== activeConnector?.id
              },
              'w-full flex items-center space-x-2.5 justify-center px-4 py-3 overflow-hidden rounded-xl border dark:border-gray-700/80 outline-none'
            )}
            onClick={() => onConnect(connector)}
            disabled={
              mounted
                ? !connector.ready || connector.id === activeConnector?.id
                : false
            }
          >
            <span className="flex justify-between items-center w-full">
              {mounted
                ? connector.id === 'injected'
                  ? t('Browser Wallet')
                  : connector.name
                : connector.name}
              {mounted ? !connector.ready && ' (unsupported)' : ''}
            </span>
            <img
              src={getWalletLogo(connector.name)}
              draggable={false}
              className="w-6 h-6"
              height={24}
              width={24}
              alt={connector.id}
            />
          </button>
        )
      })}
    </div>
  )
}

export default WalletSelector
