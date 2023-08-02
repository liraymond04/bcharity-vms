import { HomeIcon } from '@heroicons/react/outline'
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
import { PostTags } from '@/lib/metadata'
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

  useEffect(() => {
    if (isReady && id) {
      fetch({ publicationId: Array.isArray(id) ? '' : id })
    }
  }, [id, isReady])

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
      post.metadata.attributes[0].value !== PostTags.OrgPublish.Cause ? (
        <WrongPost />
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <BookmarkButton
                publicationId={post.id}
                postTag={PostTags.Bookmark.Cause}
              />
              <div className="text-2xl font-bold text-brand-600">
                {attributeExists(post.metadata.attributes, 'cause_name')
                  ? getAttribute(post.metadata.attributes, 'cause_name')
                  : getAttribute(post.metadata.attributes, 'name')}
              </div>
              <div className="text-xl text-gray-400 font-bold pl-5">
                {getAttribute(post.metadata.attributes, 'category')}
              </div>
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
            <DonateButton
              post={post}
              // publicationId={post.id}
              // organizationId={post.profile.id}
            />
          </div>
        </div>
      ))
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
              <Body post={data} />
            )}
          </Card>
        </GridItemTwelve>
      </GridLayout>
    </>
  )
}

export default CausePage
