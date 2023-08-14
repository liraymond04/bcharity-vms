import clsx from 'clsx'
import dynamic from 'next/dynamic'
import {
  ChangeEventHandler,
  ComponentProps,
  forwardRef,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'

import { FieldError } from './Form'

const HelpTooltip = dynamic(() => import('./HelpTooltip'))

interface Props extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string
  prefix?: string | ReactNode
  className?: string
  helper?: ReactNode
  error?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  name?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, prefix, type = 'text', error, className = '', helper, ...props },
  ref
) {
  const id = useId()
  const { t } = useTranslation('common')

  const [checked, setChecked] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      const el = inputRef.current.children[0] as HTMLInputElement
      setChecked(el.disabled)
    }
  }, [inputRef])

  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div className="font-medium text-gray-800 dark:text-gray-200">
            <label
              style={{
                width: '500px',
                float: 'right',
                marginRight: '-400px'
              }}
              suppressHydrationWarning
            >
              {label}
            </label>
          </div>
          <div className="flex items-center">
            {type === 'endDate' && (
              <>
                <input
                  type="checkbox"
                  style={{ position: 'relative' }}
                  checked={checked}
                  onChange={(e) => {
                    if (!props.onChange) return
                    setChecked(!checked)
                    props.onChange(e)
                  }}
                />
                <label className="ml-2" style={{ position: 'relative' }}>
                  {t('Ongoing')}
                </label>
              </>
            )}
          </div>

          <HelpTooltip content={helper} />
        </div>
      )}
      <div className="flex" ref={inputRef}>
        {prefix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 dark:bg-Input rounded-l-xl border border-r-0 border-gray-300 roun xl dark:border-gray-700/80">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className={clsx(
            { '!border-red-500 placeholder-red-500': error },
            { 'rounded-r-xl': prefix },
            { 'rounded-xl': !prefix },
            'bg-white dark:bg-front border border-gray-300 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full',
            className
          )}
          type={type === 'endDate' ? 'date' : type}
          ref={ref}
          {...props}
        />
      </div>
      {props.name && <FieldError name={props.name} />}
    </label>
  )
})
