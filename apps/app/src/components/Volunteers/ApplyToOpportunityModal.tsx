import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import Link from 'next/link'
import { FC, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { TextArea } from '../UI/TextArea'

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
)

const ApplyToOpportunityModal: FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.volunteers.apply-to-opportunity-modal'
  })
  const [showModal, setShowModal] = useState<boolean>(false)

  function setImage(arg0: File | null): void {
    throw new Error('Function not implemented.')
  }

  return (
    <Modal
      show={showModal}
      title=""
      size="lg"
      onClose={() => setShowModal(false)}
    >
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
            className="flex flex-col items-center justify-left w-2/3 h-26 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
        <Button
          className=" shrink-0 text-2xl my-5 w-52 h-16 align-middle"
          suppressHydrationWarning
        >
          {t('submit')}
        </Button>
      </div>
    </Modal>
  )
}

export default ApplyToOpportunityModal
