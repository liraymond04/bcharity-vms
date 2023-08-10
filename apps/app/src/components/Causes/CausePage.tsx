import { HomeIcon } from '@heroicons/react/outline'
import { MediaRenderer } from '@thirdweb-dev/react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { CURRENCIES } from '@/constants'
import getAvatar from '@/lib/getAvatar'
import lensClient from '@/lib/lens-protocol/lensClient'
import usePublication from '@/lib/lens-protocol/usePublication'
import {
  CauseMetadataBuilder,
  InvalidMetadataException,
  isComment,
  isPost,
  PostTags
} from '@/lib/metadata'
import Custom404 from '@/pages/404'

import { GridItemTwelve, GridLayout } from '../GridLayout'
import BookmarkButton from '../Shared/BookmarkButton'
import FollowButton from '../Shared/FollowButton'
import Progress from '../Shared/Progress'
import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'
import SEO from '../utils/SEO'

const CausePage: NextPage = () => {
  const { t } = useTranslation('common', { keyPrefix: 'components.causes' })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const { data, loading, fetch, error } = usePublication()
  const {
    query: { id },
    isReady
  } = useRouter()

  const [wrongPostType, setWrongPostType] = useState(false)

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
        setWrongPostType(true)
      }
    }
    return ''
  }, [data])

  useEffect(() => {
    if (isReady && id) {
      fetch({ publicationId: Array.isArray(id) ? '' : id })
    }
  }, [id, isReady])

  const [totalDonatedIsLoading, setTotalDonatedIsLoading] =
    useState<boolean>(false)
  const [totalDonated, setTotalDonated] = useState<number>(0)

  const getTotalDonated = async () => {
    setTotalDonatedIsLoading(true)
    try {
      let total = 0

      if (!cause) throw Error('Publication is null!')

      const publication = await lensClient().publication.fetch({
        publicationId: cause.post_id
      })

      if (publication === null || !isPost(publication)) {
        throw Error(e('incorrect-publication-type'))
      }
      if (publication.collectModule.__typename !== 'FeeCollectModuleSettings')
        throw Error(e('incorrect-collect-module'))

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
  }, [totalDonated, cause])

  const WrongPost = () => {
    return (
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold" suppressHydrationWarning>
          {e('Incorrect publication type')}
        </h1>
        <div className="mb-4" suppressHydrationWarning>
          {t('incorrect-url')}
        </div>
        <Link href="/">
          <Button
            className="flex mx-auto item-center"
            size="lg"
            icon={<HomeIcon className="w-4 h-4" />}
          >
            <div suppressHydrationWarning>{t('go-home')}</div>
          </Button>
        </Link>
      </div>
    )
  }

  const Body = () => {
    if (!cause || !data || !isPost(data)) return <Spinner />

    return wrongPostType ? (
      <WrongPost></WrongPost>
    ) : (
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <BookmarkButton
              publicationId={cause.post_id}
              postTag={PostTags.Bookmark.Cause}
            />
            <div className="text-5xl font-bold text-black dark:text-white p-2 bg-purple-300 dark:bg-indigo-950 rounded-lg">
              {cause.name}
            </div>
            <div className="text-3xl text-gray-400 font-bold pl-5">
              -{cause.category}
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className=" w-2/3">
            <div className="flex space-x-3 items-center mt-8">
              <div className="flex flex-row">
                <FollowButton followId={cause.from.id} size="lg" />
                <div className="ml-5 mt-1 text-xl">
                  Status: Accepting Donations
                </div>
              </div>
            </div>

            {cause.imageUrl && (
              <div>
                <MediaRenderer
                  key="attachment"
                  className="object-cover h-50 rounded-lg border-[3px] border-black margin mb-[20px]"
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
              <div className="text-xl font-semibold text-gray-600 dark:text-white">
                {cause.from.handle} is organizing this fundraiser
              </div>
            </div>
            <div className="mt-10 text-3xl font-bold ">About Organization:</div>

            <div className="pt-6 pb-4 mr-10 text-xl font-semibold text-gray-600 dark:text-white">
              dolor sit amet, consectetur adipiscing elit. Donec purus tellus,
              condimentum sit amet quam at, placerat cursus nulla. Etiam ex
              nibh, maximus ut egestas quis, gravida sit amet orci. Maecenas
              interdum est eget blandit venenatis. Aenean vulputate semper. quam
              at, placerat cursus nulla. Etiam ex nibh, maximus ut egestas quis,
              gravida sit amet orci. quam at, placerat cursus nulla. Etiam ex
              nibh, maximus ut egestas quis, gravida sit amet orci.
            </div>

            <Button size="lg" className="mr-10">
              Donate
            </Button>
            <Button size="lg" className="mr-10 ml-56 ">
              Share
            </Button>

            <div className="text-3xl font-semibold text-gray-800 dark:text-white mt-10">
              Organizer
            </div>
            <div className="flex flex-row">
              <div className="text-2xl font-semibold text-gray-600 dark:text-white">
                {cause.from.handle}
                <div className="text-xl">Calgary, AB</div>
              </div>
            </div>
            <button className="  mt-6 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 dark:text-white rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative w-32 px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Contact
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
                  <div className="text-xl font-bold text-black dark:text-white sm:text-xl mt-8">
                    {
                      CURRENCIES[cause.currency as keyof typeof CURRENCIES]
                        .symbol
                    }{' '}
                    raised out of {cause.goal}
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
              <Button size="lg" className="relative h-12 w-5/6 mr-10 ml-8">
                Donate Now
              </Button>
              <Button size="lg" className="mr-10 mt-5 h-12 w-5/6 ml-8">
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO title="Project • BCharity VMS" />
      <GridLayout>
        <GridItemTwelve>
          <Card>
            {loading ? (
              <center className="p-20">
                <Spinner />
              </center>
            ) : error || data === undefined ? (
              <Custom404 />
            ) : (
              <Body />
            )}
          </Card>
        </GridItemTwelve>
      </GridLayout>
    </>
  )
}

export default CausePage
