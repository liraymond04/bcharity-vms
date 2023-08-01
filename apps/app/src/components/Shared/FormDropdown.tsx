import React, { ComponentProps, forwardRef } from 'react'

import { FieldError } from '../UI/Form'

interface IFilterDropdownProps extends ComponentProps<'select'> {
  label: string
  options: string[]
  displayedOptions?: string[]
}

const FormDropdown = forwardRef<HTMLSelectElement, IFilterDropdownProps>(
  function FormDropdown({ label, options, displayedOptions, ...props }, ref) {
    return (
      <div className="my-4">
        <div className="flex items-center">
          <div className="text-md mr-3">{label}</div>
          <select
            className="w-30 h-10 bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
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
