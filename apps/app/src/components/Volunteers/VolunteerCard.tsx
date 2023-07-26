import { ExternalLinkIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { STATIC_ASSETS } from '@/constants'
import getIPFSBlob from '@/lib/ipfs/getIPFSBlob'
import { OpportunityMetadata } from '@/lib/types'

import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'

interface IVolunteerCardProps {
  post: OpportunityMetadata
}

const VolunteerCard: React.FC<IVolunteerCardProps> = ({ post }) => {
  const [resolvedImageUrl, setResolvedImageUrl] = useState('')

  useEffect(() => {
    if (post.imageUrl) {
      getIPFSBlob(post.imageUrl).then((url) => setResolvedImageUrl(url))
    }
  }, [post])

  const getDisplayedImage = () => {
    if (!post.imageUrl) {
      return (
        <div
          className="border-b dark:border-b-gray-700/80 h-full"
          style={{
            backgroundImage: `url(${`${STATIC_ASSETS}/patterns/2.svg`})`,
            backgroundColor: '#8b5cf6',
            backgroundSize: '80%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'repeat'
          }}
        />
      )
    } else if (!resolvedImageUrl) {
      return (
        <div className="h-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )
    } else {
      return (
        <img
          src={resolvedImageUrl}
          alt="Volunteer opportunity related image"
          className="h-full w-auto m-auto"
        />
      )
    }
  }

  return (
    <Card>
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
