import { PencilIcon } from '@heroicons/react/outline'
import { ProfileFragment } from '@lens-protocol/client'
import { useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import { ChangeEvent, FC, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useConfig } from 'wagmi'

import ChooseFile from '@/components/Shared/ChooseFile'
import { Button } from '@/components/UI/Button'
import { ErrorMessage } from '@/components/UI/ErrorMessage'
import { Spinner } from '@/components/UI/Spinner'
import { checkAuth, getSignature, lensClient } from '@/lib/lens-protocol'

/**
 * Properties of {@link Picture}
 */
export interface PictureProps {
  /**
   * Profile to set the profile picture of
   */
  profile: ProfileFragment | undefined
}

/**
 * Component that uses {@link ChooseFile} to select an image file to set as
 * the profile's profile picture.
 *
 * Uses {@link https://docs.lens.xyz/docs/create-set-profile-image-uri-typed-data | createSetProfileImageURITypedData}
 * to set the profile picture.
 */
const Picture: FC<PictureProps> = ({ profile }) => {
  const { mutateAsync: upload } = useStorageUpload()

  const { t } = useTranslation('common', {
    keyPrefix: 'components.settings.home.picture'
  })
  const [avatar, setAvatar] = useState<string>()
  const [uploading, setUploading] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setUploading(true)
    try {
      const attachment = (await upload({ data: [evt.target.files![0]] }))[0]
      if (attachment) {
        setAvatar(attachment)
      }
    } finally {
      setUploading(false)
    }
  }
  const config = useConfig()
  const editPicture = async (avatar: string | undefined) => {
    setIsLoading(true)
    try {
      await checkAuth(profile?.ownedBy?.address ?? '', profile?.id ?? '')
      if (!avatar) return toast.error(t('avatar-empty'))

      const typedDataResult =
        await lensClient().profile.createSetProfileMetadataTypedData({
          metadataURI: avatar
        })
      const signature = await signTypedData(
        config,
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcastOnchain({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      return broadcastResult
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className="space-y-1.5">
        {error && (
          <ErrorMessage
            className="mb-3"
            title={t('transaction-failed')}
            error={error}
          />
        )}
        <div className="space-y-3">
          {avatar && (
            <div>
              <img
                className="w-60 h-60 rounded-lg"
                height={240}
                width={240}
                src={avatar}
                alt={avatar}
              />
            </div>
          )}
          <div className="flex items-center space-x-3">
            <ChooseFile
              id="avatar"
              onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                handleUpload(evt)
              }
            />
            {uploading && <Spinner size="sm" />}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button
          className="ml-auto"
          type="submit"
          disabled={isLoading}
          onClick={() => editPicture(avatar)}
          icon={
            isLoading ? (
              <Spinner size="xs" />
            ) : (
              <PencilIcon className="w-4 h-4" />
            )
          }
        >
          {t('save')}
        </Button>
      </div>
    </>
  )
}

export default Picture
