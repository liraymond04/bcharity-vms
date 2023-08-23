import React, { ComponentProps, forwardRef } from 'react'

import { FieldError } from '../UI/Form'

/**
 * Properties of {@link FormDropdown}
 */
export interface IFilterDropdownProps extends ComponentProps<'select'> {
  /**
   * Label displayed in front of the dropdown
   */
  label: string
  /**
   * Array of options listed in the dropdown
   */
  options: string[]
  /**
   * Array of items to be displayed from options
   */
  displayedOptions?: string[]
}

/**
 * A component that lists a dropdown of string items that can be filtered
 * to be used in a Form
 *
 * @example FormDropdown used in the {@link components.Dashboard.Modals.PublishCauseModal}
 * ```tsx
 * <FormDropdown
 *   label={t('selected-currency')}
 *   options={currencyData?.map((c) => c.address) ?? []}
 *   displayedOptions={currencyData?.map((c) => c.name) ?? []}
 *   {...register('currency')}
 * />
 * ```
 */
const FormDropdown = forwardRef<HTMLSelectElement, IFilterDropdownProps>(
  function FormDropdown({ label, options, displayedOptions, ...props }, ref) {
    return (
      <div className="my-4">
        <div className="flex items-center">
          <div className="text-md mr-3" suppressHydrationWarning>
            {label}
          </div>
          <select
            className="w-30 h-10 bg-white rounded-xl border border-gray-300 outline-none dark:bg-front disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            ref={ref}
            {...props}
          >
            <option key="_none" value="">
              None
            </option>
            {options.map((o, i) => (
              <option key={o} value={o}>
                {displayedOptions ? displayedOptions[i] : o}
              </option>
            ))}
          </select>
        </div>
        {props.name && <FieldError name={props.name} />}
      </div>
    )
  }
)

export default FormDropdown
