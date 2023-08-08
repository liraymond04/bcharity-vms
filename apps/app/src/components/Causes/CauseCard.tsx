import { MediaRenderer } from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { CURRENCIES } from '@/constants'
import getAvatar from '@/lib/getAvatar'
import { formatLocation } from '@/lib/lens-protocol/formatLocation'
import lensClient from '@/lib/lens-protocol/lensClient'
import { CauseMetadata, isComment, isPost, PostTags } from '@/lib/metadata'

import Progress from '../Shared/Progress'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'

interface ICauseCardProps {
  cause: CauseMetadata
}

const CauseCard: React.FC<ICauseCardProps> = ({ cause }) => {
  const getDisplayedImage = () => {
    if (!cause.imageUrl) {
      return (
        <img
          src={getAvatar(cause.from)}
          alt="Organization avatar"
          className="object-cover h-full w-auto m-auto"
        />
      )
    } else {
      return (
        <MediaRenderer
          src={cause.imageUrl}
          alt="Volunteer opportunity related image"
          className="object-cover h-full w-full m-auto"
        />
      )
    }
  }

  const [totalDonatedIsLoading, setTotalDonatedIsLoading] =
    useState<boolean>(false)
  const [totalDonated, setTotalDonated] = useState<number>(0)

  const getTotalDonated = async () => {
    setTotalDonatedIsLoading(true)
    try {
      let total = 0

      const publication = await lensClient().publication.fetch({
        publicationId: cause.post_id
      })

      if (publication === null || !isPost(publication)) {
        throw Error('Incorrect publication type!')
      }
      if (publication.collectModule.__typename !== 'FeeCollectModuleSettings')
        throw Error('Incorrect collect module!')

      total +=
        publication.stats.totalAmountOfCollects *
        parseFloat(publication.collectModule.amount.value)

      // get comment totals
      const comments = await lensClient().publication.fetchAll({
        commentsOf: cause.post_id,
        metadata: {
          tags: { all: [PostTags.Donate.SetAmount] }
        }
      })

      comments.items
        .filter((p) => !p.hidden)
        .filter(isComment)
        .forEach((comment) => {
          if (comment.collectModule.__typename === 'FeeCollectModuleSettings')
            total +=
              comment.stats.totalAmountOfCollects *
              parseFloat(comment.collectModule.amount.value)
        })

      setTotalDonated(total)
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    } finally {
      setTotalDonatedIsLoading(false)
    }
  }

  useEffect(() => {
    getTotalDonated()
  }, [totalDonated])

  return (
    <div
      onClick={() => {
        window.open(`/project/${cause.post_id}`, '_blank')
      }}
    >
      <Card className="w-80 h-96 my-5 p-2 flex flex-col items-stretch justify-between transition duration-100 hover:scale-105 hover:cursor-pointer">
        <div className="flex flex-col items-stretch h-full">
          <div className="w-full h-[200px]">{getDisplayedImage()}</div>
          <p className="text-lg text-brand-600 font-semibold leading-7 mt-2">
            {formatLocation(
              cause.location ? cause.location : 'Canada-Alberta-Calgary'
            )}
          </p>
          <p className="text-lg font-semibold leading-7">{cause.name}</p>
          <p className="text-lg grow overflow-auto">{cause.description}</p>
          {totalDonatedIsLoading ? (
            <Spinner />
          ) : (
            <div className="mt-auto">
              {/* <p className="text-zinc-500 text-xs"> */}
              {/*   Last donation X minutes ago */}
              {/* </p> */}
              <Progress
                progress={totalDonated}
                total={parseFloat(cause.goal)}
              />
              <p className="text-sm font-bold line-clamp-2">
                {totalDonated}{' '}
                {CURRENCIES[cause.currency as keyof typeof CURRENCIES].symbol}{' '}
                raised out of {cause.goal}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default CauseCard
