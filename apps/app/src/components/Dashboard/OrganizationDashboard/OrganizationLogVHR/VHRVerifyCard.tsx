import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import React from 'react'

import { Card } from '@/components/UI/Card'

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

interface IVHRVerifyCardProps {
  selected?: boolean
  value: _fake_data
  onClick: VoidFunction
  onAcceptClick: () => void
  onRejectClick: () => void
}

const VHRVerifyCard: React.FC<IVHRVerifyCardProps> = ({
  selected,
  value,
  onClick,
  onAcceptClick,
  onRejectClick
}) => {
  return (
    <Card>
      <div
        className={`${
          selected ? 'bg-blue-100' : 'bg-violet-200'
        } flex items-center shadow-sm shadow-black px-5 py-2`}
        onClick={onClick}
      >
        <p>{value.date}</p>
        <p className="ml-8 font-bold">{value.VHR} VHR</p>
        <p className="ml-8 font-bold">{value.handle}</p>
        <p className="ml-8 font-bold">{value.oppName}</p>
        <XCircleIcon
          className="w-8 ml-auto cursor-pointer"
          onClick={(e) => {
            onAcceptClick()
            e.stopPropagation()
          }}
        />
        <CheckCircleIcon
          className="w-8 ml-2 cursor-pointer  "
          onClick={(e) => {
            onRejectClick()
            e.stopPropagation()
          }}
        />
      </div>
    </Card>
  )
}

export default VHRVerifyCard
