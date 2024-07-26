import { PostFragment } from '@lens-protocol/client'
import { MediaRenderer } from '@thirdweb-dev/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { CURRENCIES } from '@/constants'
import { formatLocation } from '@/lib/formatLocation'
import { getAvatar, lensClient, usePublication } from '@/lib/lens-protocol'
import {
  CauseMetadata,
  CauseMetadataBuilder,
  InvalidMetadataException,
  isComment,
  isPost,
  PostTags
} from '@/lib/metadata'

import { GridItemTwelve, GridLayout } from '../GridLayout'
import BookmarkButton from '../Shared/BookmarkButton'
import DonateButton from '../Shared/DonateButton'
import FollowButton from '../Shared/FollowButton'
import Progress from '../Shared/Progress'
import ErrorBody from '../Shared/PublicationPage/ErrorBody'
import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'
import SEO from '../utils/SEO'

/**
 * Component that displays an individual causes page
 *
 * Post information is grabbed by using the publication id passed by the Next.js
 * dynamic router, and used in the {@link usePublication} hook to fetch the post
 * from Lens. Donations are handled by the {@link DonateButton}.
 *
 * Total contribution amounts are calculated by fetching the number of collects
 * on a post or comment and multiplying by its contribution amount. This
 * calculation works because contribution amounts on publication posts are
 * immutable. However, this means that comments under the original cause post
 * need to be queried for their collects, because different contribution amounts
 * are done by creating an identical collect module with a different collect
 * amount as a comment.
 */
const CausePage: NextPage = () => {
  const { t } = useTranslation('common', { keyPrefix: 'components.causes' })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const {
    query: { id },
    asPath
  } = useRouter()

  const { data, loading, error } = usePublication({
    publicationId: Array.isArray(id) ? '' : id
  })

  const [wrongPostType, setWrongPostType] = useState(false)
  const [malformedMetadata, setMalformedMetadata] = useState(false)

  const cause = useMemo(() => {
    if (!data) return
    if (!isPost(data)) {
      setWrongPostType(true)
      return
    }

    try {
      return new CauseMetadataBuilder(data).build()
    } catch (e) {
      if (e instanceof InvalidMetadataException) {
        setMalformedMetadata(true)
      }
    }
  }, [data])

  const [totalDonatedIsLoading, setTotalDonatedIsLoading] =
    useState<boolean>(false)
  const [totalDonated, setTotalDonated] = useState<number>(0)

  const getTotalDonated = useCallback(async () => {
    setTotalDonatedIsLoading(true)
    try {
      let total = 0

      if (!cause) throw Error('Publication is null!')

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
  }, [cause, e])

  useEffect(() => {
    if (cause) {
      getTotalDonated()
    }
  }, [totalDonated, cause, getTotalDonated])

  const getErrorMessage = () => {
    if (!!error || !data) {
      return error
    }
    if (wrongPostType) {
      return e('incorrect-publication-type')
    } else if (malformedMetadata) {
      return e('metadata-malformed')
    }

    return e('generic')
  }

  const Body = ({
    cause,
    post
  }: {
    cause: CauseMetadata
    post: PostFragment
  }) => {
    const copyToClipboard = () => {
      const host = window.location.host
      const baseUrl = host.split(':').at(0) === 'localhost' ? 'http' : 'https'
      const url = `${baseUrl}://${host}${asPath}`
      navigator.clipboard.writeText(url)
      toast.success('Copied url to clipboard')
    }

    if (!cause || !data || !isPost(data)) return <Spinner />

    return (
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 items-center overflow-hidden">
            <BookmarkButton
              publicationId={cause.post_id}
              postTag={PostTags.Bookmark.Cause}
            />
            <div className="text-2xl font-bold p-2 bg-purple-300 dark:bg-info-content rounded-lg truncate text-ellipsis">
              {cause.name}
            </div>
            <div className="text-xl text-gray-400 font-bold pl-5 min-w-[30%] truncate text-ellipsis">
              -{cause.category}
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className=" w-2/3">
            <div className="flex space-x-3 items-center mt-8">
              <div className="flex flex-row">
                <FollowButton followId={cause.from.id} size="lg" />
                <div className="ml-5 mt-1 text-xl" suppressHydrationWarning>
                  {totalDonated < parseFloat(cause.goal)
                    ? t('status-accepting')
                    : t('status-not-accepting')}
                </div>
              </div>
            </div>

            {cause.imageUrl && (
              <div>
                <MediaRenderer
                  key="attachment"
                  className="object-cover h-50 rounded-lg"
                  src={cause.imageUrl}
                  alt={'image attachment'}
                />
              </div>
            )}
            <div className="flex flex-row items-center m-2">
              <img
                className=" w-8 h-8 mr-2 rounded-full"
                src={getAvatar(cause.from)}
                alt="Rounded avatar"
              />
              <div
                className="text-xl font-semibold text-gray-600 dark:text-white"
                suppressHydrationWarning
              >
                {cause.from.handle?.fullHandle} {t('organizing')}
              </div>
            </div>
            <div className="mt-10 text-3xl font-bold " suppressHydrationWarning>
              {t('about')}
            </div>

            <div
              className="pt-6 pb-4 mr-10 text-xl font-semibold text-gray-600 dark:text-white"
              suppressHydrationWarning
            >
              {cause.description}
            </div>

            <DonateButton
              size="lg"
              className="mr-10"
              post={post}
              cause={cause}
            />
            <Button size="lg" className="mr-10 ml-56" onClick={copyToClipboard}>
              {t('share')}
            </Button>

            <div
              className="text-3xl font-semibold text-gray-800 dark:text-white mt-10"
              suppressHydrationWarning
            >
              {t('organizer')}
            </div>
            <div className="flex flex-row">
              <div className="text-2xl font-semibold text-gray-600 dark:text-white">
                {cause.from.handle?.fullHandle}
                <div className="text-xl">{formatLocation(cause.location)}</div>
              </div>
            </div>
            <button className="  mt-6 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 dark:text-white rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span
                className="relative w-32 px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
                suppressHydrationWarning
              >
                {t('contact')}
              </span>
            </button>
          </div>
          <div className="py-10 shadow-xl w-1/3 bg-slate-100 dark:bg-indigo-950 rounded-md">
            {totalDonatedIsLoading ? (
              <div className="flex justify-center items-center mb-10">
                <Spinner />
              </div>
            ) : (
              <div>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-purple-500 dark:text-white sm:text-7xl pl-10 pr-3">
                    {totalDonated}
                  </div>
                  <div className="text-xl font-bold text-black dark:text-white sm:text-xl mt-8 break-all pr-2">
                    {`${
                      CURRENCIES[cause.currency as keyof typeof CURRENCIES]
                        ?.symbol
                    } raised out of ${cause.goal}`}
                  </div>
                </div>

                <Progress
                  progress={totalDonated}
                  total={parseFloat(cause.goal)}
                  className="mt-10 mb-10 ml-5 mr-5 p-1"
                />
              </div>
            )}

            <div className="font-semibold text-2xl ">
              <DonateButton
                size="lg"
                className="relative h-12 w-5/6 mr-10 ml-8"
                post={post}
                cause={cause}
              />
              <Button
                size="lg"
                className="mr-10 mt-5 h-12 w-5/6 ml-8"
                onClick={copyToClipboard}
              >
                {t('share')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getDisplayed = () => {
    if (loading) {
      return (
        <center className="p-20">
          <Spinner />
        </center>
      )
    } else if (
      !data ||
      wrongPostType ||
      malformedMetadata ||
      !cause ||
      !isPost(data)
    ) {
      return <ErrorBody message={getErrorMessage()} />
    } else {
      return <Body cause={cause} post={data} />
    }
  }

  return (
    <>
      <SEO title="Project • BCharity VMS" />
      <GridLayout>
        <GridItemTwelve>
          <Card>{getDisplayed()}</Card>
        </GridItemTwelve>
      </GridLayout>
    </>
  )
}

export default CausePage
