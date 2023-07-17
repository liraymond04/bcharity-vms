import { Button } from '@components/UI/Button'
// import { TrashIcon } from '@heroicons/react/outline'
import { profileId } from '@lens-protocol/react-web'
import React, { MouseEvent } from 'react'

import { Card } from '@/components/UI/Card'
import lensClient from '@/lib/lens-protocol/lensClient.ts'

const burnProfileTypedDataResult =
  await lensClient.profile.createBurnProfileTypedData({
    profileId
  })

const DeleteProfileSection: React.FC = () => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    throw new Error('Function not implemented yet') //change this to delete after
  }

  return (
    <>
      <Card>
        <div className="flex justify-start items-start m-28 h-screen">
          <div className="bg-zinc-100 shadow-md shadow-gray-500 rounded-lg p-6 max-w-3-xl mx-auto">
            <div className="text-1-md font-bold text-black sm:text-4xl">
              Test Account (for now)
            </div>
            <div
              className="my-4 text-base font-semibold"
              style={{ color: 'red' }}
            >
              This will permanently delete your account.
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
                Some of your account information may still be available through
                search engines
              </li>
            </ul>
            <div className="flex justify-end">
              <Button
                onClick={handleClick}
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
              >
                Delete your account
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* const DeleteButton = ({onclick}) => {
        return (
      <button onClick={onclick} className="delete-button">
        Delete
      </button>
      ); */}
    </>
  )
}

export default DeleteProfileSection
