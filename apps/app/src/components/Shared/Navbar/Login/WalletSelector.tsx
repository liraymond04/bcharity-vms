import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { XCircleIcon } from '@heroicons/react/solid'
import { ProfileFragment } from '@lens-protocol/client'
import { getWalletClient, signMessage } from '@wagmi/core'
import clsx from 'clsx'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi'

import { CHAIN_ID } from '@/constants'
import { config } from '@/lib/config'
import getWalletLogo from '@/lib/getWalletLogo'
import { getProfilesOwnedBy, lensClient } from '@/lib/lens-protocol'
import Logger from '@/lib/logger'

/**
 * A component to connect wallet addresses through services such as
 * {@link https://metamask.io/ | Metamask} and {@link https://walletconnect.com/ | WalletConnect}
 */
const WalletSelector: FC = () => {
  const { chain } = useAccount()

  const { isConnected, connector: activeConnector } = useAccount()
  const { disconnectAsync } = useDisconnect()

  const { connectors, connectAsync, error, isPending } = useConnect()

  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.navbar.login.wallet-selector'
  })

  const onConnect = async (connector: Connector) => {
    try {
      await connectAsync({ connector })
      console.log('hj')
      try {
        setLoginError(false)

        // const walletClient = await connect.getWalletClient()
        const walletClient = await getWalletClient(config)
        const address = walletClient.account.address

        const challenge = await lensClient().authentication.generateChallenge({
          signedBy: address
        })

        // Get signature
        const signature = await signMessage(config, {
          message: challenge.text
        })

        await lensClient().authentication.authenticate({
          id: challenge.id,
          signature
        })

        if (await lensClient().authentication.isAuthenticated()) {
          const profiles = await getProfilesOwnedBy(address)
          _setProfiles(profiles)
        } else {
          setLoginErrorMessage('Add profile failed')
          setLoginError(true)
        }
      } catch (e: any) {
        setLoginErrorMessage(e.message)
        setLoginError(true)
      }
    } catch (error) {
      Logger.warn('[Sign Error]', error)
    }
  }

  const [loginError, setLoginError] = useState<boolean>(false)
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('')
  const [profiles, _setProfiles] = useState<ProfileFragment[]>()

  const onLoginClick = async (connector: Connector) => {
    if (isConnected) {
      await disconnectAsync()
    }

    // if (connect instanceof InjectedConnector) {
    try {
      setLoginError(false)

      // const walletClient = await connect.getWalletClient()
      const walletClient = await getWalletClient(config)
      const address = walletClient.account.address

      const challenge = await lensClient().authentication.generateChallenge({
        signedBy: address
      })

      // Get signature
      const signature = await signMessage(config, {
        message: challenge.text
      })

      await lensClient().authentication.authenticate({
        id: challenge.id,
        signature
      })

      if (await lensClient().authentication.isAuthenticated()) {
        const profiles = await getProfilesOwnedBy(address)
        _setProfiles(profiles)
      } else {
        setLoginErrorMessage('Add profile failed')
        setLoginError(true)
      }
    } catch (e: any) {
      setLoginErrorMessage(e.message)
      setLoginError(true)
    }
    // }
  }

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
          onClick={() => {
            onLoginClick(activeConnector)
          }}
        >
          {t('sign-in')}
        </Button>
      ) : (
        <SwitchNetwork />
      )}
      {error?.message && (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="w-5 h-5" />
          <div>{error?.message || 'Failed to connect'}</div>
        </div>
      )}
    </div>
  ) : (
    <div className="space-y-3">
      {connectors
        .filter(
          (connector: any, index: number, self: any) =>
            self.findIndex((c: any) => c.type === connector.type) === index
        )
        .map((connector) => {
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
              disabled={connector.id === activeConnector?.id || isPending}
            >
              <span
                className="flex justify-between items-center w-full"
                suppressHydrationWarning
              >
                {connector.id === 'injected' ? t('browser') : connector.name}
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
