import { SearchIcon } from '@heroicons/react/outline'
import {
  ExplorePublicationsOrderByType,
  PostFragment
} from '@lens-protocol/client'
import { PublicationsRequest, PublicationType } from '@lens-protocol/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import ClearFilters from '@/components/Shared/ClearFilters'
import GridRefreshButton from '@/components/Shared/GridRefreshButton'
import Progress from '@/components/Shared/Progress'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import { lensClient, useExplorePublications } from '@/lib/lens-protocol'
import {
  CauseMetadata,
  getCauseMetadata,
  isPost,
  PostTags
} from '@/lib/metadata'
import testSearch from '@/lib/search'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import Error from '../Modals/Error'
import GoalModal from '../Modals/GoalModal'
import BrowseCauseCard from './BrowseCauseCard'
import DashboardDropDown from './DashboardDropDown'

/**
 * Component that displays the volunteer causes tab page, which displays
 * the total amount of VHR displayed, and a user defined goal. Cause posts
 * can be browsed, searched, filtered, and applied to in this tab.
 *
 * VHR raised is fetched using the {@link useWalletBalance} hook. Cause
 * posts are fetched using the {@link useExplorePublications} hook with
 * the metadata tag {@link PostTags.OrgPublish.Cause}, and filtered using
 * {@link testSearch} or {@link DashboardDropDown}.
 *
 * Individual post cards are displayed by passing their metadata to the
 * {@link BrowseCauseCard} component.
 */
const VolunteerCauses: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.volunteer.causes'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const { t: v } = useTranslation('common', {
    keyPrefix: 'components.profile.volunteer'
  })

  const [posts, setPosts] = useState<CauseMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchValue, setSearchValue] = useState('')

  const { isAuthenticated, currentUser } = useAppPersistStore()

  const [searchAddress, setSearchAddress] = useState<string>('')
  const [donationGoal, setDonationsGoal] = useState(0)

  const [GoalModalOpen, setGoalModalOpen] = useState(false)

  const { isLoading, data } = useWalletBalance(
    currentUser?.ownedBy.address ?? ''
  )

  const {
    data: postData,
    error: postDataError,
    loading,
    refetch
  } = useExplorePublications(
    {
      orderBy: ExplorePublicationsOrderByType.Latest,
      where: {
        metadata: {
          tags: { oneOf: [PostTags.OrgPublish.Cause] }
        }
        // noRandomize: true
      }
    },
    true
  )

  useEffect(() => {
    if (currentUser) {
      const param: PublicationsRequest = {
        where: {
          metadata: { tags: { all: [PostTags.OrgPublish.Goal] } },
          from: [currentUser.id],
          publicationTypes: [PublicationType.Post]
        }
      }

      lensClient()
        .publication.fetchAll(param)
        .then((data) => {
          if (data.items[0] && isPost(data.items[0])) {
            const attributes = data.items[0].metadata?.attributes
            if (attributes && attributes[0]) {
              setDonationsGoal(parseFloat(attributes[0].value ?? '0'))
            } else {
              setDonationsGoal(0)
            }
          } else {
            setDonationsGoal(0)
          }
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
      setSearchAddress(currentUser.ownedBy.address)
    }
  }, [currentUser, isAuthenticated])

  const onGoalClose = () => {
    setGoalModalOpen(false)
  }

  const onGoalOpen = () => {
    setGoalModalOpen(true)
  }
  const vhrValue = Number(data?.value)
  const displayVHRValue = isNaN(vhrValue) ? 0 : vhrValue
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
                  <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl mt-8">
                    {v('raised')}{' '}
                    {donationGoal !== 0 && `out of ${donationGoal}`}
                  </div>
                  <div className="text-3xl font-extrabold text-purple-500 dark:text-white sm:text-7xl pl-10 pr-3">
                    {displayVHRValue}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600"
                  onClick={onGoalOpen}
                  suppressHydrationWarning
                >
                  {t('set-goal')}
                </Link>
                {donationGoal !== 0 && (
                  <Progress
                    progress={displayVHRValue}
                    total={donationGoal}
                    className="mt-10 mb-10"
                  />
                )}
                {donationGoal !== 0 &&
                  (Number(data?.value) < donationGoal ? (
                    <div
                      className="text-2xl  font-semibold text-black dark:text-white sm:text-2x l"
                      suppressHydrationWarning
                    >
                      {donationGoal - Number(data?.value)} {t('away')}
                    </div>
                  ) : (
                    <div
                      className="text-2xl  font-semibold text-black dark:text-white sm:text-2xl"
                      suppressHydrationWarning
                    >
                      {t('reached')}
                    </div>
                  ))}
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
              placeholder={t('search')}
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
                label={t('filter')}
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <ClearFilters
              onClick={() => {
                setSelectedCategory('')
                setSearchValue('')
              }}
            />
          </div>
          <GridRefreshButton onClick={refetch} />

          {postDataError && <Error message={e('generic')} />}
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
