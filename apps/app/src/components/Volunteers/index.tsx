import { GridItemFour, GridLayout } from '@components/GridLayout'
import SEO from '@components/utils/SEO'
import { SearchIcon } from '@heroicons/react/outline'
import { PublicationSortCriteria } from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'

import { useExplorePublications } from '@/lib/lens-protocol'
import {
  getOpportunityMetadata,
  OpportunityMetadata,
  PostTags
} from '@/lib/metadata'
import testSearch from '@/lib/search'

import Error from '../Dashboard/Modals/Error'
import DashboardDropDown from '../Dashboard/VolunteerDashboard/DashboardDropDown'
import ClearFilters from '../Shared/ClearFilters'
import Divider from '../Shared/Divider'
import { Spinner } from '../UI/Spinner'
import VolunteerCard from './VolunteerCard'

const Volunteers: NextPage = () => {
  const [posts, setPosts] = useState<OpportunityMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [org, setOrg] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedOrg, setSelectedOrg] = useState<string>('')
  const [searchValue, setSearchValue] = useState('')

  const {
    data,
    error: exploreError,
    loading,
    hasMore,
    fetchMore
  } = useExplorePublications(
    {
      sortCriteria: PublicationSortCriteria.Latest,
      metadata: {
        tags: {
          oneOf: [PostTags.OrgPublish.Opportunity]
        }
      },
      noRandomize: true
    },
    true
  )

  useEffect(() => {
    let _posts: OpportunityMetadata[] = []
    let _categories: Set<string> = new Set()
    let _Orgs: Set<string> = new Set()
    const metadata = getOpportunityMetadata(data)
    metadata.forEach((post) => {
      _posts.push(post)
      if (post.category) _categories.add(post.category)
      if (post.from.handle) _Orgs.add(post.from.handle)
    })
    setPosts(_posts)
    setCategories(_categories)
    setOrg(_Orgs)
  }, [data])

  const { observe } = useInView({
    onChange: async ({ unobserve, inView }) => {
      console.log(
        'on change: in view? %s | has more? %s | loading? %s',
        inView,
        hasMore,
        loading
      )
      if (inView) {
        if (hasMore) {
          fetchMore()
        } else {
          unobserve()
        }
      }
    }
  })

  return (
    <>
      <SEO title="Volunteers • BCharity VMS" />
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5">
        <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
          <div className="flex justify-between w-[300px] h-[50px] bg-white items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-Input">
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

          <div className="flex flex-wrap gap-y-5 justify-around w-[820px]">
            <div className="flex flex-row flex-wrap w-full items-center">
              <div className="h-[50px] my-2 z-20">
                <DashboardDropDown
                  label="Category:"
                  options={Array.from(categories)}
                  onClick={(c) => setSelectedCategory(c)}
                  selected={selectedCategory}
                ></DashboardDropDown>
              </div>
              <div className="h-[50px] my-2 z-10">
                <DashboardDropDown
                  label="Organization:"
                  options={Array.from(org)}
                  onClick={(c) => setSelectedOrg(c)}
                  selected={selectedOrg}
                ></DashboardDropDown>
              </div>
              <ClearFilters
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedOrg('')
                }}
              />
            </div>
          </div>
        </div>
        <Divider className="mt-5" />
        <p className="font-bold text-2xl">Browse volunteer opportunities</p>
      </div>
      <GridLayout>
        {posts
          .filter(
            (post) =>
              testSearch(post.name, searchValue) &&
              (selectedCategory === '' || post.category === selectedCategory) &&
              (selectedOrg === '' || post.from.handle === selectedOrg)
          )
          .map((post) => (
            <GridItemFour key={post.id}>
              <VolunteerCard post={post} />
            </GridItemFour>
          ))}

        <span
          className="flex justify-center p-5"
          ref={observe}
          hidden={!loading}
        >
          {loading && <Spinner size="md" />}
        </span>
      </GridLayout>
      {exploreError && (
        <Error
          message={`An error occured: ${exploreError}. Please try again.`}
        />
      )}
    </>
  )
}

export default Volunteers
