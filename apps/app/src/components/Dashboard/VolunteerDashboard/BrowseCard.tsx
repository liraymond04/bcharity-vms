import { Inter } from '@next/font/google'
import Link from 'next/link'
import React from 'react'

import { Card } from '@/components/UI/Card'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

interface IBrowseCardProps {
  imageSrc: string
  name: string
  buttonText: string
  buttonHref: string
}

const BrowseCard: React.FC<IBrowseCardProps> = ({
  imageSrc,
  name,
  buttonText,
  buttonHref
}) => {
  return (
    <Card className="w-[300px] h-[350px] my-5 p-2 flex flex-col items-stretch justify-between">
      <div className="flex flex-col items-stretch">
        <img src={imageSrc} className="h-[200px]" alt="profile picture" />
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
