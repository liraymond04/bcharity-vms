import { LinkIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

import { LogVhrRequestMetadata } from '@/lib/metadata'

interface IVHRDetailCardProps {
  value: LogVhrRequestMetadata
}

const VHRDetailCard: React.FC<IVHRDetailCardProps> = ({ value }) => {
  return (
    <div className="flex h-72 bg-brand-200 dark:bg-Card shadow-md shadow-black px-4 py-3 rounded-md mt-8">
      <div className="flex flex-col grow shrink-0">
        <Link href="">
          <div className="flex">
            <LinkIcon className="w-6 inline mr-4" />
            <p className="text-black dark:text-teal-100 font-semibold text-lg">
              {value.from.handle}
            </p>
          </div>
          <p className="ml-10 text-fuchsia-700">{value.from.id}</p>
        </Link>
        <Link href="">
          <div className="flex">
            <LinkIcon className="w-6 inline mr-4" />
            <p className="text-black dark:text-teal-100 font-semibold text-lg">
              {value.opportunity.name}
            </p>
          </div>
          <p className="ml-10 text-fuchsia-700">
            {value.opportunity.opportunity_id}
          </p>
        </Link>
        <div className="flex justify-between font-semibold text-lg mt-4">
          <p>
            {value.opportunity.startDate} - {value.opportunity.endDate}
          </p>
          <p>{value.hoursToVerify} VHR</p>
        </div>
        <p className="mt-auto">Request made on {value.createdAt}</p>
      </div>
      <p className="ml-10 overflow-scroll">{value.comments}</p>
    </div>
  )
}

export default VHRDetailCard
