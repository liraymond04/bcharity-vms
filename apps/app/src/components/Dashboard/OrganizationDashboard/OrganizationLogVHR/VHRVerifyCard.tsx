import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import React from 'react'

import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import { VHRRequest } from '@/lib/types'

interface IVHRVerifyCardProps {
  selected?: boolean
  pending: boolean
  value: VHRRequest
  onClick: VoidFunction
  onAcceptClick: () => void
  onRejectClick: () => void
}

const VHRVerifyCard: React.FC<IVHRVerifyCardProps> = ({
  pending,
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
          selected
            ? 'bg-blue-100 dark:bg-violet-500'
            : 'bg-violet-200 dark:bg-Within dark:bg-opacity-10'
        } flex items-center shadow-sm shadow-black px-5 py-2`}
        onClick={onClick}
      >
        <p>
          {value.opportunity.startDate} - {value.opportunity.endDate}
        </p>
        <p className="ml-8 font-bold">{value.hoursToVerify} VHR</p>
        <p className="ml-8 font-bold">{value.from.handle}</p>
        <p className="ml-8 font-bold">{value.opportunity.name}</p>
        {pending ? (
          <div className="ml-auto">
            <Spinner />
          </div>
        ) : (
          <>
            <XCircleIcon
              className="w-8 cursor-pointer ml-auto"
              onClick={(e) => {
                onRejectClick()
                e.stopPropagation()
              }}
            />
            <CheckCircleIcon
              className="w-8 ml-2 cursor-pointer"
              onClick={(e) => {
                onAcceptClick()
                e.stopPropagation()
              }}
            />
          </>
        )}
      </div>
    </Card>
  )
}

export default VHRVerifyCard
