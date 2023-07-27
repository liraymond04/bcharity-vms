import { Inter } from '@next/font/google'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

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
  buttonText: string
  buttonHref: string
}

const BrowseCard: React.FC<IBrowseCardProps> = ({
  imageSrc,
  avatarSrc,
  name,
  buttonText,
  buttonHref
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
      <Link
        className={`self-end py-1 px-6 text-sm text-center rounded-full bg-purple-500 text-white ${inter500.className}`}
        rel="noopener noreferrer"
        target="_blank"
        href={buttonHref} // external link or /volunteer/[post-id] here
      >
        {buttonText}
      </Link>
    </Card>
  )
}

export default BrowseCard
