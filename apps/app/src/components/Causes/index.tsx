import SEO from '@components/utils/SEO'
import { PublicationSortCriteria } from '@lens-protocol/client'
import { NextPage } from 'next'
import { useMemo, useState } from 'react'

import getCauseMetadata from '@/lib/lens-protocol/getCauseMetadata'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { PostTags } from '@/lib/types'

import { GridItemFour, GridLayout } from '../GridLayout'
import Divider from '../Shared/Divider'
import FilterDropdown from '../Shared/FilterDropdown'
import Search from '../Shared/Search'
import { Spinner } from '../UI/Spinner'
import CauseCard from './CauseCard'

const Causes: NextPage = () => {
  const {
    data,
    error: exploreError,
    loading
  } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: {
      tags: { oneOf: [PostTags.OrgPublish.Cause] }
    }
  })

  const posts = useMemo(() => getCauseMetadata(data), [data])

  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      <SEO title="Fundraisers • BCharity VMS" />
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5 font-regular text-2xl">
        <div className="flex justify-between py-5">
          <Search searchText={searchValue} setSearchText={setSearchValue} />
          <FilterDropdown
            label="Filter:"
            onChange={(c) => console.log('filter', c)}
            options={['cause1', 'cause2', 'cause3']}
          />
        </div>
        <Divider />
        <p className="font-bold px-6"> Browse Fundraisers </p>
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <GridLayout>
            {posts.map((post) => (
              <GridItemFour key={post.cause_id}>
                <CauseCard cause={post} />
              </GridItemFour>
            ))}
          </GridLayout>
        )}
        {exploreError && (
          <div className="text-sm text-center">Something went wrong.</div>
        )}
      </div>
    </>
  )
}

export default Causes
