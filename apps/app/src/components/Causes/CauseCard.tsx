import { MediaRenderer } from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { CURRENCIES } from '@/constants'
import { formatLocation } from '@/lib/formatLocation'
import { getAvatar, lensClient } from '@/lib/lens-protocol'
import { CauseMetadata, isComment, isPost, PostTags } from '@/lib/metadata'

import Progress from '../Shared/Progress'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'

/**
 * Properties of {@link CauseCard}
 */
export interface ICauseCardProps {
  /**
   * Cause metadata to display
   */
  cause: CauseMetadata
}

/**
 * Individual cause post card displayed in the {@link Causes} page. Redirects
 * to individual cause post page when clicked. Displayed cause post information
 * is passed as cause post metadata in its properties.
 *
 * Total contribution amounts are calculated by fetching the number of collects
 * on a post or comment and multiplying by its contribution amount. This
 * calculation works because contribution amounts on publication posts are
 * immutable. However, this means that comments under the original cause post
 * need to be queried for their collects, because different contribution amounts
 * are done by creating an identical collect module with a different collect
 * amount as a comment.
 */
const CauseCard: React.FC<ICauseCardProps> = ({ cause }) => {
  const { t } = useTranslation('common', { keyPrefix: 'components.causes' })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

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
          className="!object-cover !h-full !w-full m-auto"
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
        forId: cause.post_id
      })

      if (publication === null || !isPost(publication)) {
        throw Error(e('incorrect-publication-type'))
      }
      // TODO: CHECK IF THIS IS THE CORRECT WAY TO ADD UP ALL COLLECT VALUES
      for (let openModule of publication.openActionModules) {
        if (
          openModule.__typename !== 'LegacyAaveFeeCollectModuleSettings' &&
          openModule.__typename !== 'LegacyERC4626FeeCollectModuleSettings' &&
          openModule.__typename !== 'LegacyFeeCollectModuleSettings' &&
          openModule.__typename !== 'LegacyLimitedFeeCollectModuleSettings' &&
          openModule.__typename !==
            'LegacyLimitedTimedFeeCollectModuleSettings' &&
          openModule.__typename !==
            'LegacyMultirecipientFeeCollectModuleSettings' &&
          openModule.__typename !== 'LegacySimpleCollectModuleSettings' &&
          openModule.__typename !== 'LegacyTimedFeeCollectModuleSettings' &&
          openModule.__typename !==
            'MultirecipientFeeCollectOpenActionSettings' &&
          openModule.__typename !== 'SimpleCollectOpenActionSettings'
        ) {
          throw Error(e('incorrect-collect-module'))
        }
        total +=
          publication.stats.collects * parseFloat(openModule.amount.value)
        // if (module.__typename === 'LegacyFreeCollectModuleSettings' || module.__typename === 'LegacyRevertCollectModuleSettings' || module.__typename === 'UnknownOpenActionModuleSettings')
      }

      // get comment totals
      const comments = await lensClient().publication.fetchAll({
        where: {
          commentOn: { id: cause.post_id },
          metadata: {
            tags: { all: [PostTags.Donate.SetAmount] }
          }
        }
      })

      comments.items
        .filter((p) => !p.isHidden)
        .filter(isComment)
        .forEach((comment) => {
          // TODO: CHECK IF THIS IS THE CORRECT WAY TO ADD UP ALL COLLECT VALUES
          for (let openModule of publication.openActionModules) {
            if (
              openModule.__typename !== 'LegacyAaveFeeCollectModuleSettings' &&
              openModule.__typename !==
                'LegacyERC4626FeeCollectModuleSettings' &&
              openModule.__typename !== 'LegacyFeeCollectModuleSettings' &&
              openModule.__typename !==
                'LegacyLimitedFeeCollectModuleSettings' &&
              openModule.__typename !==
                'LegacyLimitedTimedFeeCollectModuleSettings' &&
              openModule.__typename !==
                'LegacyMultirecipientFeeCollectModuleSettings' &&
              openModule.__typename !== 'LegacySimpleCollectModuleSettings' &&
              openModule.__typename !== 'LegacyTimedFeeCollectModuleSettings' &&
              openModule.__typename !==
                'MultirecipientFeeCollectOpenActionSettings' &&
              openModule.__typename !== 'SimpleCollectOpenActionSettings'
            ) {
              throw Error(e('incorrect-collect-module'))
            }
            total +=
              comment.stats.collects * parseFloat(openModule.amount.value)
          }
          // if (comment.collectModule.__typename === 'FeeCollectModuleSettings')
          //   total +=
          //     comment.stats.totalAmountOfCollects *
          //     parseFloat(comment.collectModule.amount.value)
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
          <p className="text-lg font-semibold leading-7 truncate shrink-0">
            {cause.name}
          </p>
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
              <p
                className="text-sm font-bold line-clamp-2"
                suppressHydrationWarning
              >
                {totalDonated}{' '}
                {CURRENCIES[cause.currency as keyof typeof CURRENCIES].symbol}{' '}
                {t('raised')} {cause.goal}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default CauseCard
