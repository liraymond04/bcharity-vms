import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { ComponentProps, forwardRef, ReactNode, useId } from 'react'
import { useTranslation } from 'react-i18next'

import { FieldError } from './Form'

const HelpTooltip = dynamic(() => import('./HelpTooltip'))

/**
 * Properties of {@link TextArea} that extend HTML input properties
 */
export interface TextAreaProps
  extends Omit<ComponentProps<'textarea'>, 'prefix'> {
  /**
   * String of label to display in front of input component
   */
  label?: string
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
  change?: Function
}

/**
 * Component that displays a styled text area input component, that
 * extends a default HTML input component, and handles text area input
 * specifically.
 *
 * @example TextArea used in {@link components.Dashboard.Modals.PublishOpportunityModal}
 * ```tsx
 * <TextArea
 *   label={t('description')}
 *   placeholder={t('description-placeholder')}
 *   error={!!errors.description?.type}
 *   {...register('description', { required: true, maxLength: 250 })}
 * />
 * ```
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function Input({ label, error, className = '', helper, ...props }, ref) {
    const id = useId()
    const { t } = useTranslation('common')

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

            <HelpTooltip content={helper} />
          </div>
        )}
        <div className="flex">
          <textarea
            id={id}
            className={clsx(
              { '!border-red-500 placeholder-red-500': error },
              'bg-accent-content dark:bg-front border border-gray-300 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {props.name && <FieldError name={props.name} />}
      </label>
    )
  }
)
