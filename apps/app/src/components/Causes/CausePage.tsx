import { HomeIcon } from '@heroicons/react/outline'
import { MediaRenderer } from '@thirdweb-dev/react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import usePublication from '@/lib/lens-protocol/usePublication'
import {
  CauseMetadataBuilder,
  InvalidMetadataException,
  isPost,
  PostTags
} from '@/lib/metadata'
import Custom404 from '@/pages/404'

import { GridItemTwelve, GridLayout } from '../GridLayout'
import BookmarkButton from '../Shared/BookmarkButton'
import DonateButton from '../Shared/DonateButton'
import FollowButton from '../Shared/FollowButton'
import Slug from '../Shared/Slug'
import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'
import SEO from '../utils/SEO'

const CausePage: NextPage = () => {
  const { data, loading, fetch, error } = usePublication()
  const { t } = useTranslation('common')
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

  const WrongPost = () => {
    return (
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          {t('Incorrect publication type')}
        </h1>
        <div className="mb-4">
          {t(
            'This publication cannot be accessed. Please check that your URL is correct.'
          )}
        </div>
        <Link href="/">
          <Button
            className="flex mx-auto item-center"
            size="lg"
            icon={<HomeIcon className="w-4 h-4" />}
          >
            <div>{t('Go Home')}</div>
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
          <div className="flex items-center space-x-1">
            <BookmarkButton
              publicationId={cause.post_id}
              postTag={PostTags.Bookmark.Cause}
            />
            <div className="text-2xl font-bold text-brand-600">
              {cause.name}
            </div>
            <div className="text-xl text-gray-400 font-bold pl-5">
              {cause.category}
            </div>
          </div>
        </div>
        <div className="flex space-x-3 items-center">
          <Slug prefix="@" slug={cause.from.handle} />
          <FollowButton followId={cause.from.id} />
        </div>
        <div className="pt-6 pb-4">{cause.description}</div>
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
        <div className="flex justify-end space-x-3">
          <DonateButton post={data} cause={cause} />
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO title="Cause Opportunity • BCharity VMS" />
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
