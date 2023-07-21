import { GridItemFour, GridLayout } from '@components/GridLayout'
import Search from '@components/Shared/Search'
import SEO from '@components/utils/SEO'
import { PublicationSortCriteria } from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { OpportunityMetadata, PostTags } from '@/lib/types'

import Divider from '../Shared/Divider'
import FilterDropdown from '../Shared/FilterDropdown'
import { Spinner } from '../UI/Spinner'
import VolunteerCard from './VolunteerCard'

const Volunteers: NextPage = () => {
  const [posts, setPosts] = useState<OpportunityMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())

  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const [searchValue, setSearchValue] = useState('')

  const { data, error, loading } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: {
      tags: {
        oneOf: [PostTags.OrgPublish.Opportuntiy]
      }
    }
  })

  useEffect(() => {
    let _posts: OpportunityMetadata[] = []
    let _categories: Set<string> = new Set()
    const metadata = getOpportunityMetadata(data)
    metadata.forEach((post) => {
      _posts.push(post)
      if (post.category) _categories.add(post.category)
    })
    setPosts(metadata)
    setCategories(_categories)
  }, [data])

  return (
    <>
      <SEO title="Volunteers • BCharity VMS" />
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5 font-bold text-2xl">
        <div className="flex justify-between py-5">
          <Search searchText={searchValue} setSearchText={setSearchValue} />
          <FilterDropdown
            label="Filter:"
            onChange={(c) => setSelectedCategory(c)}
            options={Array.from(categories)}
          />
        </div>
        <Divider />
        <p>Browse volunteer opportunities</p>
      </div>
      {loading ? (
        <div className="flex justify-center m-5">
          <Spinner />
        </div>
      ) : (
        <GridLayout>
          {posts
            .filter(
              (post) =>
                selectedCategory === '' || post.category === selectedCategory
            )
            .map((post) => (
              <GridItemFour key={post?.opportunity_id}>
                <VolunteerCard post={post} />
              </GridItemFour>
            ))}
        </GridLayout>
      )}
      {error && (
        <div className="text-sm text-red-700 dark:text-red-200">
          Something went wrong
        </div>
      )}
    </>
  )
}

export default Volunteers
