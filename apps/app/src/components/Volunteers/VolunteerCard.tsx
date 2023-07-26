import { ExternalLinkIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

import { STATIC_ASSETS } from '@/constants'
import { OpportunityMetadata } from '@/lib/types'

import { Card } from '../UI/Card'

interface IVolunteerCardProps {
  post: OpportunityMetadata
}

const VolunteerCard: React.FC<IVolunteerCardProps> = ({ post }) => {
  return (
    <Card>
      <div className="flex">
        <div
          className="flex-shrink-0 h-36 w-36 rounded-l-xl border-b dark:border-b-gray-700/80"
          style={{
            backgroundImage: `url(${`${STATIC_ASSETS}/patterns/2.svg`})`,
            backgroundColor: '#8b5cf6',
            backgroundSize: '80%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'repeat'
          }}
        />
        <div className="relative mx-5 mt-3 mb-1">
          <div className="font-bold text-2xl line-clamp-1">{post?.name}</div>
          <div className="text-xs">{post?.from.handle}</div>
          <div className="text-xs">{post?.startDate}</div>
          <div className="line-clamp-2 text-sm mt-1">{post?.description}</div>
          {post?.website && (
            <Link
              href={post?.website}
              target="_blank"
              className="absolute bottom-0 flex text-brand-600 text-sm"
            >
              <div className="flex items-center">
                <div className="mr-1 whitespace-nowrap">External url</div>
                <ExternalLinkIcon className="w-4 h-4 inline-flex" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}

export default VolunteerCard
