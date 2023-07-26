import React, { useState } from 'react'

import VHRVerifyCard from './VHRVerifyCard'

interface _fake_data {
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
      handleId: 'xxxxxxxxxx' + i,
      oppName: 'opportunity' + randomInRange(1, 99999),
      oppId: 'xxxxxxxxxx' + i,
      comment:
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    })
  }

  return fake
}

interface IOrganizationLogVHRProps {}

const OrganizationLogVHRTab: React.FC<IOrganizationLogVHRProps> = () => {
  const [data, setData] = useState(makeFakeData())
  const [selectedId, setSelectedId] = useState('')

  const onAcceptClick = (id: string) => {
    console.log('accept', id)
  }

  const onRejectClick = (id: string) => {
    console.log('reject', id)
  }

  return (
    <div className="mx-4 my-8">
      <div className="flex flex-col h-96 overflow-auto bg-zinc-50 shadow-md shadow-black px-4 py-3 rounded-md">
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
    </div>
  )
}

export default OrganizationLogVHRTab
