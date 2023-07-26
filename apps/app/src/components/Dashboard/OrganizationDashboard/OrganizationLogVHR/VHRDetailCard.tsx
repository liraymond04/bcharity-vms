import { LinkIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

import { _fake_data } from './OrganizationLogVHR'

interface IVHRDetailCardProps {
  value: _fake_data
}

const VHRDetailCard: React.FC<IVHRDetailCardProps> = ({ value }) => {
  return (
    <div className="flex h-72 bg-brand-200 shadow-md shadow-black px-4 py-3 rounded-md mt-8">
      <div className="flex flex-col grow shrink-0">
        <Link href="">
          <div className="flex">
            <LinkIcon className="w-6 inline mr-4" />
            <p className="text-black font-semibold text-lg">{value.handle}</p>
          </div>
          <p className="ml-10 text-fuchsia-700">{value.handleId}</p>
        </Link>
        <Link href="">
          <div className="flex">
            <LinkIcon className="w-6 inline mr-4" />
            <p className="text-black font-semibold text-lg">{value.oppName}</p>
          </div>
          <p className="ml-10 text-fuchsia-700">{value.oppId}</p>
        </Link>
        <div className="flex justify-between font-semibold text-lg mt-4">
          <p>{value.date}</p>
          <p>{value.VHR} VHR</p>
        </div>
        <p className="mt-auto">Request made on {value.date}</p>
      </div>
      <p className="ml-10 overflow-scroll">{value.comment}</p>
    </div>
  )
}

export default VHRDetailCard
