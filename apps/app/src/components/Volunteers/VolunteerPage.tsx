import { HomeIcon } from '@heroicons/react/outline'
import {
  MetadataAttributeOutputFragment,
  PublicationFragment
} from '@lens-protocol/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import usePublication from '@/lib/lens-protocol/usePublication'
import { PostTags } from '@/lib/types'
import Custom404 from '@/pages/404'

import { GridItemTwelve, GridLayout } from '../GridLayout'
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
    return (
      post?.__typename === 'Post' &&
      (post.metadata.attributes?.length &&
      post.metadata.attributes[0].value !== PostTags.OrgPublish.Opportuntiy ? (
        <WrongPost />
      ) : (
        <div className="p-3">
          {getAttribute(post.metadata.attributes, 'opportunity_name')} is a
          volunteer opportunity
        </div>
      ))
    )
  }

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          {loading ? (
            <Spinner />
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
