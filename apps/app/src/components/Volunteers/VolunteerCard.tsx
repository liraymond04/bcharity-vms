import { ExternalLinkIcon } from '@heroicons/react/outline'
import { MediaRenderer } from '@thirdweb-dev/react'
import Link from 'next/link'
import React from 'react'

import { STATIC_ASSETS } from '@/constants'
import { OpportunityMetadata } from '@/lib/metadata'

import { Card } from '../UI/Card'

interface IVolunteerCardProps {
  post: OpportunityMetadata
}

const VolunteerCard: React.FC<IVolunteerCardProps> = ({ post }) => {
  const getDisplayedImage = () => {
    if (!post.imageUrl) {
      return (
        <div
          className="border-b dark:border-b-gray-700/80 h-full rounded-l-xl"
          style={{
            backgroundImage: `url(${`${STATIC_ASSETS}/patterns/2.svg`})`,
            backgroundColor: '#8b5cf6',
            backgroundSize: '80%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'repeat'
          }}
        />
      )
    } else {
      return (
        <MediaRenderer
          src={post.imageUrl}
          alt="Volunteer opportunity related image"
          className="h-full w-auto m-auto rounded-l-xl"
        />
      )
    }
  }

  return (
    <div
      onClick={() => {
        window.open(`/volunteer/${post.post_id}`, '_blank')
      }}
    >
      <Card className="transition duration-100 hover:scale-105 hover:cursor-pointer">
        <div className="flex">
          <div className="flex-shrink-0 h-36 w-36 rounded-l-xl">
            {getDisplayedImage()}
          </div>
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
                <div className="flex items-center transition duration-10 hover:bg-brand-200 rounded-sm">
                  <div className="mr-1 whitespace-nowrap">External url</div>
                  <ExternalLinkIcon className="w-4 h-4 inline-flex" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default VolunteerCard
