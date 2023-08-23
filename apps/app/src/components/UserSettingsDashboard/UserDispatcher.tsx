import { SetDispatcherRequest } from '@lens-protocol/client'
import { signTypedData } from '@wagmi/core'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  checkAuth,
  getProfile,
  getSignature,
  lensClient
} from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import { Spinner } from '../UI/Spinner'

/**
 * Component that displays a tab page for enabling/disabling the Lens dispatcher.
 * The dispatcher allows users to create posts without signing every transaction.
 *
 * Enabling/disabling the dispatcher is handled with the Lens client {@link https://docs.lens.xyz/docs/dispatcher | createSetDispatcherTypedData} method.
 */
const UserDispatcher: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.settings.dispatcher'
  })
  const { currentUser } = useAppPersistStore()
  const [isEnabled, setIsEnabled] = useState(currentUser?.dispatcher !== null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const _getProfile = async () => {
      if (currentUser) {
        const profile = await getProfile({ id: currentUser.id })
        setIsEnabled(profile?.dispatcher !== null)
        setIsLoading(false)
      }
    }
    _getProfile()
  }, [currentUser])

  const handleDispatch = async () => {
    setIsLoading(true)
    const params: SetDispatcherRequest = {
      profileId: currentUser!.id,
      enable: !isEnabled
    }

    if (currentUser) {
      try {
        await checkAuth(currentUser?.ownedBy)

        const typedDataResult =
          await lensClient().profile.createSetDispatcherTypedData(params)

        const signature = await signTypedData(
          getSignature(typedDataResult.unwrap().typedData)
        )

        const broadcastResult = await lensClient().transaction.broadcast({
          id: typedDataResult.unwrap().id,
          signature: signature
        })

        setIsEnabled(!isEnabled)
      } catch (e) {
        console.log(e)
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-40 py-40">
      <div
        className="rounded-lg shadow-l flex flex-col px-9 py-8 
          bg-[#D7BFFF] dark:bg-Card outline outline-1 outline-gray-200 outline-offset-2"
      >
        <h1 className="text-2xl font-bold" suppressHydrationWarning>
          {t('title')}
        </h1>
        <h1 className="text-lg font-medium" suppressHydrationWarning>
          {t('description')}
        </h1>
        <div className="flex flex-col items-center justify-center">
          <button
            className="px-10 mt-8 py-2 bg-primary text-white
            font-normal rounded-md text-lg flex flex-row w-2/5 justify-center
             items-center outline outline-[#8153E4]"
            onClick={handleDispatch}
            disabled={isLoading}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2" />
              <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" />
            </svg>
            {isLoading ? (
              <Spinner />
            ) : (
              <div suppressHydrationWarning>
                {isEnabled ? t('disable') : t('enable')} {t('dispatcher')}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDispatcher
