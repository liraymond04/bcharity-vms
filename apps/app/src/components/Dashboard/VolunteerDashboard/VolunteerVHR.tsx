import { SearchIcon } from '@heroicons/react/outline'
import {
  PublicationFragment,
  PublicationSortCriteria,
  PublicationsQueryRequest,
  PublicationTypes
} from '@lens-protocol/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import Progress from '@/components/Shared/Progress'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import getAvatar from '@/lib/getAvatar'
import lensClient from '@/lib/lens-protocol/lensClient'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import usePostData from '@/lib/lens-protocol/usePostData'
import { OpportunityMetadata } from '@/lib/metadata'
import { PostTags } from '@/lib/metadata'
import { getOpportunityMetadata } from '@/lib/metadata'
import testSearch from '@/lib/search'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import Error from '../Modals/Error'
import VHRGoalModal from '../Modals/VHRGoalModal'
import BrowseCard from './BrowseCard'
import DashboardDropDown from './DashboardDropDown'

const VolunteerVHRTab: React.FC = () => {
  const { currentUser: profile } = useAppPersistStore()
  const { currentUser } = useAppPersistStore()
  const [posts, setPosts] = useState<OpportunityMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [vhrGoal, setVhrGoal] = useState(600) // use hardcoded goal for now
  const [searchValue, setSearchValue] = useState('')
  const [GoalModalOpen, setGoalModalOpen] = useState(false)
  const { data, error, refetch } = usePostData({
    profileId: profile?.id,
    metadata: {
      tags: { all: [PostTags.OrgPublish.Opportunity] }
    }
  })
  const [postdata, setpostdata] = useState<PublicationFragment[]>([])

  const onPublishClose = (shouldRefetch: boolean) => {
    if (shouldRefetch) {
      refetch()
    }
  }

  const onGoalClose = (shouldRefetch: boolean) => {
    setGoalModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }
  const onGoalOpen = () => {
    setGoalModalOpen(true)
  }
  const {
    data: postData,
    error: postDataError,
    loading
  } = useExplorePublications(
    {
      sortCriteria: PublicationSortCriteria.Latest,
      metadata: {
        tags: { oneOf: [PostTags.OrgPublish.Opportunity] }
      },
      noRandomize: true
    },
    true
  )

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
  useEffect(() => {
    const param: PublicationsQueryRequest = {
      metadata: { tags: { all: [PostTags.OrgPublish.VHRGoal] } },
      profileId: profile!.id,
      publicationTypes: [PublicationTypes.Post]
    }

    lensClient()
      .publication.fetchAll(param)
      .then((data) => {
        setpostdata(data.items)
      })
  }, [profile])
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
                    {postdata[0]?.__typename === 'Post'
                      ? postdata[0]?.metadata.attributes[0]?.value
                      : ' '}
                    / {vhrGoal}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600 mt-6 ml-10"
                  onClick={onGoalOpen}
                >
                  Set a goal
                </Link>
                <Progress
                  progress={Number(balanceData?.value)}
                  total={vhrGoal}
                  className="mt-10 mb-10"
                />
              </>
            )}
          </div>
        </Card>
      </GridItemTwelve>
      <GridItemTwelve>
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
              className="ml-3 min-w-[110px] h-fit text-red-500 dark:text-indigo-400 bg-[#ffc2d4] dark:bg-indigo-200 border-red-500 dark:border-purple-800 border-2 rounded-md px-2 hover:bg-red-500 dark:hover:bg-indigo-300 hover:text-white hover:cursor-pointer"
              onClick={() => {
                setSelectedCategory('')
              }}
            >
              Clear Filters
            </button>
          </div>

          {postDataError && (
            <Error
              message={`An error occured: ${postDataError}. Please try again`}
            />
          )}
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
                  key={op.id}
                  imageSrc={op.imageUrl}
                  avatarSrc={getAvatar(op.from)}
                  name={op.name}
                  buttonText="APPLY"
                  buttonHref={op.website ?? '.'}
                />
              ))
          ) : (
            <Spinner />
          )}
          <VHRGoalModal
            open={GoalModalOpen}
            onClose={onGoalClose}
            publisher={profile}
          />
        </div>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerVHRTab
