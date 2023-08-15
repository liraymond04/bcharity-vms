import { useSDK } from '@thirdweb-dev/react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import {
  ChangeEventHandler,
  ComponentProps,
  forwardRef,
  ReactNode,
  useId,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'

const HelpTooltip = dynamic(() => import('./HelpTooltip'))

interface Props extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string
  className?: string
  helper?: ReactNode
  error?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  name?: string
  defaultImageIPFS?: string
}

export const FileInput = forwardRef<HTMLInputElement, Props>(function Input(
  {
    label,
    type = 'file',
    error,
    className = '',
    helper,
    defaultImageIPFS,
    onChange,
    ...props
  },
  ref
) {
  const id = useId()
  const { t } = useTranslation('common')

  const SDK = useSDK()

  const [selectedFileName, setSelectedFileName] = useState('')

  const getStatus = () => {
    if (selectedFileName) {
      return `Selected file: ${selectedFileName}`
    } else if (defaultImageIPFS) {
      if (!SDK) return ''

      const scheme = decodeURI(SDK.storage.resolveScheme(defaultImageIPFS))

      const filename = scheme?.substring(scheme.lastIndexOf('/') + 1)
      return (
        <a
          href={SDK.storage.resolveScheme(defaultImageIPFS)}
          className="hover:underline"
          target="_blank"
        >
          Existing file: {filename}
        </a>
      )
    } else return 'No file selected.'
  }

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    setSelectedFileName(file.name)

    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className="">
      <div className="w-full">
        {label && (
          <div className="flex items-center mb-1 space-x-1.5">
            <div className="font-medium text-gray-800 dark:text-gray-200">
              <span
                style={{
                  width: '500px',
                  float: 'right',
                  marginRight: '-400px'
                }}
              >
                {label}
              </span>
            </div>

            <HelpTooltip content={helper} />
          </div>
        )}
      </div>
      <div
        className={`${clsx(
          { '!border-red-500 placeholder-red-500': error },
          {
            'opacity-60 bg-base-100 bg-opacity-20': props.disabled
          },
          'rounded-xl bg-accent-content dark:bg-front border border-gray-300 dark:border-gray-700/80',
          className
        )} flex min-w-0`}
      >
        <label
          htmlFor={id}
          className="shrink-0 border border-grey-300 rounded-xl mr-3 focus:border-brand-500 focus:ring-brand-400 "
        >
          <input
            id={id}
            className="hidden"
            type={type}
            ref={ref}
            onChange={onFileChange}
            {...props}
          />
          <span
            className={`px-3 py-2 ${!props.disabled ? ' cursor-pointer' : ''}`}
          >
            Select a file
          </span>
        </label>
        <p className="overflow-hidden whitespace-nowrap overflow-ellipsis">
          {getStatus()}
        </p>
      </div>
    </div>
  )
})
