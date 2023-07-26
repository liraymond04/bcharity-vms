import { SearchIcon } from '@heroicons/react/outline'
import React, { useMemo, useState } from 'react'
import { v4 } from 'uuid'

import DashboardDropDown from '../../VolunteerDashboard/DashboardDropDown'
import VHRDetailCard from './VHRDetailCard'
import VHRVerifyCard from './VHRVerifyCard'

export interface _fake_data {
  id: string
  date: string
  VHR: number
  handle: string
  handleId: string
  oppName: string
  oppId: string
  comment: string
}

const makeFakeData = (): _fake_data[] => {
  const randomInRange = (from: number, to: number) => {
    var r = Math.random()
    return Math.floor(r * (to - from) + from)
  }

  const fake: _fake_data[] = []

  for (let i = 0; i < 100; i++) {
    fake.push({
      id: '' + i,
      date: '2005-11-02',
      VHR: 10 * randomInRange(1, 99999),
      handle: '@cookiekiller' + randomInRange(1, 99999),
      handleId: v4(),
      oppName: 'opportunity' + randomInRange(1, 99999),
      oppId: v4(),
      comment:
        'A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A ' +
        'A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A ' +
        'A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A ' +
        'A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A ' +
        'A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A ' +
        'A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A ' +
        'A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A ' +
        'A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A A '
    })
  }

  return fake
}

interface IOrganizationLogVHRProps {}

const OrganizationLogVHRTab: React.FC<IOrganizationLogVHRProps> = () => {
  const [data, setData] = useState(makeFakeData())
  const [selectedId, setSelectedId] = useState('')

  const selectedValue = useMemo(() => {
    return data.find((val) => val.id === selectedId) ?? null
  }, [data, selectedId])

  const onAcceptClick = (id: string) => {
    console.log('accept', id)

    const newData = data.filter((val) => id !== val.id)
    setData(newData)
  }

  const onRejectClick = (id: string) => {
    console.log('reject', id)

    const newData = data.filter((val) => id !== val.id)
    setData(newData)
  }

  return (
    <div className="mx-4 my-8 flex flex-col max-h-screen">
      <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
        <div className="flex justify-between w-[300px] h-[50px] bg-white items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-black">
          <input
            className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none  bg-transparent rounded-2xl w-[250px]"
            type="text"
            // value={searchValue}
            placeholder="Search"
            // onChange={(e) => {
            //   setSearchValue(e.target.value)
            // }}
          />
          <div className="h-5 w-5 mr-5">
            <SearchIcon />
          </div>
        </div>

        <div className="flex flex-wrap gap-y-5 justify-around w-[420px] items-center">
          <div className="h-[50px] z-10 ">
            <DashboardDropDown
              label="Filter:"
              options={[]}
              onClick={(c) => console.log('change filter', c)}
              selected={''}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col min-h-96 overflow-auto bg-zinc-50 shadow-md shadow-black px-4 py-3 rounded-md mt-10">
        {data.map((value) => {
          const selected = value.id === selectedId

          return (
            <VHRVerifyCard
              selected={selected}
              key={value.id}
              value={value}
              onClick={() => setSelectedId(selected ? '' : value.id)}
              onAcceptClick={() => onAcceptClick(value.id)}
              onRejectClick={() => onRejectClick(value.id)}
            />
          )
        })}
      </div>
      {selectedValue && <VHRDetailCard value={selectedValue} />}
    </div>
  )
}

export default OrganizationLogVHRTab
