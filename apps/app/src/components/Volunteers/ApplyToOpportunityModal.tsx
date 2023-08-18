import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import Link from 'next/link'
import { FC, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { checkAuth, useCreateComment } from '@/lib/lens-protocol'
import { buildMetadata, PostTags } from '@/lib/metadata'
import { ApplicationMetadataRecord } from '@/lib/metadata/ApplicationMetadata'
import { MetadataVersion } from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

import { FileInput } from '../UI/FileInput'
import { TextArea } from '../UI/TextArea'

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
)

const ApplyToOpportunityModal: FC<{
  id: string
  open: boolean
  onClose: VoidFunction
}> = ({ id, open, onClose }) => {
  const { createComment } = useCreateComment()
  const { mutateAsync: upload } = useStorageUpload()
  const sdk = useSDK()

  const { t } = useTranslation('common', {
    keyPrefix: 'components.volunteers.apply-to-opportunity-modal'
  })
  const [resume, setResume] = useState<File>()

  const { currentUser } = useAppPersistStore()

  const onSubmit = async () => {
    if (!currentUser || !sdk || !resume) return

    const link = sdk.storage.resolveScheme(
      (await upload({ data: [resume] }))[0]
    )

    const metadata = buildMetadata<ApplicationMetadataRecord>(
      currentUser,
      [PostTags.Application.Apply],
      {
        description: 'test desc',
        resume: link,
        manual: 'false',
        version: MetadataVersion.ApplicationMetadataVersion['1.0.0'],
        type: PostTags.Application.Apply
      }
    )

    await checkAuth(currentUser.ownedBy)
    await createComment({
      publicationId: id,
      profileId: currentUser.id,
      metadata
    })
  }

  return (
    <Modal show={open} title="" size="lg" onClose={onClose}>
      <div className="px-10 py-4 flex flex-col space-y-4">
        <div className="flex flex-row ">
          <div
            className="text-purple-500 text-5xl font-bold"
            suppressHydrationWarning
          >
            {t('title')}
          </div>
        </div>
        <div className="text-3xl font-semibold" suppressHydrationWarning>
          {t('upload')}
        </div>
        <div className="flex items-center justify-left w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-left w-2/3 h-26 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-accent-content dark:hover:bg-bray-800 dark:bg-base-100 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p
                className="mb-2 text-sm text-gray-500 dark:text-gray-400"
                suppressHydrationWarning
              >
                <span className="font-semibold" suppressHydrationWarning>
                  {t('click-to-upload')}
                </span>{' '}
                {t('drag-and-drop')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF </p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>
        <div className="">
          <label
            htmlFor="large-input"
            className="block mb-2 text-3xl font-semibold"
            suppressHydrationWarning
          >
            {t('description')}
          </label>
          <TextArea placeholder={'Add a description here'} />
        </div>
      </div>
      <div className="flex items-center justify-center">
        {' '}
        <FileInput
          label="upload your resume"
          onChange={(e) => {
            setResume(e.target.files?.item(0) ?? undefined)
          }}
        />
        <Button
          className=" shrink-0 text-2xl my-5 w-52 h-16 align-middle"
          suppressHydrationWarning
          onClick={() => onSubmit()}
        >
          {t('submit')}
        </Button>
      </div>
    </Modal>
  )
}

export default ApplyToOpportunityModal
