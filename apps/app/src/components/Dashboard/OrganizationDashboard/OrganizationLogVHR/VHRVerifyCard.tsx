import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import React from 'react'

import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import { LogVhrRequestMetadata } from '@/lib/metadata'

/**
 * Properties of {@link VHRVerifyCard}
 */
export interface IVHRVerifyCardProps {
  /**
   * Whether the current request item is selected
   */
  selected?: boolean
  /**
   * Whether the request data is loading
   */
  pending: boolean
  /**
   * Metadata of VHR request to display
   */
  value: LogVhrRequestMetadata
  /**
   * Function that runs when the component is clicked
   */
  onClick: VoidFunction
  /**
   * Function that runs when the accept button is clicked
   */
  onAcceptClick: () => void
  /**
   * Function that runs when the reject button is clicked
   */
  onRejectClick: () => void
}

/**
 * Component that renders a styled card component for an individual VHR request
 *
 * Used in {@link OrganizationLogVHR} to map a VHR request item in the list of
 * requests.
 */
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
        <div className="ml-8 font-bold">
          <p>
            {value.hoursToVerify.toString().length < 10
              ? value.hoursToVerify
              : value.hoursToVerify.toString().substring(0, 10) + '...'}{' '}
            VHR
          </p>
        </div>
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
