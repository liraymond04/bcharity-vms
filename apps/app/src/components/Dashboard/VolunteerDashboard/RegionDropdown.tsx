import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

interface props {
  onClick: (string: string) => void
  region: string
}

const RegionDropdown = (props) => {
  const [open, setOpen] = useState<boolean>(false)
  const options = ['Any', 'Calgary', 'Vancouver', 'Toronto']
  const [searchValue, setSearchValue] = useState<string>('')

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className={`relative flex w-[200px] h-[50px] justify-between items-center hover:cursor-pointer bg-white border-2 border-violet-300 ${
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
            key={index}
            onClick={() => props.onClick(value)}
            className={`relative flex w-[200px] h-[50px] items-center justify-around bg-white border-b-2 border-l-2 border-r-2 border-violet-300 hover:bg-violet-500 cursor-pointer hover:text-white
                ${index == options.length - 1 ? 'rounded-b-2xl' : ''}
            `}
          >
            {value}
          </div>
        ))}
    </>
  )
}

export default RegionDropdown
