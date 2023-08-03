import { PostFragment } from '@lens-protocol/client'
import { Inter } from '@next/font/google'
import React, { useEffect, useState } from 'react'

import DonateButton from '@/components/Shared/DonateButton'
import { Card } from '@/components/UI/Card'
import getIPFSBlob from '@/lib/ipfs/getIPFSBlob'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

interface IBrowseCardProps {
  imageSrc: string
  avatarSrc?: string
  name: string
  post: PostFragment
}

const BrowseCauseCard: React.FC<IBrowseCardProps> = ({
  imageSrc,
  avatarSrc,
  name,
  post
}) => {
  const [resolvedImageUrl, setResolvedImageUrl] = useState('')

  useEffect(() => {
    if (imageSrc) {
      getIPFSBlob(imageSrc).then((url) => setResolvedImageUrl(url))
    }
  }, [imageSrc])

  const getDisplayedImage = () => {
    if (!imageSrc) {
      return (
        <img
          src={avatarSrc}
          className="h-[200px]"
          alt="Organization profile picture"
        />
      )
    } else {
      return (
        <img
          src={resolvedImageUrl}
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
          {name}
        </p>
      </div>
      <div className="relative mb-10">
        <div className="absolute right-0">
          <DonateButton post={post} />
        </div>
      </div>
    </Card>
  )
}

export default BrowseCauseCard
