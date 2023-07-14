import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import { useTheme } from 'next-themes'
import React from 'react'
import { Fragment } from 'react'

import { Button } from '@/components/UI/Button'

import GradientWrapper from '../Gradient/GradientWrapper'

interface IGradientModalProps {
  title: string
  open: boolean
  onCancel: () => void
  onSubmit: () => void
  submitDisabled?: boolean
  children: React.ReactNode
}

const GradientModal: React.FC<IGradientModalProps> = ({
  title,
  open,
  onCancel,
  onSubmit,
  submitDisabled = false,
  children
}) => {
  const { theme } = useTheme()

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-20 overflow-scroll"
        onClose={onCancel}
      >
        <div className="flex justify-center items-center mx-16 min-h-screen sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity">
              <GradientWrapper className="h-full">
                <div className="fixed inset-0 transition-opacity h-full"></div>
              </GradientWrapper>
            </Dialog.Overlay>
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block bg-white dark:bg-gray-800 shadow-xl 
              transform transition-all sm:my-8 sm:align-middle w-full rounded-xl 
              font-sans"
            >
              <div className="flex justify-between items-center py-3.5 px-5 divider">
                <div className="flex items-center space-x-2 text-lg">
                  <div>{title}</div>
                </div>
                <button
                  className="p-1 text-gray-800 rounded-full dark:text-gray-100 
                          hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={onCancel}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="py-4 divider">{children}</div>
              <div className="flex px-4 py-3 justify-between">
                <Button
                  onClick={onSubmit}
                  className={`${
                    submitDisabled
                      ? 'bg-gray-400 hover:bg-gray-400 !border-black'
                      : ''
                  } px-6 py-2 font-medium`}
                  disabled={submitDisabled}
                >
                  Submit
                </Button>
                <Button
                  onClick={onCancel}
                  variant="secondary"
                  className="px-6 py-2 font-medium"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default GradientModal
