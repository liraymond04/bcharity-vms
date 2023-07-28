import { ExternalLinkIcon, HomeIcon } from '@heroicons/react/outline'
import {
  MetadataAttributeOutputFragment,
  PublicationFragment
} from '@lens-protocol/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getIPFSBlob from '@/lib/ipfs/getIPFSBlob'
import usePublication from '@/lib/lens-protocol/usePublication'
import { PostTags } from '@/lib/types'
import Custom404 from '@/pages/404'

import { GridItemTwelve, GridLayout } from '../GridLayout'
import ApplyButton from '../Shared/ApplyButton'
import BookmarkButton from '../Shared/BookmarkButton'
import FollowButton from '../Shared/FollowButton'
import Slug from '../Shared/Slug'
import { Button } from '../UI/Button'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'

const VolunteerPage: NextPage = () => {
  const { t } = useTranslation('common')
  const {
    query: { id },
    isReady
  } = useRouter()

  const { data, loading, fetch, error } = usePublication()

  useEffect(() => {
    if (isReady && id) {
      fetch({ publicationId: Array.isArray(id) ? '' : id })
    }
  }, [id, isReady])

  const attributeExists = (
    attributes: MetadataAttributeOutputFragment[],
    attribute: string
  ) => {
    return (
      attributes?.length &&
      attributes.filter((item) => {
        return item.traitType === attribute
      }).length !== 0
    )
  }

  const getAttribute = (
    attributes: MetadataAttributeOutputFragment[],
    attribute: string
  ) => {
    return (
      attributes?.length &&
      attributes
        .filter((item) => {
          return item.traitType === attribute
        })
        .at(0)?.value
    )
  }

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

  const Body = ({ post }: { post: PublicationFragment | undefined }) => {
    const [resolvedImageUrl, setResolvedImageUrl] = useState('')

    useEffect(() => {
      if (
        post?.__typename === 'Post' &&
        attributeExists(post.metadata.attributes, 'imageUrl') &&
        getAttribute(post.metadata.attributes, 'imageUrl')?.toString() !== '' &&
        getAttribute(post.metadata.attributes, 'imageUrl')?.toString() !==
          undefined
      ) {
        getIPFSBlob(
          getAttribute(post.metadata.attributes, 'imageUrl')?.toString() ?? ''
        ).then((url) => setResolvedImageUrl(url))
      }
    }, [post])

    return (
      post?.__typename === 'Post' &&
      (post.metadata.attributes?.length &&
      post.metadata.attributes[0].value !== PostTags.OrgPublish.Opportunity ? (
        <WrongPost />
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <BookmarkButton
                publicationId={post.id}
                postTag={PostTags.Bookmark.Opportunity}
              />
              <div className="text-2xl font-bold text-brand-600">
                {attributeExists(post.metadata.attributes, 'opportunity_name')
                  ? getAttribute(post.metadata.attributes, 'opportunity_name')
                  : getAttribute(post.metadata.attributes, 'name')}
              </div>
              <div className="text-xl text-gray-400 font-bold pl-5">
                {getAttribute(post.metadata.attributes, 'category')}
              </div>
            </div>
            <div className="font-semibold">
              Valid from:
              {attributeExists(post.metadata.attributes, 'dates') ? (
                <div>
                  {`${getAttribute(post.metadata.attributes, 'dates')
                    ?.toString()
                    .replaceAll('-', '/')} - Ongoing`}
                </div>
              ) : (
                <div>
                  {`${getAttribute(post.metadata.attributes, 'startDate')
                    ?.toString()
                    .replaceAll('-', '/')} - ${
                    attributeExists(post.metadata.attributes, 'endDate')
                      ? getAttribute(
                          post.metadata.attributes,
                          'endDate'
                        )?.toString() !== '' &&
                        getAttribute(
                          post.metadata.attributes,
                          'endDate'
                        )?.toString() !== undefined
                        ? getAttribute(post.metadata.attributes, 'endDate')
                            ?.toString()
                            .replaceAll('-', '/')
                        : 'Ongoing'
                      : 'Ongoing'
                  }`}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-3 items-center">
            <Slug prefix="@" slug={post.profile.handle} />
            <FollowButton followId={post.profile.id} />
          </div>
          <div className="pt-6 pb-4">
            {getAttribute(post.metadata.attributes, 'description')}
          </div>
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
            {getAttribute(post.metadata.attributes, 'website') !== '' && (
              <Link
                href={
                  getAttribute(
                    post.metadata.attributes,
                    'website'
                  )?.toString() ?? ''
                }
                target="_blank"
                className="flex"
              >
                <div className="flex items-center text-brand-600">
                  <div className="mr-1 whitespace-nowrap">External url</div>
                  <ExternalLinkIcon className="w-4 h-4 inline-flex mb-1" />
                </div>
              </Link>
            )}
            <ApplyButton
              hoursDefault={
                getAttribute(
                  post.metadata.attributes,
                  'hoursPerWeek'
                )?.toString() ?? ''
              }
              publicationId={post.id}
              organizationId={post.profile.id}
            />
          </div>
        </div>
      ))
    )
  }

  return (
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
            <Body post={data} />
          )}
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerPage
