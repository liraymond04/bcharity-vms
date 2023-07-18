import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

interface props {
  onClick: (string: string) => void
  region: string
  className: string
}

const RegionDropdown = (props) => {
  const [open, setOpen] = useState<boolean>(false)
  const options = ['Any', 'Calgary', 'Vancouver', 'Toronto']

  return (
    <div className={props.className}>
      <div
        onClick={() => setOpen(!open)}
        className={`flex w-[200px] h-[50px] justify-between items-center hover:cursor-pointer bg-white border-2 border-violet-300 ${
          open ? 'rounded-t-2xl' : 'rounded-2xl'
        }
        `}
      >
        <div className="w-5 h-5 ml-2"></div>
        <button className="flex ">{props.region}</button>
        {open ? (
          <ChevronUpIcon className="w-5 h-5 mr-2" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 mr-2" />
        )}
      </div>
      {open &&
        options.map((value, index) => (
          <div
            className={`flex items-center w-[200px] h-[50px] justify-around bg-white border-b-2 border-l-2 border-r-2 border-violet-300 hover:bg-violet-500 cursor-pointer hover:text-white ${
              index == options.length - 1 ? 'rounded-b-2xl' : ''
            }`}
            key={index}
            onClick={() => {
              props.onClick(value)
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
