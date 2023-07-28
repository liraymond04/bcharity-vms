import {
  ArrowCircleRightIcon,
  CalendarIcon,
  ClockIcon,
  LinkIcon
} from '@heroicons/react/outline'
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
        'hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. hello this is a description about this volunteer opportunity. ',
      website: 'https://google.com'
    }
    data.push(op)
  }
  return data
}

const resetIndice = () => {
  let indice = []
  for (let i = 0; i < 20; i++) {
    indice.push(i)
  }
  return indice
}

const VolunteerLogHours: React.FC = () => {
  const [selectedSortBy, setSelectedSortBy] = useState<string>('')
  const sortByOptions = ['Start Date', 'End Date', 'Total Hours']

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const categories = ['Education', 'Healthcare', 'Food', 'Entertainment']

  const [displayIndex, setDisplayIndex] = useState(0)

  const [data, setdata] = useState(generateData())
  const [indice, setIndice] = useState(resetIndice())

  const sortByStartDate = () => {
    indice.sort((a, b) => {
      if (data[a].start < data[b].start) return -1
      else return 1
    })
  }

  const sortByEndDate = () => {
    indice.sort((a, b) => {
      if (data[a].end < data[b].end) return -1
      else return 1
    })
  }

  const sortByHours = () => {
    indice.sort((a, b) => {
      if (data[a].hour < data[b].hour) return -1
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
            setIndice(resetIndice())
          }}
        >
          Clear Filters
        </button>
      </div>

      <div className="max-h-[250px] w-fit overflow-scroll">
        {indice.map((op) => (
          <div
            className={`flex justify-between items-center my-5 tracking-wide w-[800px] h-[50px] bg-[#CEBBF8] bg-opacity-[0.50] rounded-md shadow-md hover:bg-opacity-100 hover:cursor-pointer ${
              inter500.className
            } ${displayIndex == op ? 'bg-blue-200' : ''}`}
            key={op}
            onClick={() => setDisplayIndex(op)}
          >
            <div className="flex justify-between items-center ml-10">
              <p className="mx-5 w-[200px] h-[30px] overflow-scroll whitespace-nowrap">
                {data[op].name}
              </p>
              <p className="mx-5 w-[100px]">{data[op].start}</p>
              <p className="mx-5 w-[100px]">{data[op].end}</p>
              <p className="mx-5 w-[100px]">{data[op].hour} hours</p>
            </div>
            <a href="https://google.com" target="_blank">
              <ArrowCircleRightIcon className="mr-10 w-6 h-6" />
            </a>
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
          <div className="flex items-center ml-2 mt-5">
            <CalendarIcon className="w-5 h-5 mr-2" />
            {data[displayIndex].start} to {data[displayIndex].end}
          </div>
          <div className="flex items-center ml-2 mt-2">
            <ClockIcon className="w-5 h-5 mr-2" /> {data[displayIndex].hour}{' '}
            hours in total
          </div>
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
