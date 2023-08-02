import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { t } from 'i18next'
import Link from 'next/link'
import { FC, Fragment, useState } from 'react'

import Progress from '@/components/Shared/Progress'
import { Input } from '@/components/UI/Input'

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
)

const DonateToCauseModal: FC = () => {
  const [showModal, setShowModal] = useState<boolean>(true)

  return (
    <>
      <Modal
        show={showModal}
        title=""
        size="lg"
        onClose={() => setShowModal(false)}
      >
        <div className="pl-10">
          <div className="flex flex-row ">
            <div className="text-purple-500 text-5xl font-bold">
              Donate to Cause
            </div>
          </div>
          <div className="text-gray-500  mt-10 text-2xl font-bold">
            Organization Name
          </div>
          <Progress progress={10} total={50} className="mt-10 mb-10  mr-10" />
          <div className="text-2xl font-normal text-black dark:text-white sm:text-2x l">
            <div className="flex flex-row font-semibold">
              <div className="mr-3 text-purple-600 font-semibold">$10000</div>{' '}
              raised of 100000!
            </div>
            <div className="flex flex-row">
              <Input
                label={t('Contribution')}
                type="number"
                step="0.0001"
                min="0"
                max="100000"
                className=" w-11/12 h-16 font-bold text-xl"
                placeholder="1e10+1"
              />
              <Button className="mt-9 mr-28 w-36 h-16">SET</Button>
            </div>
            <div className="flex items-center mt-12 mb-8">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-checkbox"
                className="ml-2 text-med font-medium text-gray-900 dark:text-gray-300"
              >
                I agree to this fee being collected for donation
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {' '}
          <Button className=" shrink-0 text-3xl  mt-8 mb-12 w-96 h-16  align-middle">
            Donate Now
          </Button>
        </div>
      </Modal>
      s
    </>
  )
}

export default DonateToCauseModal
