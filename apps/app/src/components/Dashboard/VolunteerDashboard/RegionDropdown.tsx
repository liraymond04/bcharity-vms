import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

interface props {
  onClick: (string: string) => void
  selected: string
  label: string
  options: string[]
}

const RegionDropdown: React.FC<props> = ({
  onClick,
  selected,
  label,
  options
}) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className={label}>
      <div
        onClick={() => setOpen(!open)}
        className={`flex w-[200px] h-[50px] justify-between items-center hover:cursor-pointer bg-white border-2 border-violet-300 border-b-gray-300 ${
          open ? 'rounded-t-md' : 'rounded-md'
        }
        `}
      >
        <div className="w-5 h-5 ml-2"></div>
        <button className="flex ">{selected}</button>
        {open ? (
          <ChevronUpIcon className="w-5 h-5 mr-2" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 mr-2" />
        )}
      </div>
      {open &&
        options.map((value, index) => (
          <div
            className={`flex items-center w-[200px] h-[35px] justify-around bg-white border-b-2 border-l-2 border-r-2 border-violet-300 border-b-gray-300 hover:bg-gray-200 cursor-pointer  ${
              index == options.length - 1
                ? 'rounded-b-md border-b-violet-300'
                : ''
            }`}
            key={index}
            onClick={() => {
              onClick(value)
              setOpen(false)
            }}
          >
            <div className="w-fit">{value}</div>
          </div>
        ))}
    </div>
  )
}

export default RegionDropdown
