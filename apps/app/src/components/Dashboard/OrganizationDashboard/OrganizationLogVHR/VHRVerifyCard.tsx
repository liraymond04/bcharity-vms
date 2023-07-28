import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import React from 'react'

import { Card } from '@/components/UI/Card'
import { VHRRequest } from '@/lib/types'

interface IVHRVerifyCardProps {
  selected?: boolean
  value: VHRRequest
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
        <p>
          {value.opportunity.startDate} - {value.opportunity.endDate}
        </p>
        <p className="ml-8 font-bold">{value.hoursToVerify} VHR</p>
        <p className="ml-8 font-bold">{value.from.handle}</p>
        <p className="ml-8 font-bold">{value.opportunity.name}</p>
        <XCircleIcon
          className="w-8 ml-auto cursor-pointer"
          onClick={(e) => {
            onAcceptClick()
            e.stopPropagation()
          }}
        />
        <CheckCircleIcon
          className="w-8 ml-2 cursor-pointer"
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
