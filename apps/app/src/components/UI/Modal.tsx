import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import React, { FC, Fragment, ReactNode } from 'react'

/**
 * Properties of {@link Modal}
 */
export interface ModalProps {
  /**
   * Component to display as butotn icon
   */
  icon?: ReactNode
  /**
   * String of component title
   */
  title: ReactNode
  /**
   * size of the button to render
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Whether the modal should be shown
   */
  show: boolean
  /**
   * React components wrapped by the component
   */
  children: ReactNode[] | ReactNode
  /**
   * Function to run when the modal is closed
   * @returns
   */
  onClose: () => void
}

/**
 * Component that displays a popup modal.
 *
 * The component is hidden by default, and will be shown once its
 * `shown` property is set to true.
 *
 * @example Create component used in {@link components.Shared.Navbar.MenuItems}
 * ```tsx
 * <Modal
 *   title={t('create-profile')}
 *   show={showCreate}
 *   onClose={() => {
 *     setShowCreate(false)
 *   }}
 * >
 *   <div className="p-5">
 *     <Create isModal />
 *   </div>
 * </Modal>
 * ```
 */
export const Modal: FC<ModalProps> = ({
  icon,
  title,
  size = 'sm',
  show,
  children,
  onClose
}) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-50"
        onClose={onClose}
      >
        <div className="flex justify-center items-center p-4 min-h-screen text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              className={clsx(
                { 'sm:max-w-5xl': size === 'lg' },
                { 'sm:max-w-3xl': size === 'md' },
                { 'sm:max-w-lg': size === 'sm' },
                'inline-block align-bottom bg-accent-content dark:bg-Card text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full rounded-xl'
              )}
            >
              <div className="flex justify-between items-center py-3.5 px-5 custom-divider">
                <div className="flex items-center space-x-2 font-bold">
                  {icon}
                  <div suppressHydrationWarning>{title}</div>
                </div>
                <button
                  type="button"
                  className="p-1 text-gray-800 rounded-full dark:text-gray-100 hover:bg-accent-content dark:hover:bg-base-100"
                  onClick={onClose}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
