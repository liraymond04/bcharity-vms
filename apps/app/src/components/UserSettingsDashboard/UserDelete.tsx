import { TrashIcon } from '@heroicons/react/outline'
import Cookies from 'js-cookie'
import React from 'react'
import { useDisconnect } from 'wagmi'

import { Card } from '@/components/UI/Card'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import lensClient from '@/lib/lens-protocol/lensClient'
import { useAppPersistStore } from '@/store/app'

import GradientWrapper from '../Shared/Gradient/GradientWrapper'

const DeleteProfileSection: React.FC = () => {
  const { currentUser, setCurrentUser, setIsAuthenticated } =
    useAppPersistStore()
  const { disconnect } = useDisconnect()
  const handleClick = (): void => {
    burnProfileTypedDataResult()
      .then((res) => {
        onCompleted()
      })
      .catch((err) => console.log(err))
  }

  const burnProfileTypedDataResult = async () => {
    console.log(currentUser!.id)
    await checkAuth(currentUser!.ownedBy)
    return lensClient().profile.createBurnProfileTypedData({
      profileId: currentUser!.id
    })
  }

  const onCompleted = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    localStorage.removeItem('lenster.store')
    if (disconnect) disconnect()
    location.href = '/'
  }

  return (
    <div>
      <Card>
        <GradientWrapper>
          <div className="pt-40 h-screen">
            <div className="bg-zinc-100 shadow-md shadow-gray-500 rounded-lg p-6 max-w-xl mx-auto">
              <div
                className="my-4 text-base font-bold"
                style={{ color: 'red' }}
              >
                WARNING: This will permanently delete your account.
              </div>
              <div className="mb-4 text-base">
                Deleting your account is permanent. Your data will be wiped and
                will not be recoverable.
              </div>
              <div className="mb-2 text-base">Upon deletion:</div>
              <ul className="mx-8 mb-5 text-gray-500 justify-left list-disc">
                <li>Your account will no longer be recoverable</li>
                <li>Your @handle will be immediately released</li>
                <li>
                  Some of your account information may still be available
                  through search engines
                </li>
              </ul>
              <div className="flex justify-end">
                <div
                  onClick={handleClick}
                  className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                >
                  <TrashIcon className="inline w-6 mr-2"></TrashIcon>
                  <p className="inline">Delete your account</p>
                </div>
              </div>
            </div>
          </div>
        </GradientWrapper>
      </Card>
    </div>
  )
}

export default DeleteProfileSection
