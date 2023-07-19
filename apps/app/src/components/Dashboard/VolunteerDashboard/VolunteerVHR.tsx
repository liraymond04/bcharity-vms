import { SearchIcon } from '@heroicons/react/outline'
import { PublicationSortCriteria } from '@lens-protocol/client'
import { Inter } from '@next/font/google'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import Progress from '@/components/Shared/Progress'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import getAvatar from '@/lib/getAvatar'
import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { OpportunityMetadata, PostTags } from '@/lib/types'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import Error from '../Modals/Error'
import RegionDropdown from './RegionDropdown'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

const VolunteerVHRTab: React.FC = () => {
  const { currentUser } = useAppPersistStore()
  const [posts, setPosts] = useState<OpportunityMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('None')
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
    }
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

  const filterOpportunity = (name: string, search: string) => {
    const nameArr = name.split(' ')
    const searchArr = search.split(' ')
    let result = true
    searchArr.map((search) => {
      let found = false
      nameArr.map((name) => {
        let p0 = 0
        let p1 = 0
        while (p0 < name.length && p1 < search.length) {
          if (
            name.charAt(p0).toLowerCase() == search.charAt(p1).toLowerCase()
          ) {
            p0++, p1++
          } else {
            p0++
          }
        }
        if (p1 == search.length) {
          found = true
        }
      })
      if (!found) {
        result = false
      }
    })

    return result
  }

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
        <div className="flex justify-between">
          <div className="ml-5 w-[200px]"></div>
          <div className="flex justify-between w-[300px] h-[50px] bg-white items-center rounded-2xl border-violet-300 border-2 ml-10 mr-10">
            <input
              className="border-none bg-transparent rounded-2xl w-[250px]"
              type="text"
              value={searchValue}
              placeholder="search"
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <div className="h-5 w-5 mr-5">
              <SearchIcon />
            </div>
          </div>
          <div className="h-[60px] z-10">
            <RegionDropdown
              label="Filter:"
              options={Array.from(categories)}
              onClick={(c) => setSelectedCategory(c)}
              selected={selectedCategory}
            ></RegionDropdown>
          </div>
        </div>
        <div className="flex flex-wrap justify-around">
          {!loading ? (
            posts
              .filter((op) => filterOpportunity(op.name, searchValue))
              .filter(
                (op) =>
                  selectedCategory === 'None' ||
                  op.category === selectedCategory
              )
              .map((op, id) => (
                <div
                  key={id}
                  className="relative my-5 mx-5 w-[300px] h-[350px] bg-slate-100 border-8 border-white rounded-md"
                >
                  <img
                    src={getAvatar(op.from)}
                    className="h-[200px] w-full"
                    alt="organization profile picture"
                  />
                  <div
                    className={`flex justify-center text-center mt-5 text-xl ${inter500.className}`}
                  >
                    {op.name}
                  </div>
                  <Link
                    className={`flex justify-center bg-purple-500 py-1 px-12 w-20 rounded-3xl text-sm text-white absolute bottom-2 right-2 ${inter500.className}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    href="." // external link or /volunteer/[post-id] here
                  >
                    APPLY
                  </Link>
                </div>
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
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerVHRTab
