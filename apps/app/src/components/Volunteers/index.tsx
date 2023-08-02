import { GridItemFour, GridLayout } from '@components/GridLayout'
import SEO from '@components/utils/SEO'
import { SearchIcon } from '@heroicons/react/outline'
import { PublicationSortCriteria } from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'

import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { _om, PostTags } from '@/lib/types'

import DashboardDropDown from '../Dashboard/VolunteerDashboard/DashboardDropDown'
import Divider from '../Shared/Divider'
import { Spinner } from '../UI/Spinner'
import VolunteerCard from './VolunteerCard'

const Volunteers: NextPage = () => {
  const [posts, setPosts] = useState<[_om, string][]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())

  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const [searchValue, setSearchValue] = useState('')

  const { data, error, loading, pageInfo, fetchMore } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: {
      tags: {
        oneOf: [PostTags.OrgPublish.Opportunity]
      }
    },
    noRandomize: true
  })

  useEffect(() => {
    let _posts: [_om, string][] = []
    let _categories: Set<string> = new Set()
    const metadata = getOpportunityMetadata(data)
    metadata.forEach((post) => {
      _posts.push([post, post.id])
      if (post.category) _categories.add(post.category)
    })
    setPosts(_posts)
    setCategories(_categories)
  }, [data])

  const { observe } = useInView({
    onChange: async ({ unobserve, inView }) => {
      if (pageInfo?.next && inView) {
        unobserve()
        fetchMore(pageInfo?.next)
      }
    }
  })

  return (
    <>
      <SEO title="Volunteers • BCharity VMS" />
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
        <p className="font-bold text-2xl">Browse volunteer opportunities</p>
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
                selectedCategory === '' || post[0].category === selectedCategory
            )
            .map((post, idx, arr) => (
              <GridItemFour key={post[0]?.opportunity_id}>
                <span ref={idx === arr.length - 1 ? observe : null}>
                  <VolunteerCard post={post[0]} id={post[1]} />
                </span>
              </GridItemFour>
            ))}
          {pageInfo?.next && (
            <span className="flex justify-center p-5">
              <Spinner size="md" />
            </span>
          )}
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
