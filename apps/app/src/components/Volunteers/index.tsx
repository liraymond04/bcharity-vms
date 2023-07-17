import { GridItemFour, GridLayout } from '@components/GridLayout'
import Search from '@components/Shared/Search'
import { Card } from '@components/UI/Card'
import SEO from '@components/utils/SEO'
import { PublicationSortCriteria } from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect } from 'react'

import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'

import { Spinner } from '../UI/Spinner'

const Volunteers: NextPage = () => {
  const { data, error, loading } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: {
      tags: {
        oneOf: ['ORG_PUBLISH_OPPORTUNITY']
      }
    }
  })

  useEffect(() => {
    console.log(data)
    console.log(getOpportunityMetadata(data))
  }, [data])

  return (
    <>
      <SEO title="Volunteers • BCharity VMS" />
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5 font-bold text-2xl">
        <div className="flex justify-between my-5">
          <Search />
        </div>
        Browse volunteer opportunities
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <GridLayout>
          {getOpportunityMetadata(data).map((post) => (
            <GridItemFour key={'pub'}>
              <Card>{post?.category}</Card>
            </GridItemFour>
          ))}
        </GridLayout>
      )}
    </>
  )
}

export default Volunteers
