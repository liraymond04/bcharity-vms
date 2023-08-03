import { ExternalLinkIcon, HomeIcon } from '@heroicons/react/outline'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getIPFSBlob from '@/lib/ipfs/getIPFSBlob'
import usePublication from '@/lib/lens-protocol/usePublication'
import {
  InvalidMetadataException,
  isPost,
  OpportunityMetadata,
  OpportunityMetadataBuilder
} from '@/lib/metadata'
import { PostTags } from '@/lib/metadata'
import Custom404 from '@/pages/404'

import { GridItemTwelve, GridLayout } from '../GridLayout'
import ApplyButton from '../Shared/ApplyButton'
import BookmarkButton from '../Shared/BookmarkButton'
import FollowButton from '../Shared/FollowButton'
import Slug from '../Shared/Slug'
import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'
import SEO from '../utils/SEO'

const VolunteerPage: NextPage = () => {
  const { t } = useTranslation('common')
  const {
    query: { id },
    isReady
  } = useRouter()

  const { data, loading, fetch, error } = usePublication()

  const [opoprtunityError, setOpportunityError] = useState(false)
  const [wrongPostType, setWrongPostType] = useState(false)

  const opportunity = useMemo(() => {
    if (!data) return
    if (!isPost(data)) {
      setWrongPostType(true)
      return
    }

    try {
      return new OpportunityMetadataBuilder(data).build()
    } catch (e) {
      if (e instanceof InvalidMetadataException) {
        setOpportunityError(true)
      }
    }
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
            'This publication is not a volunteer opportunity, please check that your URL is correct.'
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

  const getDateString = (o: OpportunityMetadata) => {
    const ongoing = !o.endDate

    if (ongoing) {
      return `${o.startDate} to ${o.endDate}`
    } else {
      return `${o.startDate} - Ongoing`
    }
  }

  const Body = () => {
    const [resolvedImageUrl, setResolvedImageUrl] = useState('')

    useEffect(() => {
      if (!opportunity) return
      if (opportunity.imageUrl) {
        getIPFSBlob(opportunity.imageUrl).then((url) =>
          setResolvedImageUrl(url)
        )
      }
    }, [opportunity])

    if (!opportunity) return <Spinner />

    return wrongPostType || opoprtunityError ? (
      <WrongPost />
    ) : (
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <BookmarkButton
              publicationId={opportunity.metadata_id}
              postTag={PostTags.Bookmark.Opportunity}
            />
            <div className="text-2xl font-bold text-brand-600">
              {opportunity.name}
            </div>
            <div className="text-xl text-gray-400 font-bold pl-5">
              {opportunity.category}
            </div>
          </div>
          <div className="font-semibold">
            Valid from: {getDateString(opportunity)}
          </div>
        </div>
        <div className="flex space-x-3 items-center">
          <Slug prefix="@" slug={opportunity.from.handle} />
          <FollowButton followId={opportunity.from.id} />
        </div>
        <div className="pt-6 pb-4">{opportunity.description}</div>
        {resolvedImageUrl && (
          <div>
            <img
              key="attachment"
              className="object-cover h-50 rounded-lg border-[3px] border-black margin mb-[20px]"
              src={resolvedImageUrl}
              alt={'image attachment'}
            />
          </div>
        )}
        <div className="flex justify-end space-x-3">
          {opportunity.website !== '' && (
            <Link href={opportunity.website} target="_blank" className="flex">
              <div className="flex items-center text-brand-600">
                <div className="mr-1 whitespace-nowrap">External url</div>
                <ExternalLinkIcon className="w-4 h-4 inline-flex mb-1" />
              </div>
            </Link>
          )}
          <ApplyButton
            hoursDefault={opportunity.hoursPerWeek}
            publicationId={opportunity.metadata_id}
            organizationId={opportunity.from.id}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO title="Volunteer Opportunity • BCharity VMS" />
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

export default VolunteerPage
