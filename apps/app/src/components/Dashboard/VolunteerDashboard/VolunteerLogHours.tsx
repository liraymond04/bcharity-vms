import { ArrowCircleRightIcon, LinkIcon } from '@heroicons/react/outline'
import { Inter } from '@next/font/google'
import { useState } from 'react'

import DashboardDropDown from './DashboardDropDown'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

const generateDate = () => {
  let year = (Math.floor(Math.random() * 5) + 2018).toString()

  let month = (Math.floor(Math.random() * 12) + 1).toString()
  if (month.length < 2) month = '0' + month

  let day = (Math.floor(Math.random() * 30) + 1).toString()
  if (day.length < 2) day = '0' + day

  return year + '-' + month + '-' + day
}

const generateData = () => {
  var data = []
  for (let i = 0; i < 20; i++) {
    const op = {
      name: 'Opportunity ' + i,
      start: generateDate(),
      end: generateDate(),
      hour: Math.floor(Math.random() * 10),
      description:
        'hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. '
    }
    data.push(op)
  }
  return data
}

const VolunteerLogHours: React.FC = () => {
  const [selectedSortBy, setSelectedSortBy] = useState<string>('')
  const sortByOptions = ['Start Date', 'End Date', 'Total Hours']

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const categories = ['Education', 'Healthcare', 'Food', 'Entertainment']

  const [displayIndex, setDisplayIndex] = useState(0)
  const originalData = generateData()
  const [data, setData] = useState(originalData)

  const sortByStartDate = () => {
    data.sort((a, b) => {
      if (a.start < b.start) return -1
      else return 1
    })
  }

  const sortByEndDate = () => {
    data.sort((a, b) => {
      if (a.end < b.end) return -1
      else return 1
    })
  }

  const sortByHours = () => {
    data.sort((a, b) => {
      if (a.hour < b.hour) return -1
      else return 1
    })
  }

  return (
    <div className="mt-10 ml-20">
      <div className="flex py-5 items-center">
        <div className="mr-5 h-[50px] z-10">
          <DashboardDropDown
            label="Sort By:"
            selected={selectedSortBy}
            options={Array.from(sortByOptions)}
            onClick={(c) => {
              if (c == 'Start Date') {
                sortByStartDate()
              } else if (c == 'End Date') {
                sortByEndDate()
              } else if (c == 'Total Hours') {
                sortByHours()
              }
              setSelectedSortBy(c)
            }}
          />
        </div>
        <div className="mx-5 h-[50px] z-10">
          <DashboardDropDown
            label="Filters:"
            selected={selectedCategory}
            options={Array.from(categories)}
            onClick={(c) => setSelectedCategory(c)}
          />
        </div>
        <button
          className="ml-3 min-w-[110px] h-fit text-red-500 bg-[#ffc2d4] border-red-500 border-2 rounded-md px-2 hover:bg-red-500 hover:text-white hover:cursor-pointer"
          onClick={() => {
            setSelectedSortBy('')
            setSelectedCategory('')
            setData(originalData)
          }}
        >
          Clear Filters
        </button>
      </div>

      <div className="max-h-[250px] w-fit overflow-scroll">
        {data.map((op, index) => (
          <div
            className={`flex justify-between items-center my-5 tracking-wide w-[800px] h-[50px] bg-[#CEBBF8] bg-opacity-[0.50] rounded-md shadow-md hover:bg-opacity-100 hover:cursor-pointer ${
              inter500.className
            } ${displayIndex == index ? 'bg-blue-200' : ''}`}
            key={index}
            onClick={() => setDisplayIndex(index)}
          >
            <div className="flex justify-between items-center ml-10">
              <p className="mx-5">{op.name}</p>
              <p className="mx-5">{op.start}</p>
              <p className="mx-5">{op.end}</p>
              <p className="mx-5">{op.hour} hr/week</p>
            </div>
            <ArrowCircleRightIcon className="mr-10 w-6 h-6" />
          </div>
        ))}
      </div>
      <div
        className={`flex mt-10 tracking-wide w-[800px] h-[300px] bg-[#CEBBF8] bg-opacity-[0.30] rounded-md shadow-md ${inter500.className}`}
      >
        <div className="w-[400px]">
          <div className="flex justify-around mt-5 text-xl h-fit">
            <div className="flex items-center">
              <LinkIcon className="w-5 h-5 mr-4" />
              {data[displayIndex].name}
            </div>
          </div>
          <div>
            {data[displayIndex].start} to {data[displayIndex].end}
          </div>
          <div>{data[displayIndex].hour} hours in total</div>
        </div>
        <div className="h-[250px] self-center w-[2px] bg-[#D8C0EC]"></div>
        <div className="flex justify-around w-[400px]">
          <div className="w-[350px] mt-5 mb-5 overflow-scroll">
            {data[displayIndex].description}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteerLogHours
