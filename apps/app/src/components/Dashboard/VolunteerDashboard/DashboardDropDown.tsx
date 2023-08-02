import { CheckIcon, ChevronUpIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

interface Props {
  onClick: (string: string) => void
  selected: string
  label: string
  options: string[]
}

const DashboardDropDown: React.FC<Props> = ({
  onClick,
  selected,
  label,
  options
}) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="flex">
      <div className={`mx-5 mt-3 dark:text-sky-100`}>{label}</div>
      <div className={`${open && 'shadow-2xl'}`}>
        <div
          onClick={() => setOpen(!open)}
          className={`flex w-[200px] h-[50px] justify-between items-center hover:cursor-pointer bg-white dark:bg-Input border-[1px]  ${
            open
              ? 'rounded-t-md border-violet-300 border-b-gray-300'
              : 'rounded-md'
          }
        `}
        >
          <div className="w-5 h-5 ml-2"></div>
          <button className="flex ">{selected}</button>
          <ChevronUpIcon
            className={`w-5 h-5 mr-2 transform ${
              open ? 'rotate-180' : 'rotate-0'
            } duration-100`}
          />
        </div>
        {open &&
          options.map((value, index) => (
            <div
              className={`flex items-center w-[200px] h-[35px] justify-around bg-white dark:bg-Input border-b-[1px] border-l-[1px] border-r-[1px] border-violet-300 border-b-gray-300 hover:bg-gray-200 hover:border-l-[5px] hover:border-l-purple-800 dark:hover:border-l-purple-300 cursor-pointer  ${
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
              <div className="w-fit">{value}</div>
              {value == selected && <div className="w-5"></div>}
            </div>
          ))}
      </div>
    </div>
  )
}

export default DashboardDropDown
