import { PostFragment } from '@lens-protocol/client'
import { Inter } from '@next/font/google'
import { MediaRenderer } from '@thirdweb-dev/react'
import React from 'react'

import DonateButton from '@/components/Shared/DonateButton'
import { Card } from '@/components/UI/Card'
import getAvatar from '@/lib/getAvatar'
import { CauseMetadata } from '@/lib/metadata'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

interface IBrowseCardProps {
  cause: CauseMetadata
  post: PostFragment
}

const BrowseCauseCard: React.FC<IBrowseCardProps> = ({ cause, post }) => {
  const getDisplayedImage = () => {
    if (!cause.imageUrl) {
      return (
        <img
          src={getAvatar(cause.from)}
          className="h-[200px]"
          alt="Organization profile picture"
        />
      )
    } else {
      return (
        <MediaRenderer
          src={cause.imageUrl}
          className="h-[200px]"
          alt="Volunteer opportunity related picture"
        />
      )
    }
  }

  return (
    <Card className="w-[300px] h-[350px] my-5 p-2 flex flex-col items-stretch justify-between">
      <div className="flex flex-col items-stretch">
        {getDisplayedImage()}
        <p className={`text-center mt-5 text-xl ${inter500.className}`}>
          {cause.name}
        </p>
      </div>
      <div className="relative mb-10">
        <div className="absolute right-0">
          <DonateButton post={post} cause={cause} />
        </div>
      </div>
    </Card>
  )
}

export default BrowseCauseCard
