import SEO from '@components/utils/SEO'
import { SearchIcon } from '@heroicons/react/outline'
import { PublicationSortCriteria } from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

import getCauseMetadata from '@/lib/lens-protocol/getCauseMetadata'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { CauseMetadata } from '@/lib/metadata'
import { PostTags } from '@/lib/types'

import DashboardDropDown from '../Dashboard/VolunteerDashboard/DashboardDropDown'
import { GridItemFour, GridLayout } from '../GridLayout'
import Divider from '../Shared/Divider'
import { Spinner } from '../UI/Spinner'
import CauseCard from './CauseCard'

const Causes: NextPage = () => {
  const [posts, setPosts] = useState<CauseMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())

  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const [searchValue, setSearchValue] = useState('')

  const {
    data,
    error: exploreError,
    loading
  } = useExplorePublications(
    {
      sortCriteria: PublicationSortCriteria.Latest,
      metadata: {
        tags: { oneOf: [PostTags.OrgPublish.Cause] }
      },
      noRandomize: true
    },
    true
  )

  // const posts = useMemo(() => getCauseMetadata(data), [data])

  useEffect(() => {
    let _posts: CauseMetadata[] = []
    let _categories: Set<string> = new Set()
    const metadata = getCauseMetadata(data)
    metadata.forEach((post) => {
      _posts.push(post)
      if (post.category) _categories.add(post.category)
    })
    setPosts(_posts)
    setCategories(_categories)
  }, [data])

  return (
    <>
      <SEO title="Fundraisers • BCharity VMS" />
      {/* <DonateToCauseModal /> */}
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5">
        <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
          <div className="flex justify-between w-[300px] h-[50px] bg-white items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-black">
            <input
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none  bg-transparent rounded-2xl w-[250px]"
              type="text"
              value={searchValue}
              placeholder="Search"
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <div className="h-5 w-5 mr-5">
              <SearchIcon />
            </div>
          </div>

          <div className="flex flex-wrap gap-y-5 justify-around w-[420px] items-center">
            <div className="h-[50px] z-10 ">
              <DashboardDropDown
                label="Filter:"
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <button
              className="ml-3 min-w-[110px] h-fit text-red-500 bg-[#ffc2d4] border-red-500 border-2 rounded-md px-2 hover:bg-red-500 hover:text-white hover:cursor-pointer"
              onClick={() => {
                setSelectedCategory('')
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        <Divider className="mt-5" />
        <p className="font-bold text-2xl"> Browse Fundraisers </p>
      </div>
      {loading ? (
        <div className="flex justify-center">
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
              <GridItemFour key={post.cause_id}>
                <CauseCard cause={post} />
              </GridItemFour>
            ))}
        </GridLayout>
      )}
      {exploreError && (
        <div className="text-sm text-center">Something went wrong.</div>
      )}
    </>
  )
}

export default Causes
