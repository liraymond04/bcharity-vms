import { SetDispatcherRequest } from '@lens-protocol/client'
import React, { useState } from 'react'

import checkAuth from '@/lib/lens-protocol/checkAuth'
import lensClient from '@/lib/lens-protocol/lensClient'
import { useAppPersistStore } from '@/store/app'

const UserDispatcher: React.FC = () => {
  const { currentUser } = useAppPersistStore()
  const [isEnabled, setIsEnabled] = useState(currentUser?.dispatcher !== null)

  const handleDispatch = async () => {
    const params: SetDispatcherRequest = {
      profileId: currentUser!.id,
      enable: isEnabled
    }

    if (currentUser) {
      checkAuth(currentUser?.ownedBy)
        .then(() => {
          lensClient().profile.createSetDispatcherTypedData(params)
        })
        .then((result) => {
          console.log(result)
        })
        .catch((err) => console.log(err))
    }
  }

  return (
    <div className="container mx-auto px-40 py-40">
      <div
        className="rounded-lg shadow-l flex flex-col px-9 py-8 
          bg-[#D7BFFF] dark:bg-blue-500 outline outline-1 outline-gray-200 outline-offset-2"
      >
        <h1 className="text-2xl font-bold dark:text-gray-50">
          Enable dispatcher?
        </h1>
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
            Enable dispatcher
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDispatcher
