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
          alt="Volunteer opportunity related image"
          className="h-full w-auto m-auto"
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
    <Card className="w-[300px] h-[350px] my-5 p-2 flex flex-col items-stretch justify-between">
      <div className="flex flex-col items-stretch">
        <div>{getDisplayedImage()}</div>
        <p>{cause.location}</p>
        <p>{cause.name}</p>
        <p className="overflow-ellipsis">{cause.description}</p>
        <p>Last donation X minutes ago</p>
        <div>
          <Progress progress={10000} total={10000} />
          <p>$10000 raised out of $10000</p>
        </div>
      </div>
    </Card>
  )
}

export default CauseCard
