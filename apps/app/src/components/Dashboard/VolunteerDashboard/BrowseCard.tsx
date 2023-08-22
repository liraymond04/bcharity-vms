import { Inter } from '@next/font/google'
import { MediaRenderer } from '@thirdweb-dev/react'
import Link from 'next/link'
import React from 'react'

import { Card } from '@/components/UI/Card'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

/**
 * Properties of {@link BrowseCard}
 */
export interface IBrowseCardProps {
  /**
   * Source URL of the post image
   */
  imageSrc: string
  /**
   * Source URL of the poster avatar image
   */
  avatarSrc?: string
  /**
   * String of the poster's name
   */
  name: string
  /**
   * String of the text displayed on the button
   */
  buttonText: string
  /**
   * String of the href redirect link of the button
   */
  buttonHref: string
}

/**
 * Component that displays an individual volunteer opportunity post
 * in a card used in {@link VolunteerVHR}.
 */
const BrowseCard: React.FC<IBrowseCardProps> = ({
  imageSrc,
  avatarSrc,
  name,
  buttonText,
  buttonHref
}) => {
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
        <MediaRenderer
          src={imageSrc}
          className="!object-cover !h-[200px]"
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
        suppressHydrationWarning
      >
        {buttonText}
      </Link>
    </Card>
  )
}

export default BrowseCard
