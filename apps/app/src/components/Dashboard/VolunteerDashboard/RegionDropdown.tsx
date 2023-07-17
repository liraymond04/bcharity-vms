import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

const RegionDropdown = () => {
  const [open, setOpen] = useState<boolean>(false)
  const options = ['Any', 'Calgary', 'Vancouver', 'Toronto']
  const [searchValue, setSearchValue] = useState<string>('')

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className={`relative flex w-[200px] h-[50px] justify-between items-center hover:cursor-pointer bg-violet-300 ${
          open ? 'rounded-t-2xl' : 'rounded-2xl'
        }
        `}
      >
        <button className="flex ml-[75px]">Region</button>
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
            className={`relative flex w-[200px] h-[50px] items-center justify-around bg-violet-300 
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
