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

/**
 * Properties of {@link Input} that extends an HTML input element
 */
export interface InputProps extends Omit<ComponentProps<'input'>, 'prefix'> {
  /**
   * String of label to display in front of input component
   */
  label?: string
  /**
   * String or component to display in front of input component
   */
  prefix?: string | ReactNode
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
  /**
   * Component of help tooltip to display
   */
  helper?: ReactNode
  /**
   * Whether the input has an error
   */
  error?: boolean
  /**
   * Function to run when the input component has changed
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * String of input component name
   */
  name?: string
  /**
   * String of default IPFS URL for file selection
   */
  defaultValue?: string
}

/**
 * Component that displays a styled input component, that extends a
 * default HTML input component.
 *
 * Passing in an additional type property with "endDate" adds a custom
 * "Ongoing" checkbox component. The ongoing checkbox component disables
 * the date picker.
 *
 * @example String input used in {@link components.Dashboard.Modals.PublishOpportunityModal}
 * ```tsx
 * <Input
 *   label={t('end-date')}
 *   type="endDate"
 *   value={values.endDate}
 *   disabled
 * />
 * ```
 *
 * @example Number input with regex validation used in {@link components.Dashboard.Modals.PublishOpportunityModal}
 * ```tsx
 * <Input
 *   label={t('hours')}
 *   placeholder="5.5"
 *   error={!!errors.hoursPerWeek?.type}
 *   {...register('hoursPerWeek', {
 *     required: true,
 *     pattern: {
 *       value: /^(?!0*[.,]0*$|[.,]0*$|0*$)\d+[,.]?\d{0,1}$/,
 *       message: t('hours-invalid')
 *     }
 *   })}
 * />
 * ```
 *
 * @example Date input used in {@link components.Dashboard.Modals.PublishOpportunityModal}
 * ```tsx
 * <Input
 *   label={t('start-date')}
 *   type="date"
 *   placeholder="yyyy-mm-dd"
 *   min={new Date().toLocaleDateString()}
 *   error={!!errors.startDate?.type}
 *   {...register('startDate', {
 *     required: true
 *   })}
 *   onChange={(e) => {
 *     if (
 *       Date.parse(form.getValues('endDate')) <
 *       Date.parse(e.target.value)
 *     ) {
 *       resetField('endDate')
 *     }
 *     setMinDate(e.target.value)
 *   }}
 * />
 * ```
 *
 * @example endDate input used in {@link components.Dashboard.Modals.PublishOpportunityModal}
 * ```tsx
 * <Input
 *   label={t('end-date')}
 *   type="endDate"
 *   placeholder="yyyy-mm-dd"
 *   disabled={!endDateDisabled}
 *   min={minDate}
 *   error={!!errors.endDate?.type}
 *   {...register('endDate', {})}
 *   onChange={(e) => {
 *     if (e.target.value === 'on') {
 *       resetField('endDate')
 *       setEndDateDisabled(!endDateDisabled)
 *     }
 *   }}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    prefix,
    type = 'text',
    error,
    className = '',
    helper,
    defaultValue,
    ...props
  },
  ref
) {
  const id = useId()
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.ui.input'
  })

  const [checked, setChecked] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      const el = inputRef.current.children[0] as HTMLInputElement
      setChecked(el.disabled)
      if (defaultValue && defaultValue === 'true') {
        setChecked(true)
        el.disabled = true
      }
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
                    if (inputRef && inputRef.current) {
                      const el = inputRef.current
                        .children[0] as HTMLInputElement
                      el.disabled = !el.disabled
                    }
                    setChecked(!checked)
                    props.onChange(e)
                  }}
                />
                <label
                  className="ml-2"
                  style={{ position: 'relative' }}
                  suppressHydrationWarning
                >
                  {t('ongoing')}
                </label>
              </>
            )}
          </div>

          <HelpTooltip content={helper} />
        </div>
      )}
      <div className="flex" ref={inputRef}>
        {prefix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-accent-content dark:bg-Input rounded-l-xl border border-r-0 border-gray-300 roun xl dark:border-gray-700/80">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className={clsx(
            { '!border-red-500 placeholder-red-500': error },
            { 'rounded-r-xl': prefix },
            { 'rounded-xl': !prefix },
            'bg-accent-content dark:bg-front border border-gray-300 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full',
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
