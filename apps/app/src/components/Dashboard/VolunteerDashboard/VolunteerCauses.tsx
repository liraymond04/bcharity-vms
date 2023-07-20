import { SearchIcon } from '@heroicons/react/outline'
import { PublicationSortCriteria } from '@lens-protocol/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import getAvatar from '@/lib/getAvatar'
import getCauseMetadata from '@/lib/lens-protocol/getCauseMetadata'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import testSearch from '@/lib/search'
import { CauseMetadata, PostTags } from '@/lib/types'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import BrowseCard from './BrowseCard'
import RegionDropdown from './RegionDropdown'

const VolunteerCauses: React.FC = () => {
  const [posts, setPosts] = useState<CauseMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('None')
  const [searchValue, setSearchValue] = useState('')

  const { isAuthenticated, currentUser } = useAppPersistStore()

  const [searchAddress, setSearchAddress] = useState<string>('')
  const [donationGoal, setDonationsGoal] = useState(500) // use hardcoded goal for now

  const { isLoading, data } = useWalletBalance(currentUser?.ownedBy ?? '')

  const {
    data: postData,
    error: postDataError,
    loading
  } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: {
      tags: { oneOf: [PostTags.OrgPublish.Cause] }
    }
  })

  useEffect(() => {
    let _categories: Set<string> = new Set()
    const _posts = getCauseMetadata(postData)

    _posts.forEach((post) => {
      if (post) {
        if (post.category) _categories.add(post.category)
      }
    })

    setCategories(_categories)
    setPosts(_posts)
  }, [postData])

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setSearchAddress(currentUser.ownedBy)
    }
  }, [currentUser, isAuthenticated])

  const Progress = ({
    progress,
    total,
    className
  }: {
    progress: number
    total: number
    className?: string
  }) => (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-full h-5 ">
        <div
          className="bg-green-400 h-5 rounded-full"
          style={{
            width: `${Math.min(Math.trunc((progress / total) * 100), 100)}%`
          }}
        ></div>
      </div>
    </div>
  )

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-10 m-10">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl">
                    Total donations:
                  </div>
                  <div className="text-2xl font-extrabold text-black dark:text-white sm:text-7xl pl-5">
                    ${Number(data?.value)}
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
                  progress={Number(data?.value)}
                  total={donationGoal}
                  className="mt-10 mb-10"
                />
                {Number(data?.value) < donationGoal ? (
                  <div className="text-2xl  font-semibold text-black dark:text-white sm:text-2x l">
                    {donationGoal - Number(data?.value)} away from goal!
                  </div>
                ) : (
                  <div className="text-2xl  font-semibold text-black dark:text-white sm:text-2xl">
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
          <div className="flex justify-between w-[300px] h-[50px] bg-white items-center rounded-md border-violet-300 border-2 ml-10 mr-10">
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
              <RegionDropdown
                label="Filter:"
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></RegionDropdown>
            </div>
            <button
              className="ml-3 min-w-[110px] h-fit text-red-500 bg-[#ffc2d4] border-red-500 border-2 rounded-md px-2 hover:bg-red-500 hover:text-white hover:cursor-pointer"
              onClick={() => {
                setSelectedCategory('None')
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-around">
          {!loading ? (
            posts
              .filter((op) => testSearch(op.name, searchValue))
              .filter(
                (op) =>
                  selectedCategory === '' || op.category === selectedCategory
              )
              .map((op, id) => (
                <BrowseCard
                  key={op.cause_id}
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
        {postDataError && <h1>error</h1>}
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerCauses
