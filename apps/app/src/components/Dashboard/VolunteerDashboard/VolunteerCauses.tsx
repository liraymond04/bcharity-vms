import { SearchIcon } from '@heroicons/react/outline'
import { PostFragment, PublicationSortCriteria } from '@lens-protocol/client'
import {
  PublicationsQueryRequest,
  PublicationTypes
} from '@lens-protocol/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import ClearFilters from '@/components/Shared/ClearFilters'
import Progress from '@/components/Shared/Progress'
import GridRefreshButton from '@/components/Shared/RefreshButton'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import lensClient from '@/lib/lens-protocol/lensClient'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { CauseMetadata, isPost } from '@/lib/metadata'
import { PostTags } from '@/lib/metadata'
import { getCauseMetadata } from '@/lib/metadata'
import testSearch from '@/lib/search'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import GoalModal from '../Modals/GoalModal'
import BrowseCauseCard from './BrowseCauseCard'
import DashboardDropDown from './DashboardDropDown'

const VolunteerCauses: React.FC = () => {
  const [posts, setPosts] = useState<CauseMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchValue, setSearchValue] = useState('')

  const { isAuthenticated, currentUser } = useAppPersistStore()

  const [searchAddress, setSearchAddress] = useState<string>('')
  const [donationGoal, setDonationsGoal] = useState(0)

  const [GoalModalOpen, setGoalModalOpen] = useState(false)

  const { isLoading, data } = useWalletBalance(currentUser?.ownedBy ?? '')

  const {
    data: postData,
    error: postDataError,
    loading,
    refetch
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

  useEffect(() => {
    if (currentUser) {
      const param: PublicationsQueryRequest = {
        metadata: { tags: { all: [PostTags.OrgPublish.Goal] } },
        profileId: currentUser.id,
        publicationTypes: [PublicationTypes.Post]
      }

      lensClient()
        .publication.fetchAll(param)
        .then((data) => {
          setDonationsGoal(
            parseFloat(
              data.items[0] && isPost(data.items[0])
                ? data.items[0].metadata.attributes[0]?.value ?? '0'
                : '0'
            )
          )
        })
    }
  }, [currentUser])

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

  const onGoalClose = () => {
    setGoalModalOpen(false)
  }

  const onGoalOpen = () => {
    setGoalModalOpen(true)
  }

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
                  <div className="text-3xl font-extrabold text-purple-500 dark:text-white sm:text-7xl pl-10 pr-3">
                    {Number(data?.value)}
                  </div>
                  <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl mt-8">
                    VHR raised {donationGoal !== 0 && `out of ${donationGoal}`}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600"
                  onClick={onGoalOpen}
                >
                  Set a goal
                </Link>
                {donationGoal !== 0 && (
                  <Progress
                    progress={Number(data?.value)}
                    total={donationGoal}
                    className="mt-10 mb-10"
                  />
                )}
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
          <div className="flex justify-between w-[300px] h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-Input">
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
            <ClearFilters onClick={() => setSelectedCategory('')} />
          </div>
          <GridRefreshButton onClick={refetch} />

          {postDataError && <h1>error</h1>}
        </div>
        <div className="flex flex-wrap justify-around">
          {!loading ? (
            posts
              .filter((op) => testSearch(op.name, searchValue))
              .filter(
                (op) =>
                  selectedCategory === '' || op.category === selectedCategory
              )
              .map((op, i) => (
                <BrowseCauseCard
                  key={op.id}
                  cause={op}
                  post={postData[i] as PostFragment}
                />
              ))
          ) : (
            <Spinner />
          )}
        </div>
      </GridItemTwelve>

      <GoalModal
        open={GoalModalOpen}
        onClose={onGoalClose}
        publisher={currentUser}
      />
    </GridLayout>
  )
}

export default VolunteerCauses
