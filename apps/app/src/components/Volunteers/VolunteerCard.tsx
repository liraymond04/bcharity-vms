import { ExternalLinkIcon } from '@heroicons/react/outline'
import { MediaRenderer } from '@thirdweb-dev/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { STATIC_ASSETS } from '@/constants'
import { OpportunityMetadata } from '@/lib/metadata'
import validImageExtension from '@/lib/validImageExtension'

import { Card } from '../UI/Card'
import ApplyToOpportunityModal from './ApplyToOpportunityModal'

/**
 * Properties of {@link VolunteerCard}
 */
export interface IVolunteerCardProps {
  /**
   * Opportunity metadata to display
   */
  post: OpportunityMetadata
}

/**
 * Individual opportunity post card displayed in the {@link Volunteers} page. Redirects
 * to individual opportunity post page when clicked. Displayed opportunity post information
 * is passed as cause post metadata in its properties.
 */
const VolunteerCard: React.FC<IVolunteerCardProps> = ({ post }) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.volunteers.card'
  })
  const getDisplayedImage = () => {
    if (!post.imageUrl || !validImageExtension(post.imageUrl)) {
      return (
        <div
          className="border-b dark:border-b-gray-700/80 h-full rounded-l-xl"
          style={{
            backgroundImage: `url(${`${STATIC_ASSETS}/patterns/2.svg`})`,
            backgroundColor: '#8b5cf6',
            backgroundSize: '80%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'repeat',
            objectFit: 'cover'
          }}
        />
      )
    } else {
      return (
        <MediaRenderer
          src={post.imageUrl}
          alt="Volunteer opportunity related image"
          className="!object-cover !h-full rounded-l-xl"
        />
      )
    }
  }

  const [showModal, setShowModal] = useState(false)
  return (
    <div
      onClick={() => {
        window.open(`/volunteer/${post.post_id}`, '_blank')
      }}
    >
      <Card className="transition duration-100 hover:scale-105 hover:cursor-pointer">
        <ApplyToOpportunityModal
          id={post.post_id}
          open={showModal}
          onClose={() => setShowModal(false)}
        />
        <div className="flex">
          <div className="flex-shrink-0 h-36 w-36 overflow-hidden rounded-l-xl">
            {getDisplayedImage()}
          </div>
          <div className="relative mx-5 mt-3 mb-1 max-w-[15vw]">
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
                  <div
                    className="mr-1 whitespace-nowrap"
                    suppressHydrationWarning
                  >
                    {t('external-url')}
                  </div>
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
