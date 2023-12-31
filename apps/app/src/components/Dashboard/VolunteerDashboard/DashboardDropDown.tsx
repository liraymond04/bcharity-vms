import { CheckIcon, ChevronUpIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

/**
 * Properties of {@link DashboardDropDown}
 */
export interface DashboardDropDownProps {
  /**
   *  Function that runs when a dropdown item is selected
   * @param string
   * @returns
   */
  onClick: (string: string) => void
  /**
   * String of the currently selected dropdown item
   */
  selected: string
  /**
   * String of the label in front of the dropdown component
   */
  label: string
  /**
   * String array of the available options to select
   */
  options: string[]
}

/**
 * Component that displays a dropdown menu of string items to select
 *
 * @example DashboardDropdown used in {@link VolunteerVHR} to filter categories
 * ```tsx
 *  <div className="h-[50px] z-10 ">
 *    <DashboardDropDown
 *      label={t('filter')}
 *      options={Array.from(categories)}
 *      onClick={(c) => setSelectedCategory(c)}
 *      selected={selectedCategory}
 *    ></DashboardDropDown>
 *  </div>
 * ```
 */
const DashboardDropDown: React.FC<DashboardDropDownProps> = ({
  onClick,
  selected,
  label,
  options
}) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="flex">
      <div className={`mx-5 mt-3 dark:text-sky-100`} suppressHydrationWarning>
        {label}
      </div>
      <div className={`${open && 'shadow-2xl'}`}>
        <div
          onClick={() => setOpen(!open)}
          className={`flex w-[200px] h-[50px] justify-between items-center hover:cursor-pointer bg-accent-content dark:bg-Input border-[1px]  ${
            open
              ? 'rounded-t-md border-violet-300 border-b-gray-300'
              : 'rounded-md'
          }
        `}
        >
          <div className="w-5 h-5 ml-2"></div>
          <button className="truncate text-ellipsis">{selected}</button>
          <ChevronUpIcon
            className={`w-5 h-5 mr-2 shrink-0 transform ${
              open ? 'rotate-180' : 'rotate-0'
            } duration-100`}
          />
        </div>
        {open &&
          options.map((value, index) => (
            <div
              className={`flex items-center w-[200px] h-[35px] justify-around bg-accent-content dark:bg-Input border-b-[1px] border-l-[1px] border-r-[1px] border-violet-300 border-b-gray-300 hover:bg-gray-200 hover:border-l-[5px] hover:border-l-purple-800 dark:hover:border-l-purple-300 cursor-pointer  ${
                index == options.length - 1
                  ? 'rounded-b-md border-b-violet-300'
                  : ''
              }
                  `}
              key={index}
              onClick={() => {
                onClick(value)
                setOpen(false)
              }}
            >
              {value == selected && <CheckIcon className="w-5 h-5" />}
              <div className="w-fit text-center truncate text-ellipsis px-2">
                {value}
              </div>
              {value == selected && <div className="w-5"></div>}
            </div>
          ))}
      </div>
    </div>
  )
}

export default DashboardDropDown
