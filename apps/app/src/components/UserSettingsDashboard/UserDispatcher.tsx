import { SetDispatcherRequest } from '@lens-protocol/client'
import { signTypedData } from '@wagmi/core'
import React, { useEffect, useState } from 'react'

import checkAuth from '@/lib/lens-protocol/checkAuth'
import getProfile from '@/lib/lens-protocol/getProfile'
import getSignature from '@/lib/lens-protocol/getSignature'
import lensClient from '@/lib/lens-protocol/lensClient'
import { useAppPersistStore } from '@/store/app'

import { Spinner } from '../UI/Spinner'

const UserDispatcher: React.FC = () => {
  const { currentUser } = useAppPersistStore()
  const [isEnabled, setIsEnabled] = useState(currentUser?.dispatcher !== null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const _getProfile = async () => {
      if (currentUser) {
        const profile = await getProfile({ id: currentUser.id })
        console.log(profile?.dispatcher)
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
          bg-[#D7BFFF] dark:bg-blue-500 outline outline-1 outline-gray-200 outline-offset-2"
      >
        <h1 className="text-2xl font-bold">Enable dispatcher?</h1>
        <h1 className="text-lg font-medium">
          We suggest enabling dispatcher so that your transactions in BCharity
          don't need to be signed.
        </h1>
        <div className="flex flex-col items-center justify-center">
          <button
            className="px-10 mt-8 py-2 bg-[#9969FF] text-gray-50
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
              <div>{isEnabled ? 'Disable' : 'Enable'} dispatcher</div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDispatcher
