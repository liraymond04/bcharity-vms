import { SearchIcon } from '@heroicons/react/outline'
import { PublicationSortCriteria } from '@lens-protocol/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import Progress from '@/components/Shared/Progress'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import getAvatar from '@/lib/getAvatar'
import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import testSearch from '@/lib/search'
import { OpportunityMetadata, PostTags } from '@/lib/types'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import Error from '../Modals/Error'
import BrowseCard from './BrowseCard'
import DashboardDropDown from './DashboardDropDown'

const VolunteerVHRTab: React.FC = () => {
  const { currentUser } = useAppPersistStore()
  const [posts, setPosts] = useState<OpportunityMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [vhrGoal, setVhrGoal] = useState(600) // use hardcoded goal for now
  const [searchValue, setSearchValue] = useState('')

  const {
    data: postData,
    error: postDataError,
    loading
  } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: {
      tags: { oneOf: [PostTags.OrgPublish.Opportuntiy] }
    },
    noRandomize: true
  })

  const { isLoading: isBalanceLoading, data: balanceData } = useWalletBalance(
    currentUser?.ownedBy ?? ''
  )

  useEffect(() => {
    let _categories: Set<string> = new Set()
    const _posts = getOpportunityMetadata(postData)
    _posts.forEach((post) => {
      if (post.category) _categories.add(post.category)
    })

    setCategories(_categories)
    setPosts(_posts)
  }, [postData])

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-10 m-10">
            {isBalanceLoading && !isNaN(Number(balanceData?.value)) ? (
              <Spinner />
            ) : (
              <>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl">
                    VHR Amount:
                  </div>
                  <div className="text-2xl font-extrabold text-black dark:text-white sm:text-7xl pl-10">
                    {Number(balanceData?.value)} / {vhrGoal}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600"
                  onClick={() => {
                    console.log('Set a goal')
                  }}
                >
                  Set a goal
                </Link>
                <Progress
                  progress={Number(balanceData?.value)}
                  total={vhrGoal}
                  className="mt-10 mb-10"
                />
                {Number(balanceData?.value) < vhrGoal ? (
                  <div className="text-2xl font-normal text-black dark:text-white sm:text-2x l">
                    {vhrGoal - Number(balanceData?.value)} away from goal!
                  </div>
                ) : (
                  <div className="text-2xl font-normal text-black dark:text-white sm:text-2xl">
                    Reached goal!
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </GridItemTwelve>
      <GridItemTwelve>
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
          <div className="flex flex-wrap justify-around">
            {!loading ? (
              posts
                .filter((op) => testSearch(op.name, searchValue))
                .filter(
                  (op) =>
                    selectedCategory === '' || op.category === selectedCategory
                )
                .map((op) => (
                  <BrowseCard
                    key={op.opportunity_id}
                    imageSrc={getAvatar(op.from)}
                    name={op.name}
                    buttonText="APPLY"
                    buttonHref="."
                  />
                ))
            ) : (
              <Spinner />
            )}
          </div>
          {postDataError && (
            <Error
              message={`An error occured: ${postDataError}. Please try again`}
            />
          )}
        </div>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerVHRTab
