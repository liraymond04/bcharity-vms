import { useEffect, useState } from 'react'

import getAvatar from '@/lib/getAvatar'
import getIPFSBlob from '@/lib/ipfs/getIPFSBlob'
import { CauseMetadata } from '@/lib/types'

import Progress from '../Shared/Progress'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'

interface ICauseCardProps {
  cause: CauseMetadata
}

const CauseCard: React.FC<ICauseCardProps> = ({ cause }) => {
  const [resolvedImageUrl, setResolvedImageUrl] = useState('')

  useEffect(() => {
    if (cause.imageUrl) {
      getIPFSBlob(cause.imageUrl).then((url) => setResolvedImageUrl(url))
    }
  }, [cause])

  const getDisplayedImage = () => {
    if (!cause.imageUrl) {
      return (
        <img
          src={getAvatar(cause.from)}
          alt="Organization avatar"
          className="h-full w-auto"
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
          className="object-cover h-full w-full"
        />
      )
    }
  }

  return (
    <Card className="w-80 h-96 my-5 p-2 flex flex-col items-stretch justify-between">
      <div className="flex flex-col items-stretch h-full">
        <div className="w-full h-[200px]">{getDisplayedImage()}</div>
        <p className="text-lg text-brand-600 font-semibold leading-7 mt-2">
          {cause.location ? cause.location.toUpperCase() : 'CALGARY, AB'}
        </p>
        <p className="text-lg font-semibold leading-7">{cause.name}</p>
        <p className="text-lg grow overflow-auto">{cause.description}</p>
        <div className="mt-auto">
          <p className="text-zinc-500 text-xs">Last donation X minutes ago</p>
          <Progress progress={10000} total={10000} />
          <p className="text-sm font-bold">$10000 raised out of $10000</p>
        </div>
      </div>
    </Card>
  )
}

export default CauseCard
